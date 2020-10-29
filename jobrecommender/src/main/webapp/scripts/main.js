(function() {

	// event handlers

	function int() {
		// add event listener
		document.querySelector('#login-form-btn').addEventListener('click', onSessionInvalid);
		document.querySelector('#register-form-btn').addEventListener('click', showRegisterForm);
		document.querySelector('#register-btn').addEventListener('click', register);
		document.querySelector('#login-btn').addEventListener('click', login);
	}

	// global helper functions
	function hideElement(element) {
		element.style.display = 'none';
	}
	function showElement(element, style) {
		var displayStyle = style ? style : 'block';
		element.style.display = displayStyle;
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

})();