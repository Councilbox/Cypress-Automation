const loginUser = 'anxo.rodriguez.cocodin@gmail.com';
const password = '502437casa';
// const loginUser = 'aaron.fuentes.cocodin+969@gmail.com';
// const password = 'aaron';

export default () => {
    cy.get('#username')
      .type(loginUser).should('have.value', loginUser)

      
    cy.get('#password')
      .type(password).should('have.value', password)


    cy.get('#login-button').click();
}