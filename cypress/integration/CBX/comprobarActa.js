

export default () => {
    let introduccion = "dato1 dato1 dato1 dato1 dato1 dato1 dato1 dato1"
    let constitucion = "dato2 dato2 dato2 dato2 dato2 dato2 dato2 dato2 dato2 dato2"
    let tomaAcuerdos = "dato3 dato3 dato3 dato3 dato3 dato3 dato3 dato3"
    let conclusion = "dato4 dato4 dato4 dato4 dato4 dato4 dato4 dato4 dato4"

    cy.url().should('contain', '/company/');

    cy.get('.itemsLateralesDash').eq(1).click();

    cy.get('.ant-tabs-tab').eq(3).click();

    cy.wait(1000)

    cy.get('.rowRedactandoActaReuniones').eq(0).click();
    cy.wait(1000)

    cy.get('.ql-editor').eq(0).clear().
        type(introduccion)
    //metemos markes
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(0).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(1).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(2).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(3).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(4).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(5).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(6).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(7).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(0).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(8).click()
    cy.wait(500)


    cy.get('.ql-editor').eq(0).find('p').then(($item) => {
        introduccion = $item.text()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor p').eq(0).should('have.text', introduccion)
        cy.wait(1000)
    })

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cy.get('.ql-editor').eq(1).clear().
        type(constitucion)
    //metemos markes
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(0).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(1).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(2).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(3).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(4).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(5).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(6).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(7).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(8).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(9).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(10).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(1).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(11).click()
    cy.wait(500)


    cy.get('.ql-editor').eq(1).find('p').then(($item) => {
        constitucion = $item.text()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor p').eq(1).should('have.text', constitucion)
        cy.wait(1000)
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cy.get('.ql-editor').eq(2).clear().
        type(tomaAcuerdos)
    //metemos markes
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(2).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(1).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(2).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(3).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(4).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(2).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(5).click()
    


    cy.get('.ql-editor').eq(2).find('p').then(($item) => {
        tomaAcuerdos = $item.text()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor p').eq(2).should('have.text', tomaAcuerdos)
        cy.wait(1000)
    })

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cy.get('.ql-editor').eq(3).clear().
        type(conclusion)
    //metemos markes
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(3).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(1).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(2).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(3).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(4).click()
    cy.wait(500)
    cy.get('.markersDropDown').eq(3).click()
    cy.wait(500)
    cy.get('.markerInDrop').eq(5).click()
    

    cy.get('.ql-editor').eq(3).find('p').then(($item) => {
        conclusion = $item.text()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor p').eq(3).should('have.text', conclusion)
        cy.wait(1000)
    })


   


}
