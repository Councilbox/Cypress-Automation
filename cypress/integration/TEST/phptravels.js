/// <reference types="cypress" />
Cypress.config('UniqueNumber', `${Math.floor(Math.random() * 10000000000000)}`)

function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  

describe('User should be able to Sign Up', function(){
    
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })

        it('Open phptravels page', function(){
            cy.visit('https://phptravels.net')
        })
        
        it('Click on My Account', function(){
            cy.xpath('(//*[@id="dropdownCurrency"])[2]').click()
        })

        it('Should click on Sign Up button', function(){
            cy.contains('Sign Up').click()
        })

        it('Should enter First Name', function(){
            cy.wait(3000)
            cy.xpath('//*[@name="firstname"]')
                .type('Test', { force: true })
        })

        it('Should enter Last Name', function(){           
            cy.xpath('//*[@name="lastname"]')
                .type('Automation', { force: true })
        })

        it('Should enter Mobile Number', function(){
            
            cy.xpath('//*[@name="phone"]')
                .type('123456', { force: true })
        })

        it('Should enter Email', function(){            
            cy.xpath('//*[@name="email"]')
                .type('test'+Cypress.config('UniqueNumber')+'@test.com', { force: true })
        })

        it('Should enter Password', function(){            
            cy.xpath('//*[@name="password"]')
                .type('mostar1234', { force: true })
        })

        it('Should enter Confirm Password', function(){            
            cy.xpath('//*[@name="confirmpassword"]')
                .type('mostar1234', { force: true })
        })

        it('Should click on Sign Up', function(){
            cy.xpath('//*[@class="signupbtn btn_full btn btn-success btn-block btn-lg"]').click()
            cy.wait(5000)
        })

})


describe('Login on page', function(){
    
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
      })

        it('Open phptravels page', function(){
            cy.visit('https://phptravels.net')
        })

        it('Click on My Account', function(){
            cy.xpath('(//*[@id="dropdownCurrency"])[2]').click()
        })

        it('Should click on Login button', function(){
            cy.contains('Login').click()
        })

        it('Should enter email', function(){
            cy.wait(3000)
            cy.xpath('//*[@name="username"]')
                .type('novi.demo.mail@gmail.com', { force: true })
        })

        it('Should enter password', function(){
            cy.xpath('//*[@name="password"]')
                .type('mostar1234', { force: true })
        })

        it('Should click on Login', function(){
            cy.xpath('//*[@class="btn btn-primary btn-lg btn-block loginbtn"]').click()
            cy.wait(5000)
        })

})

