import loginPage from "./pageObjects/loginPage"
import requestAppointment from "./pageObjects/requestAppointment"
import adminDashboard from "./pageObjects/adminDashboardPage"
import appointmentsPage from "./pageObjects/appointmentsPage"
import knowledgeBasePage from "./pageObjects/knowledgeBasePage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()

describe("The user is able to navigate and login to the page", function() {
	before(function() {    
		cy.clearLocalStorage();
    });

	it("Open admin URL and login", function() {
		login.navigateAdmin()
		login.enterEmailValid()
        login.enterPasswordValid()
        login.loginSubmit()  
        login.confirmLogin() 
	})
})

describe("The user is able to add a new document - Documentation tab - Knowledge base section", function() {
     
    it("The user is able to click on the 'Knowledge base' button", function() {

    	dashboard.knowledgeBaseButton()
		
	})

	it("The user is able to click on the 'My docs' drop menu", function() {

		knowledgeBase.myDocsDropMenu()
	})

	it("The user is able to click on the 'Upload File' button, and upload file", function() {

		knowledgeBase.uploadFile()
	})
    

})


describe("The user is able to create a new template - Templates tab - Knowledge base", function() {
     
    it("The user is able to click on the 'Knowledge base' button", function() {

    	login.navigateAdmin()
    	dashboard.knowledgeBaseButton()
		
	})

	it("The user is able to click on the 'Templates' tab", function() {

		knowledgeBase.templatesTab()
	})

	it("The user is able to click on the 'New template' button", function() {

		knowledgeBase.uploadFile()
	})

	it("The user is able to poplate the 'Title' field", function() {

		knowledgeBase.templateTitle()
	})

	it("The user is able to click on the 'Save' button", function() {

		knowledgeBase.templateSaveButton()
	})
    

})

describe("The user is able to Add a new tag - <Tags> tab - Knowledge base section", function() {
     
    it("The user is able to click on the 'Knowledge base' button", function() {

    	login.navigateAdmin()
    	dashboard.knowledgeBaseButton()
		
	})

	it("The user is able to click on the '<Tags>'' tab", function() {

		knowledgeBase.tagsTab()
	})

	it("The user is able to click on the 'Add' button", function() {

		knowledgeBase.addTagButton()
	})

	it("The user is able to populate the 'Code' field", function() {

		knowledgeBase.tagCode()
	})

	it("The user is able to populate the 'Value' field", function() {

		knowledgeBase.tagValue()
	})

	it("The user is able to click on the 'Ok' button", function() {

		appointment.alertConfirmButton()
	})
    

})


describe("The user is able to download the document by clicking on the 'Download' icon - Documentation tab - Knowledge base section", function() {
     
    it("The user is able to click on the 'Knowledge base' button", function() {

    	login.navigateAdmin()
    	dashboard.knowledgeBaseButton()
		
	})

	it("The user is able to navigate to the already existing file and click on the 'Download' icon", function() {

		knowledgeBase.searchDocumentation()
		cy.wait(1000)
		knowledgeBase.downloadDocument()
	})
  

})