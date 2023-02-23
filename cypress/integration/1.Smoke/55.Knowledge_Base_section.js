import dashboardPage from "../pageObjects/dashbaordPage";
import newMeetingAgenda from "../pageObjects/newMeetingAgenda";
import newMeetingPage from "../pageObjects/newMeetingAnnoucement";
import newMeetingCensus from "../pageObjects/newMeetingCensus";
import newMeetingDocumentation from "../pageObjects/newMeetingDocumentation";
import newMeetingFinalize from "../pageObjects/newMeetingFinalize";
import newMeetingOptions from "../pageObjects/newMeetingOptions";
import newMeetingPreview from "../pageObjects/newMeetingPreview";
import loginPage from "../pageObjects/loginPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";


const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let url = Cypress.config().baseUrl;


let knowledge = new knowledgeBasePage()
let login = new loginPage()
let meetingAnnoucemenet = new newMeetingPage()
let dashboard = new dashboardPage()
let meetingCensus = new newMeetingCensus()
let meetingAgenda = new newMeetingAgenda()
let meetingDocumentation = new newMeetingDocumentation()
let meetingOptions = new newMeetingOptions()
let meetingPreview = new newMeetingPreview()
let meetingFinalize = new newMeetingFinalize()

describe("Knowledge base section", function() {

     before(function() {
        
    });

    it("Login", function() {
        const email = "alem@qaengineers.net"
        const password = "Mostar123!test"
        
        cy.log("Navigate to login page")
            cy.visit(url);
        cy.log("Change language to Spanish")
            login.click_on_language_dropmenu()
            login.select_spanish_language()
        cy.log("Enters email address")
            login.enter_email(email)
        cy.log("Enters password")
            login.enter_password(password)
        cy.log("Clicks login button")
            login.click_login()
    })


    it("The user is able to add a new document in the 'Base de conocimiento' section", function() {
    const file = "qaengineers"

    cy.log("From the menu choose and click on the 'Base de conocimiento' button")  
        dashboard.click_on_knowledge_base()
    cy.log("Click on the 'Mi documentacion' button")
        knowledge.click_on_my_docs()
    cy.log("From the drop down menu click on the 'Subir archivo' button and Choose the file you want to upload click on it and then click on 'Open' button")
        knowledge.upload_file()
    cy.log("Verify file is uploaded and delete it")
        cy.reload()
        knowledge.search_for_documentation(file)
        knowledge.verify_existing_file(file)
        knowledge.delete_file()
        knowledge.verify_file_is_deleted()
    });

    it("The user is able to create a new template in the 'Base de conocimiento' section", function() {
    const title = 'TestAutomation'+Cypress.config('UniqueNumber')
    cy.visit(url);
    cy.log("From the menu choose and click on the 'Base de conocimiento' button")
        dashboard.click_on_knowledge_base()
    cy.log("Click on the 'Plantillas' button")
        knowledge.click_on_templates_tab()
    cy.log("Click on the 'Nueva plantilla' button")
        knowledge.click_on_new_template_button()
    cy.log("Populate “Titulo” field")
        knowledge.enter_template_title(title)
    cy.log("Click on the 'Guardar' button")
        knowledge.click_on_save_template()
    });

    /*

    it("The user is able to add new tag in the 'Base de conocimiento' section", function() {
    const code = 'TestAutomation'+Cypress.config('UniqueNumber')
    const value = 'TestAutomation'+Cypress.config('UniqueNumber')
    const description = 'TestAutomation'
    cy.visit(url);
    cy.log("From the menu choose and click on the 'Base de conocimiento' button")
        dashboard.click_on_knowledge_base()
    cy.log("Click on the 'Tags' button")
        knowledge.click_on_tags_tab()
    cy.log("Click on the 'Anadir' button")
        knowledge.click_on_add_tag()
    cy.log("Populate “Clave” field")
        knowledge.enter_tag_code(code)
    cy.log("Populate “Valor” field")
        knowledge.enter_tag_value(value)
    cy.log("Populate “Descripcion” field") 
        knowledge.enter_tag_description(description)
    cy.log("Click on the 'Aceptar' button")
        knowledge.click_on_alert_accept()
    });

    */

});
