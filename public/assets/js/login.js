function Login() {

}


Login.init = function () {
	let fullNameError = true;
	let emailError = true;
	let passwordError = true;
	let termError = true;
	let passConfirm = true;

	let signInEmailError = true;
	let signInPasswordError = true;

	let forgotPasswordEmailError = true;

	Parse.initialize(Config.PARSE_APP_ID);
	Parse.serverURL = Config.PARSE_SERVER_URL;

	const currentUser = Parse.User.current();
	if (currentUser) {
		window.location.href = '/dashboard';
	}

	$('#signUpDiv').hide();
	$('#forgotPasswordDiv').hide();
	$('#signUpLink').click(function (e) {
		$(this).toggleClass('active');
		e.preventDefault();
		$('.form-group').removeClass('hasError');
		$('.error').css('display', 'none');
		$('#signInDiv').hide();
		$('#signUpDiv').show();
		$('#forgotPasswordDiv').hide();
	});

	$('#signInLink').click(function (e) {
		$(this).toggleClass('active');
		e.preventDefault();
		$('.form-group').removeClass('hasError');
		$('.error').css('display', 'none');
		$('#signUpDiv').hide();
		$('#forgotPasswordDiv').hide();
		$('#signInDiv').show();
	});

	$('#forgotPasswordLink').click(function (e) {
		$(this).toggleClass('active');
		e.preventDefault();
		$('.form-group').removeClass('hasError');
		$('.error').css('display', 'none');
		$('#signUpDiv').hide();
		$('#signInDiv').hide();
		$('#forgotPasswordDiv').show();
	});


	$('input').focus(function () {
		$(this).siblings('label').addClass('active');
	});

	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
		$('.form form label').addClass('fontSwitch');
	}


	$('#loader').css('display', 'none');
	$('#signInMessage').css('display', 'none');

	$('#signUpLoader').css('display', 'none');
	$('#signUpMessage').css('display', 'none');

	$('#forgotPasswordLoader').css('display', 'none');
	$('#forgotPasswordMessage').css('display', 'none');


	$('.profile').click(Login.clickProfileButton);

	$('#signInForgotPasswordForm').click(Login.clickSignInForgotPasswordLink);
	$('.sign-in').click(Login.clickSignInHeaderButton);


	// clear user local datastorage
	// Parse.User.logOut();


	$('input').blur(function () {
		// Email
		if ($(this).hasClass('email')) {
			if ($(this).val().length == '' || !(Validator.isValidEmail($(this).val()))) {
				$(this).siblings('span.error').text('Please type your email address').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				emailError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				emailError = false;
			}
		}

		// PassWord
		if ($(this).hasClass('pass')) {
			if ($(this).val().length < 6) {
				$(this).siblings('span.error').text('Please type at least 6 characters').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				passwordError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				passwordError = false;
			}
		}

		// PassWord confirmation
		if ($('.pass').val() !== $('.passConfirm').val()) {
			$('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn()
				.parent('.form-group')
				.addClass('hasError');
			passConfirm = true;
		} else {
			$('.passConfirm').siblings('.error').text('').fadeOut()
				.parent('.form-group')
				.removeClass('hasError');
			passConfirm = false;
		}

		// User Name
		if ($(this).hasClass('name')) {
			if ($(this).val().length === 0) {
				$(this).siblings('span.error').text('Please type your full name').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				fullNameError = true;
			} else if ($(this).val().length > 1 && $(this).val().length < 6) {
				$(this).siblings('span.error').text('Please type at least 6 characters').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				fullNameError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				fullNameError = false;
			}
		}

		if ($(this).hasClass('label-icon')) {
			if (!$('#signUpTerms').is(':checked')) {
				$(this).siblings('span.error').text('Please agree term and conditions').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				termError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				termError = false;
			}
		}


		if ($(this).hasClass('signin-email')) {
			if ($(this).val().length == '' || !(Validator.isValidEmail($(this).val()))) {
				$(this).siblings('span.error').text('Please enter your email address').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				signInEmailError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				signInEmailError = false;
			}
		}

		// PassWord
		if ($(this).hasClass('signin-pass')) {
			if ($(this).val().length < 1) {
				$(this).siblings('span.error').text('Please enter your password').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				signInPasswordError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				signInPasswordError = false;
			}
		}


		if ($(this).hasClass('forgotpassword-email')) {
			if ($(this).val().length == '' || !(Validator.isValidEmail($(this).val()))) {
				$(this).siblings('span.error').text('Please enter your email address').fadeIn()
					.parent('.form-group')
					.addClass('hasError');
				forgotPasswordEmailError = true;
			} else {
				$(this).siblings('.error').text('').fadeOut()
					.parent('.form-group')
					.removeClass('hasError');
				forgotPasswordEmailError = false;
			}
		}


		// label effect
		if ($(this).val().length > 0) {
			$(this).siblings('label').addClass('active');
		} else {
			$(this).siblings('label').removeClass('active');
		}
	});

	$('form.signup-form').submit((event) => {
		event.preventDefault();

		if (fullNameError == true || emailError == true || passwordError == true || passConfirm == true || termError == true) {
			$('.name, .email, .pass, .passConfirm,.label-icon').blur();
		} else {
			const email = $('#signUpEmail').val();
			const phone = $('#signUpPhone').val();
			const password = $('#signUpPassword').val();
			const name = $('#signUpName').val();
			const agreed = $('#signUpTerms').is(':checked');


			const user = new Parse.User();
			user.set('username', email);
			user.set('password', password);
			user.set('email', email);
			user.set('name', name);
			user.set('phone', phone);
			user.set('termsAgreed', agreed);


			$('#signUpLoader').css('display', 'block');

			user.signUp(null).then(
				(user) => {
					$('#signUpLoader').css('display', 'none');
					setTimeout(() => { $('.signup, .login').hide(); }, 700);
					setTimeout(() => { $('.brand').addClass('active'); }, 300);
					setTimeout(() => { $('.heading').addClass('active'); }, 600);
					setTimeout(() => { $('.success-msg p').addClass('active'); }, 900);
					setTimeout(() => { $('.success-msg a').addClass('active'); }, 1050);
					setTimeout(() => { $('.form').hide(); }, 700);
				},
				(error) => {
					$('#signUpLoader').css('display', 'none');
					$('#signUpMessage').css('display', 'block');
					$('#signUpMessage').text(error.message);
				},
			);
		}
	});


	$('form.login-form').submit((event) => {
		event.preventDefault();
		const email = $('#signInEmail').val();
		const password = $('#signInPassword').val();
		if (email == '' || password == '') {
			$('.signin-email, .signin-pass').blur();
		} else {
			$('#loader').css('display', 'block');

			Parse.User.logIn(email, password).then(
				(user) => {
					$('#loader').css('display', 'none');
					$('#signInMessage').css('display', 'block');
					$('#signInMessage').text('');
					window.location.href = '/dashboard';
				},
				(error) => {
					$('#loader').css('display', 'none');
					$('#signInMessage').css('display', 'block');
					$('#signInMessage').text(error.message);
				},
			);
		}
	});


	$('form.forgotpassword-form').submit((event) => {
		event.preventDefault();

		if (forgotPasswordEmailError == true) {
			$('.forgotpassword-email').blur();
		} else {
			$('#forgotPasswordLoader').css('display', 'block');
			const email = $('#forgotPasswordEmail').val();
			Parse.User.requestPasswordReset(email).then(
				() => {
					$('#forgotPasswordMessage').css('display', 'block');
					$('#forgotPasswordMessage').css('color', 'white');
					$('#forgotPasswordMessage').text('Password reset link has been sent.');
					$('#forgotPasswordLoader').css('display', 'none');
				},
				(error) => {
					$('#forgotPasswordMessage').css('display', 'block');
					$('#forgotPasswordMessage').css('color', 'red');
					$('#forgotPasswordMessage').text(error.message);
					$('#forgotPasswordLoader').css('display', 'none');
				},
			);
		}
	});
};

Login.clickProfileButton = function () {
	$('#signInDiv').show();
	setTimeout(() => { $('.brand').removeClass('active'); }, 300);
	setTimeout(() => { $('.heading').removeClass('active'); }, 300);
	setTimeout(() => { $('.success-msg p').removeClass('active'); }, 300);
	setTimeout(() => { $('.success-msg a').removeClass('active'); }, 300);
	setTimeout(() => { $('.form').show(); }, 700);
	setTimeout(() => { $('.login').show(); }, 700);
	setTimeout(() => { $('.signup').show(); }, 700);
	setTimeout(() => { $('#signInDiv').show(); }, 700);
	setTimeout(() => { $('#signUpDiv').hide(); }, 700);
	setTimeout(() => { $('#forgotPasswordDiv').hide(); }, 700);
};

Login.clickSignInForgotPasswordLink = function () {
	$('#signUpDiv').hide();
	$('#signInDiv').show();
	$('#forgotPasswordDiv').hide();
};

Login.clickSignInHeaderButton = function () {
	$('#signUpDiv').hide();
	$('#signInDiv').show();
	$('#forgotPasswordDiv').hide();
};
