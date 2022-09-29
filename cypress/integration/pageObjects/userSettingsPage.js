const login_url = Cypress.env("baseUrl");

class userSettingsPage {
	elements = {
		my_account: () => cy.get("#user-menu-trigger"),
		user_settings: () => cy.get("#user-menu-settings"),
		user_name: () => cy.get("#user-settings-name"),
		user_surname: () => cy.get("#user-settings-surname"),
		user_phone: () => cy.get("#user-settings-phone"),
		user_email: () => cy.get("#user-settings-email"),
		save_button: () => cy.get("#user-settings-save-button"),
		user_language: () => cy.get("#user-settings-language"),

		user_email_error: () => cy.get("#user-settings-email-error-text"),
		user_surname_error: () => cy.get("#user-settings-surname-error-text"),
		user_name_error: () => cy.get("#user-settings-name-error-text"),

		change_password_button: () => cy.get("#user-change-password-button"),
		current_password: () => cy.get("#user-current-password"),
		new_password: () => cy.get("#user-password"),
		new_password_confirm: () => cy.get("#user-password-check"),
		save_password_button: () => cy.get("#user-password-save"),
		logout_button: () => cy.get("#user-menu-logout"),

		current_password_error: () =>
			cy.get("#user-current-password-error-text"),
		new_password_error: () => cy.get("#user-password-error-text"),
		new_password_confirm_error: () =>
			cy.get("#user-password-check-error-text")
	};
	click_on_the_logout_button() {
		this.elements
			.logout_button()
			.should("be.visible")
			.click();
	}

	click_on_my_account() {
		this.elements
			.my_account()
			.should("be.visible")
			.click();
	}

	verify_existing_user_name_error() {
		this.elements.user_name_error().should("be.visible");
	}

	verify_existing_user_surname_error() {
		this.elements.user_surname_error().should("be.visible");
	}

	verify_existing_user_email_error() {
		this.elements.user_email_error().should("be.visible");
	}

	verify_existing_new_password_confirm_error() {
		this.elements.new_password_confirm_error().should("be.visible");
	}

	verify_existing_new_password_error() {
		this.elements.new_password_error().should("be.visible");
	}

	verify_existing_current_password_error() {
		this.elements.current_password_error().should("be.visible");
	}

	click_on_save_password() {
		this.elements
			.save_password_button()
			.should("be.visible")
			.click();
	}

	enter_new_password_confirm(new_password) {
		this.elements
			.new_password_confirm()
			.should("be.visible")
			.clear()
			.type(new_password)
			.should("have.value", new_password);
	}

	enter_new_password(new_password) {
		this.elements
			.new_password()
			.should("be.visible")
			.clear()
			.type(new_password)
			.should("have.value", new_password);
	}

	enter_current_password(password) {
		this.elements
			.current_password()
			.should("be.visible")
			.clear()
			.type(password)
			.should("have.value", password);
	}

	click_on_change_password() {
		this.elements
			.change_password_button()
			.should("be.visible")
			.click();
	}

	click_on_user_language() {
		this.elements
			.user_language()
			.should("be.visible")
			.click();
	}

	click_on_save() {
		this.elements
			.save_button()
			.should("be.visible")
			.click();
	}

	click_on_user_settings() {
		this.elements
			.user_settings()
			.should("be.visible")
			.click();
		cy.url().should("include", "/user");
	}

	enter_user_email(email) {
		this.elements
			.user_email()
			.should("be.visible")
			.clear()
			.type(email)
			.should("have.value", email);
	}

	enter_user_phone(phone) {
		this.elements
			.user_phone()
			.should("be.visible")
			.clear()
			.type(phone)
			.should("have.value", phone);
	}

	enter_user_surname(surname) {
		this.elements
			.user_surname()
			.should("be.visible")
			.clear()
			.type(surname)
			.should("have.value", surname);
	}

	enter_user_name(name) {
		this.elements
			.user_name()
			.should("be.visible")
			.clear()
			.type(name)
			.should("have.value", name);
	}

	clear_user_name() {
		this.elements
			.user_name()
			.should("be.visible")
			.clear();
	}

	clear_user_surname() {
		this.elements
			.user_surname()
			.should("be.visible")
			.clear();
	}

	clear_user_new_password() {
		this.elements
			.new_password()
			.should("be.visible")
			.clear();
	}

	clear_user_new_password_confirm() {
		this.elements
			.new_password_confirm()
			.should("be.visible")
			.clear();
	}

	clear_user_email() {
		this.elements
			.user_email()
			.should("be.visible")
			.clear();
	}
}

export default userSettingsPage;
