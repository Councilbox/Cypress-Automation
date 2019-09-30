const nombre = "RaazonSocial"
const Cif = Math.floor((Math.random() * 1000) + 100).toString()
const Nacionalidad = "Nacionalidad"
const Email = "Email@asd.com"
const Telefono = "Teléfono"
const Telefonofijo = "Teléfono fijo"
const Tipodesocio = "Tipo de socio"
const actadealta = "27 de Febrero de 2019"
const actadebaja = "27 de Febrero de 2019"
const fechaapertura = "27 de Febrero de 2019"
const fechaalta = "27 de Febrero de 2019"
const fechaactadealta = "27 de Febrero de 2019"
const fechabaja = "27 de Febrero de 2019"
const fechaactabaja = "27 de Febrero de 2019"
const direccion = "direccion"
const Provincia = "Provincia"
const Localidad = "Localidad"
const cp = "56456"
let Observaciones = "Observaciones Observaciones Observaciones"
////// Representante
const rNombre = "rNombre"
const rApellido = "rApellido"
const rDNI = "rDNI"
const rNacionalidad = "rNacionalidad"
const rEmail = "rEmail"
const rTelefono = "rTelefono"
const rTelefonoFijo = "rTelefonoFijo"
const rCargo = "rCargo"
const rDireccion = "rDireccion"
const rLocalidad = "rLocalidad"
const rProvincia = "rProvincia"
const rCP = "rCP"
let rObservaciones = "rObservaciones rObservaciones"


export default () => {

    cy.url().should('contain', '/company/');

    cy.get('#edit-company-block').click();

    cy.get('#anadirSocioLibroSocios').click();

    cy.get('#addSocioPersonaJuridica').click();

    cy.wait(1000)

    cy.get("#anadirSocioRazonSocial").type(nombre).should('have.value', nombre)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRazonSocial").type(nombre).should('have.value', nombre)

    cy.get("#anadirSocioDni").type(Cif).should('have.value', Cif)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioDni").type(Cif).should('have.value', Cif)

    cy.get("#anadirSocioNAcionalidad").type(Nacionalidad).should('have.value', Nacionalidad)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioNAcionalidad").type(Nacionalidad).should('have.value', Nacionalidad)

    cy.get("#anadirSocioMail").type(Email).should('have.value', Email)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioMail").type(Email).should('have.value', Email)

    cy.get("#anadirSocioTelefono").type(Telefono).should('have.value', Telefono)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioTelefono").type(Telefono).should('have.value', Telefono)

    cy.get("#anadirSocioFijo").type(Telefonofijo).should('have.value', Telefonofijo)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioFijo").type(Telefonofijo).should('have.value', Telefonofijo)

    cy.get("#anadirSocioTipoSocio").type(Tipodesocio).should('have.value', Tipodesocio)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioTipoSocio").type(Tipodesocio).should('have.value', Tipodesocio)

    cy.get("#anadirSocioActaAlta").type(actadealta).should('have.value', actadealta)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioActaAlta").type(actadealta).should('have.value', actadealta)

    cy.get("#anadirSocioActaBaja").type(actadebaja).should('have.value', actadebaja)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioActaBaja").type(actadebaja).should('have.value', actadebaja)
    
    cy.get("#anadirSocioAperturaFicha").type(fechaapertura).should('have.value', fechaapertura)
    cy.wait(1000)
    cy.get(".MuiButtonBase-root-272.MuiButton-root-257").last().click()
    cy.wait(500)
    
    cy.get("#anadirSocioFechaAlta").type(fechaalta).should('have.value', fechaalta)
    cy.wait(1000)
    cy.get(".MuiButtonBase-root-272.MuiButton-root-257").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaAlta2").type(fechaactadealta).should('have.value', fechaactadealta)
    cy.wait(1000)
    cy.get(".MuiButtonBase-root-272.MuiButton-root-257").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaBaja").type(fechabaja).should('have.value', fechabaja)
    cy.wait(1000)
    cy.get(".MuiButtonBase-root-272.MuiButton-root-257").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaBaja2").type(fechaactabaja).should('have.value', fechaactabaja)
    cy.wait(1000)
    cy.get(".MuiButtonBase-root-272.MuiButton-root-257").last().click()
    cy.wait(500)

    cy.get("#anadirSocioDireccion").type(direccion).should('have.value', direccion)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioDireccion").type(direccion).should('have.value', direccion)

    cy.get("#anadirSocioLocalidad").type(Localidad).should('have.value', Localidad)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioLocalidad").type(Localidad).should('have.value', Localidad)

    cy.get("#anadirSocioProvincia").type(Provincia).should('have.value', Provincia)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioProvincia").type(Provincia).should('have.value', Provincia)

    cy.get("#anadirSocioCP").type(cp).should('have.value', cp)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioCP").type(cp).should('have.value', cp)

    //Representante

    cy.get("#anadirSocioRepresentanteNombre").type(rNombre).should('have.value', rNombre)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteNombre").type(rNombre).should('have.value', rNombre)

    cy.get("#anadirSocioRepresentanteApellido").type(rApellido).should('have.value', rApellido)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteApellido").type(rApellido).should('have.value', rApellido)

    cy.get("#anadirSocioRepresentanteDNI").type(rDNI).should('have.value', rDNI)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteDNI").type(rDNI).should('have.value', rDNI)

    cy.get("#anadirSocioRepresentanteNacionalidad").type(rNacionalidad).should('have.value', rNacionalidad)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteNacionalidad").type(rNacionalidad).should('have.value', rNacionalidad)

    cy.get("#anadirSocioRepresentanteEmail").type(rEmail).should('have.value', rEmail)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteEmail").type(rEmail).should('have.value', rEmail)

    cy.get("#anadirSocioRepresentanteTelefono").type(rTelefono).should('have.value', rTelefono)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteTelefono").type(rTelefono).should('have.value', rTelefono)

    cy.get("#anadirSocioRepresentanteTelefonoFijo").type(rTelefonoFijo).should('have.value', rTelefonoFijo)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteTelefonoFijo").type(rTelefonoFijo).should('have.value', rTelefonoFijo)

    cy.get("#anadirSocioRepresentanteCargo").type(rCargo).should('have.value', rCargo)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteCargo").type(rCargo).should('have.value', rCargo)

    cy.get("#anadirSocioRepresentanteDireccion").type(rDireccion).should('have.value', rDireccion)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteDireccion").type(rDireccion).should('have.value', rDireccion)

    cy.get("#anadirSocioRepresentanteLocalidad").type(rLocalidad).should('have.value', rLocalidad)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteLocalidad").type(rLocalidad).should('have.value', rLocalidad)

    cy.get("#anadirSocioRepresentanteProvincia").type(rProvincia).should('have.value', rProvincia)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteProvincia").type(rProvincia).should('have.value', rProvincia)

    cy.get("#anadirSocioRepresentanteCP").type(rCP).should('have.value', rCP)
        // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        // .type('{del}{selectall}{backspace}')
        // .type('{alt}{option}')
        // .type('{ctrl}{control}')
        // .type('{meta}{command}{cmd}')
        // .type('{shift}')
    // cy.get("#anadirSocioRepresentanteCP").type(rCP).should('have.value', rCP)





    //hay k guardar
    cy.get("#guardarAnadirSocio").click()

    cy.wait(5000)

    cy.get(".rowLibroSocios").each(function ($row, index) {
        if($row.find("td").eq(2).text() === Cif){
            cy.get(".rowLibroSocios").eq(index).click()
        }
    })



    cy.wait(3000)

    cy.get("#anadirSocioRazonSocial").should('have.value', nombre)
    cy.get("#anadirSocioDni").should('have.value', Cif)
    cy.get("#anadirSocioNAcionalidad").should('have.value', Nacionalidad)
    cy.get("#anadirSocioMail").should('have.value', Email)
    cy.get("#anadirSocioTelefono").should('have.value', Telefono)
    cy.get("#anadirSocioFijo").should('have.value', Telefonofijo)
    cy.get("#anadirSocioTipoSocio").should('have.value', Tipodesocio)
    cy.get("#anadirSocioActaBaja").should('have.value', actadebaja)

    cy.get("#anadirSocioActaBaja").should('have.value', actadebaja)
    cy.get("#anadirSocioAperturaFicha").should('have.value', fechaapertura)

    cy.get("#anadirSocioFechaAlta").should('have.value', fechaalta)

    cy.get("#anadirSocioFechaActaAlta2").should('have.value', fechaactadealta)

    cy.get("#anadirSocioFechaActaBaja2").should('have.value', fechaactabaja)

    cy.get("#anadirSocioDireccion").should('have.value', direccion)
    cy.get("#anadirSocioLocalidad").should('have.value', Localidad)
    cy.get("#anadirSocioProvincia").should('have.value', Provincia)
    cy.get("#anadirSocioCP").should('have.value', cp)



    cy.get(".ql-editor").eq(0).clear().type(Observaciones)
    cy.get('.ql-editor').eq(0).find('p').then(($item) => {
        Observaciones = $item.text()
        cy.get("#guardarAnadirSocio").click()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor').eq(0).find('p').should('have.text', Observaciones)
        cy.wait(1000)
    })

    cy.get(".ql-editor").eq(1).clear().type(rObservaciones)
    cy.get('.ql-editor').eq(1).find('p').then(($item) => {
        rObservaciones = $item.text()
        cy.get("#guardarAnadirSocio").click()
        cy.wait(2000)
        cy.reload()
        cy.wait(5000)
        //Comprobaciones de que todos los textos estan correctos
        cy.get('.ql-editor').eq(1).find('p').should('have.text', rObservaciones)
    })



}
