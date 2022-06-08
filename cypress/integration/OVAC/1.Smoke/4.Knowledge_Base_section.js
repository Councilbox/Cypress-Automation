import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import adminDashboard from "../pageObjects/adminDashboardPage"
import appointmentsPage from "../pageObjects/appointmentsPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import templatesPage from "../pageObjects/templatesPage"
import tagsPage from "../pageObjects/tagsPage"
import documentationPage from "../pageObjects/documentationPage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()
let templates = new templatesPage()
let tags = new tagsPage()
let documentation = new documentationPage()

describe("The user is able to navigate and login to the page", function() {
	before(function() {    
		cy.clearLocalStorage();
    });
	const email = "alem+1@qaengineers.net"
	const password = "Mostar123!"
	it("Open admin URL and login", function() {
		login.navigate_admin()
		login.enter_email(email)
        login.enter_password(password)
        login.login_submit()  
        login.confirm_login() 
	})
})

describe("The user is able to add a new document - Documentation tab - Knowledge base section", function() {
     
    it("The user is able to click on the 'Documentations' button", function() {
    	dashboard.click_on_documentation()
	})

	it("The user is able to click on the '+' button", function() {
		knowledgeBase.click_add_button()
	})

	it("The user is able to click on the 'Upload file' button and upload a file", function() {
		knowledgeBase.upload_file()
	})
})

describe("The user is able to create a new template - Templates tab - Knowledge base", function() {
     const title = "Tab"+Cypress.config('UniqueNumber')

    it("The user is able to click on the 'Templates' button", function() {
    	login.navigate_admin()
    	dashboard.click_on_templates()
	})

	it("The user is able to click on the '+' button", function() {
		templates.click_add_button()
	})

	it("The user is able to choose 'New' option", function() {
		templates.click_new()
	})

	it("The user is able to populate the 'Title' filed", function() {
		templates.enter_title(title)
	})

	it("The user is able to click on the 'Save' button", function() {
		templates.click_save()
	})
})

describe("The user is able to Add a new tag - <Tags> tab - Knowledge base section", function() {
	const code = "Code"+Cypress.config('UniqueNumber')
	const value = "12345"
     
    it("The user is able to click on the 'Tags' button", function() {
    	login.navigate_admin()
    	dashboard.click_on_tags()
	})

	it("The user is able to click on the 'Add' button", function() {
		tags.click_add_button()
	})

	it("The user is able to populate the 'Code field'", function() {
		tags.enter_code(code)
	})

	it("The user is able to populate the 'Value' field", function() {
		tags.enter_value(value)
	})

	it("The user is able to click on the 'SAVE' button", function() {
		tags.click_save()
	})  
})

describe("The user is able to download the document by clicking on the 'Download' icon - Documentation tab - Knowledge base section", function() {
    const search_data = "Test document" 

    it("The user is able to click on the 'Documents' button", function() {
    	login.navigate_admin()
    	dashboard.click_on_documentation()
	})

	it("The user is able to navigate to the already existing file and click on the 'Download' icon", function() {
		documentation.search_documentation(search_data)
		documentation.click_download()
		documentation.verify_download()
	})
})