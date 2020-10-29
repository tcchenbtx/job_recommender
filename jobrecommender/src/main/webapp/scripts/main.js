(function() {

	// event handlers

	function int() {
		// add event listener
		document.querySelector('#login-form-btn').addEventListener('click', onSessionInvalid);
		document.querySelector('#register-form-btn').addEventListener('click', showRegisterForm);
		document.querySelector('#register-btn').addEventListener('click', register);
		document.querySelector('#login-btn').addEventListener('click', login);
		document.querySelector('#nearby-btn').addEventListener('click', loadNearbyItems);
		document.querySelector('#fav-btn').addEventListener('click', loadFavoriteItems);


	}

	// global helper functions
	function hideElement(element) {
		element.style.display = 'none';
	}
	function showElement(element, style) {
		var displayStyle = style ? style : 'block';
		element.style.display = displayStyle;
	}
	function activeBtn(btnId) {
		var btns = document.querySelectorAll('.main-nav-btn');
		// deactivate all navigation buttons
		for (var i = 0; i < btns.length; i++) {
			btns[i].className = btns[i].className.replace(/\bactive\b/, '');
		}
		// active the one that has id = btnId
		var btn = document.querySelector('#' + btnId);
		btn.className += ' active';
	}
	function ajax(method, url, data, successCallback, errorCallback) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.onload = function() {
			if (xhr.status === 200) {
				successCallback(xhr.responseText);
			} else {
				errorCallback();
			}
		};
		xhr.onerror = function() {
			console.error("The request couldn't be completed.");
			errorCallback();
		};
		if (data === null) {
			xhr.send();
		} else {
			xhr.setRequestHeader("Content-Type",
				"application/json;charset=utf-8");
			xhr.send(data);
		}
	}
	function showLoadingMessage(msg) {
		var itemList = document.querySelector('#item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> ' +
			msg + '</p>';
	}
	function showWarningMessage(msg) {
		var itemList = document.querySelector('#item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> ' +
			msg + '</p>';
	}
	function showErrorMessage(msg) {
		var itemList = document.querySelector('#item-list');
		itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> ' +
			msg + '</p>';
	}
	function $create(tag, options) {
		var element = document.createElement(tag);
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				element[key] = options[key];
			}
		}
		return element;
	}

	// onSessionInvalid
	function onSessionInvalid() {
		var loginForm = document.querySelector('#login-form');
		var registerForm = document.querySelector('#register-form');
		var itemNav = document.querySelector('#item-nav');
		var itemList = document.querySelector('#item-list');
		var avatar = document.querySelector('#avatar');
		var welcomeMsg = document.querySelector('#welcome-msg');
		var logoutBtn = document.querySelector('#logout-link');

		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(logoutBtn);
		hideElement(welcomeMsg);
		hideElement(registerForm);

		clearLoginError();
		showElement(loginForm);
	}
	function clearLoginError() {
		document.querySelector('#login-error').innerHTML = '';
	}

	// showRegisterForm
	function showRegisterForm() {
		var loginForm = document.querySelector('#login-form');
		var registerForm = document.querySelector('#register-form');
		var itemNav = document.querySelector('#item-nav');
		var itemList = document.querySelector('#item-list');
		var avatar = document.querySelector('#avatar');
		var welcomeMsg = document.querySelector('#welcome-msg');
		var logoutBtn = document.querySelector('#logout-link');

		hideElement(itemNav);
		hideElement(itemList);
		hideElement(avatar);
		hideElement(logoutBtn);
		hideElement(welcomeMsg);
		hideElement(loginForm);

		clearRegisterResult();
		showElement(registerForm);
	}
	function clearRegisterResult() {
		document.querySelector('#register-result').innerHTML = '';
	}

	// register
	function register() {
		var username = document.querySelector('#register-username').value;
		var password = document.querySelector('#register-password').value;
		var firstName = document.querySelector('#register-first-name').value;
		var lastName = document.querySelector('#register-last-name').value;

		if (username === "" || password == "" || firstName === "" || lastName === "") {
			showRegisterResult('Please fill in all fields');
			return
		}
		if (username.match(/^[a-z0-9_]+$/) === null) {
			showRegisterResult('Invalid username');
			return
		}
		password = md5(username + md5(password));
		// The request parameters
		var url = './register';
		var req = JSON.stringify({
			user_id: username,
			password: password,
			first_name: firstName,
			last_name: lastName,
		});

		ajax('POST', url, req,
			// successful callback
			function(res) {
				var result = JSON.parse(res);

				// successfully logged in
				if (result.status === 'OK') {
					showRegisterResult('Succesfully registered');
				} else {
					showRegisterResult('User already existed');
				}
			},
			// error
			function() {
				showRegisterResult('Failed to register');
			});
	}

	function showRegisterResult(registerMessage) {
		document.querySelector('#register-result').innerHTML = registerMessage;
	}

	function clearRegisterResult() {
		document.querySelector('#register-result').innerHTML = '';
	}

	// login
	function login() {
		var username = document.querySelector('#username').value;
		var password = document.querySelector('#password').value;
		password = md5(username + md5(password));

		// The request parameters
		var url = './login';
		var req = JSON.stringify({
			user_id: username,
			password: password,
		});

		ajax('POST', url, req,
			// successful callback
			function(res) {
				var result = JSON.parse(res);

				// successfully logged in
				if (result.status === 'OK') {
					onSessionValid(result);
				}
			},
			// error
			function() {
				showLoginError();
			});
	}

	function showLoginError() {
		document.querySelector('#login-error').innerHTML = 'Invalid username or password';
	}

	function clearLoginError() {
		document.querySelector('#login-error').innerHTML = '';
	}

	// loadNearbyItems
	function loadNearbyItems() {
		console.log('loadNearbyItems');
		activeBtn('nearby-btn');

		// The request parameters
		var url = './search';
		var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
		var data = null;

		// display loading message
		showLoadingMessage('Loading nearby items...');

		// make AJAX call
		ajax('GET', url + '?' + params, data,
			// successful callback
			function(res) {
				var items = JSON.parse(res);
				if (!items || items.length === 0) {
					showWarningMessage('No nearby item.');
				} else {
					listItems(items);
				}
			},
			// failed callback
			function() {
				showErrorMessage('Cannot load nearby items.');
			}
		);
	}

	// loadFavoriteItems
	function loadFavoriteItems() {
		activeBtn('fav-btn');

		// request parameters
		var url = './history';
		var params = 'user_id=' + user_id;
		var req = JSON.stringify({});

		// display loading message
		showLoadingMessage('Loading favorite items...');

		// make AJAX call
		ajax('GET', url + '?' + params, req, function(res) {
			var items = JSON.parse(res);
			if (!items || items.length === 0) {
				showWarningMessage('No favorite item.');
			} else {
				listItems(items);
			}
		}, function() {
			showErrorMessage('Cannot load favorite items.');
		});
	}

})();