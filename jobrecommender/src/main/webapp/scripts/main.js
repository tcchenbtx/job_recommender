(function() {

	// event handlers

	function int() {
		// add event listener
		document.querySelector('#login-form-btn').addEventListener('click', onSessionInvalid);
		document.querySelector('#register-form-btn').addEventListener('click', showRegisterForm);
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

})();