const login_url = Cypress.env("baseUrl");

class loginPage {
	elements = {
		email: () => cy.get("#username"),
		password: () => cy.get("#password"),
		login_button: () => cy.get("#login-button"),

		//login
		username_error: () => cy.get("#username-helper-text"),
		login_password_error: () => cy.get("#password-helper-text"),
		//homepage
		sign_up_button: () => cy.get("#sign-up-button"),
		language_dropmenu: () => cy.get("#language-selector"),

		english: () => cy.get("#language-en"),
		spanish: () => cy.get("#language-es"),
		catala: () => cy.get("#language-cat"),
		galego: () => cy.get("#language-gal"),
		euskera: () => cy.get("#language-eu"),
		french: () => cy.get("#language-fr"),
		portuges: () => cy.get("#language-pt"),
		polsku: () => cy.get("#language-pl"),

		//forgot_pw
		forgot_password: () => cy.get("#restore-password-link"),
		restore_password_button: () => cy.get("#restore-password-button"),
		restore_password_email_input: () =>
			cy.get("#restore-password-email-input"),

		//signup
		send_button: () => cy.get("#create-user-button"),
		signup_name: () => cy.get("#signup-name"),
		signup_surname: () => cy.get("#signup-surname"),
		signup_phone: () => cy.get("#signup-phone"),
		signup_email: () => cy.get("#signup-email"),
		signup_email_confirm: () => cy.get("#signup-email-check"),
		signup_password: () => cy.get("#signup-password"),
		signup_password_confirm: () => cy.get("#signup-password-check"),
		signup_legal_terms: () => cy.get("#accept-legal-checkbox"),
		signup_back_button: () => cy.get("#signup-back-button"),
		//erros
		name_error: () => cy.get("#create-account-name-error"),
		surname_error: () => cy.get("#create-account-surname-error"),
		phone_error: () => cy.get("#create-account-phone-error"),
		email_error: () => cy.get("#create-account-mail-error"),
		password_error: () => cy.get("#create-account-password-error"),
		legal_terms_error: () => cy.get("#legal-terms-error-text"),
		email_confirm_error: () => cy.get("#create-account-repeat-mail-error"),
		password_confirm_error: () =>
			cy.get("#create-account-repeat-password-error"),

		restore_password_email_error: () =>
			cy.xpath(
				'//*[@id="root"]/div[1]/div/div/div[1]/div/div/div[2]/div/div[1]/div/div[2]/div/div/div[3]/div[2]'
			)
	};

	click_on_the_signup_back_button() {
		this.elements.should("be.visible").click();
	}

	enter_email(email) {
		this.elements
			.email()
			.should("be.visible")
			.clear()
			.type(email)
			.should("have.value", email);
	}

	select_polish_language() {
		this.elements
			.polsku()
			.should("be.visible")
			.click();
	}

	enter_email_restore_password(email) {
		this.elements
			.restore_password_email_input()
			.should("be.visible")
			.clear()
			.type(email)
			.should("have.value", email);
	}

	verify_existing_restore_password_email_error() {
		this.elements.restore_password_email_error().should("be.visible");
	}

	click_on_restore_password() {
		this.elements
			.restore_password_button()
			.should("be.visible")
			.click();
	}

	click_on_forgot_password() {
		this.elements
			.forgot_password()
			.should("be.visible")
			.click();
		cy.url().should("include", "/pwdRecovery");
	}

	select_english_language() {
		this.elements
			.english()
			.should("be.visible")
			.click();
	}

	select_portugese_language() {
		this.elements
			.portuges()
			.should("be.visible")
			.click();
	}

	select_spanish_language() {
		this.elements
			.spanish()
			.should("be.visible")
			.click();
	}

	select_catala_language() {
		this.elements
			.catala()
			.should("be.visible")
			.click();
	}

	select_galego_language() {
		this.elements
			.galego()
			.should("be.visible")
			.click();
	}

	select_euskera_language() {
		this.elements
			.euskera()
			.should("be.visible")
			.click();
	}

	select_french_language() {
		this.elements
			.french()
			.should("be.visible")
			.click();
	}

	click_on_language_dropmenu() {
		this.elements
			.language_dropmenu()
			.should("be.visible")
			.click();
	}

	verify_existing_login_password_error() {
		this.elements.login_password_error().should("be.visible");
	}

	verify_existing_username_error() {
		this.elements.username_error().should("be.visible");
	}

	verify_existing_password_confirm_error() {
		this.elements.password_confirm_error().should("be.visible");
	}

	verify_existing_email_confirm_error() {
		this.elements.email_confirm_error().should("be.visible");
	}

	enter_signup_password(password) {
		this.elements
			.signup_password()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
	}

	enter_signup_password_confirm(password_confirm) {
		this.elements
			.signup_password_confirm()
			.should("be.visible")
			.clear()
			.type(password_confirm)
			.should("have.value", password_confirm);
	}

	enter_signup_name(name, name2) {
		this.elements
			.signup_name()
			.should("be.visible")
			.clear()
			.type(name)
			.should("have.value", name);
	}

	enter_signup_surname(surname) {
		this.elements
			.signup_surname()
			.should("be.visible")
			.clear()
			.type(surname)
			.should("have.value", surname);
	}

	enter_signup_phone(phone) {
		this.elements
			.signup_phone()
			.should("be.visible")
			.clear()
			.type(phone)
			.should("have.value", phone);
	}

	enter_signup_email_and_confirm_it(email) {
		this.elements
			.signup_email()
			.should("be.visible")
			.clear()
			.type(email);
		this.elements
			.signup_email_confirm()
			.should("be.visible")
			.clear()
			.type(email)
			.should("have.value", email);
	}

	enter_signup_email(email) {
		this.elements
			.signup_email()
			.should("be.visible")
			.clear()
			.type(email);
	}

	enter_signup_email_confirm(email_confirm) {
		this.elements
			.signup_email_confirm()
			.should("be.visible")
			.clear()
			.type(email_confirm)
			.should("have.value", email_confirm);
	}

	enter_signup_password_and_confirm_it(password) {
		this.elements
			.signup_password()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
		this.elements
			.signup_password_confirm()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
	}

	accept_terms() {
		this.elements.signup_legal_terms().click();
	}

	verify_existing_name_error() {
		this.elements.name_error().should("be.visible");
	}

	verify_existing_surname_error() {
		this.elements.surname_error().should("be.visible");
	}

	verify_existing_phone_error() {
		this.elements.phone_error().should("be.visible");
	}

	verify_existing_email_error() {
		this.elements.email_error().should("be.visible");
	}

	verify_existing_password_error() {
		this.elements.password_error().should("be.visible");
	}

	verify_existing_legal_terms_error() {
		this.elements.legal_terms_error().should("be.visible");
	}

	click_on_send() {
		this.elements
			.send_button()
			.should("be.visible")
			.click();
	}

	click_on_sign_up_button() {
		this.elements
			.sign_up_button()
			.should("be.visible")
			.click();
		cy.url().should("include", "/signup");
	}

	enter_password(password) {
		this.elements
			.password()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
	}

	click_login() {
		this.elements
			.login_button()
			.should("be.visible")
			.click();
	}

	login(email, password) {
		cy.clearLocalStorage();
		cy.visit(login_url);
		this.elements
			.email()
			.should("be.visible")
			.clear()
			.type(email)
			.should("have.value", email);
		this.elements
			.password()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
		this.elements
			.login_button()
			.should("be.visible")
			.click();
		cy.url().should("include", "/company");
	}
}

export default loginPage;
