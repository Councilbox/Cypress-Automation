import loginPage from "../pageObjects/loginPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import templatesPage from "../pageObjects/templatesPage"
import tagsPage from "../pageObjects/tagsPage"
import documentationPage from "../pageObjects/documentationPage"
import entitiesPage from "../pageObjects/entitiesPage"

let url = Cypress.config().baseUrl;

import users from "/cypress/fixtures/OVAC/users.json"
import knowledge_data from "/cypress/fixtures/OVAC/knowledge_data.json"

let login = new loginPage();
let dashboard = new adminDashboard()
let knowledgeBase = new knowledgeBasePage()
let templates = new templatesPage()
let tags = new tagsPage()
let documentation = new documentationPage()
let entit = new entitiesPage()

describe("Knowledge base section", function() {
	before(function() {    
    });

	it("The user is able to navigate and login to the page", function() {
			cy.clearLocalStorage();
		cy.log("Open admin URL and login")
			cy.visit(url+'/admin')
			login.enter_email(users.email)
        	login.enter_password(users.password)
        	login.login_submit()  
        	login.confirm_login() 
		cy.log("Select OVAC Demo entity")
        	entit.click_on_entity()
        	entit.if_entity()

	})
	it("The user is able to add a new document - Documentation tab", function() {
    	cy.log("The user is able to click on the 'Documentations' button")
    		dashboard.click_on_documentation()
		cy.log("The user is able to click on the '+' button")
			knowledgeBase.click_add_button()
		cy.log("The user is able to click on the 'Upload file' button and upload a file")
			knowledgeBase.upload_file()
	})

	it("The user is able to create a new template - Templates tab", function() {
    	cy.log("The user is able to click on the 'Templates' button")
    		cy.visit(url+'/admin')
    		dashboard.click_on_templates()
		cy.log("The user is able to click on the '+' button")
			templates.click_add_button()
		cy.log("The user is able to choose 'New' option")
			templates.click_new()
		cy.log("The user is able to populate the 'Title' filed")
			templates.enter_title(knowledge_data.template_name+Cypress.config('UniqueNumber'))
		cy.log("The user is able to click on the 'Save' button")
			templates.click_save()
	})

	it("The user is able to Add a new tag - <Tags> tab - Knowledge base section", function() {
    	cy.log("The user is able to click on the 'Tags' button")
			cy.visit(url+'/admin')
    		dashboard.click_on_tags()
		cy.log("The user is able to click on the 'Add' button")
			tags.click_add_button()
		cy.log("The user is able to populate the 'Code field'")
			tags.enter_code(knowledge_data.tag_name+Cypress.config('UniqueNumber'))
		cy.log("The user is able to populate the 'Value' field")
			tags.enter_value(knowledge_data.value)
		cy.log("The user is able to click on the 'SAVE' button")
			tags.click_save()
	})  

	it("The user is able to download the document by clicking on the 'Download' icon - Documentation tab", function() {
    	cy.log("The user is able to click on the 'Documents' button")
    		cy.visit(url+'/admin')
    		dashboard.click_on_documentation()
		cy.log("The user is able to navigate to the already existing file and click on the 'Download' icon")
			documentation.search_documentation(knowledge_data.search_data)
			documentation.click_download()
			documentation.verify_download()
	})
	
})