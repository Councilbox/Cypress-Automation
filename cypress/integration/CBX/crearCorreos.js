
const mail1 = "mailTest1"
const mail2 = "mailTest2"
const mail3 = "mailTest2 "

export default () => {


    cy.get(".form-control").type(mail2)
    cy.get(".btn.btn-dark").click()

    // cy.wait(60000)

    //listado en mailinato .even.pointer.ng-scope

    cy.get(".even.pointer.ng-scope").first().click()
    cy.wait(1500)
    //link en mail
    // cy.get(".btn-access-room").should('have.attr', 'href').then((href) => {
    //     cy.log(href)
    //     cy.visit(href)
    // })
    // cy.get(".btn-access-room").click()

    cy.get("#msg_body").then((iframe) => {
        const doc = iframe.first().contents()

        // cy.wrap(doc.find(".btn-access-room")).click({ force: true })
        cy.wrap(doc.find(".btn-access-room")).should('have.attr', 'href').then((href) => {
            // // window.open(href)
            // var w1 = window.open(href, '_self');
            // w1.location.href = href;

            // cy.go(href)
            // cy.visit(href)
            // cy.wait(500)
            // cy.reload()
            var newTabs = [];

            newTabs.push(window.open(href, "_blank"));
            cy.log(newTabs)
            // newTabs[0].focus();
        })
    })

    //funciona pero reedirige a otra pagina!.
    // cy.get("#msg_body").then((iframe)=>{
    //     const doc = iframe.first().contents()
    //     doc.find(".btn-access-room").click(()=>{
    //         console.log("clik")
    //     })
    //     cy.wrap(doc.find(".btn-access-room")).click({force:true})
    // })




}