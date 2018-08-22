const loginUser = 'aaron.fuentes.cocodin+969@gmail.com';
const password = 'aaron';

export default () => {
    cy.get('#username')
      .type(loginUser).should('have.value', loginUser)

      // .type() with special character sequences
      .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
      .type('{del}{selectall}{backspace}')

      // .type() with key modifiers
      .type('{alt}{option}') //these are equivalent
      .type('{ctrl}{control}') //these are equivalent
      .type('{meta}{command}{cmd}') //these are equivalent
      .type('{shift}')

      // Delay each keypress by 0.1 sec
/*       .type(loginUser, { delay: 100 })
      .should('have.value', loginUser); */

/*     cy.get('.action-disabled')
      // Ignore error checking prior to type
      // like whether the input is visible or disabled
      .type('disabled error checking', { force: true })
      .should('have.value', 'disabled error checking') */
    cy.get('#password')
      .type(password).should('have.value', password)

      // .type() with special character sequences
      .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
      .type('{del}{selectall}{backspace}')

      // .type() with key modifiers
      .type('{alt}{option}') //these are equivalent
      .type('{ctrl}{control}') //these are equivalent
      .type('{meta}{command}{cmd}') //these are equivalent
      .type('{shift}')

      // Delay each keypress by 0.1 sec
/*       .type(password, { delay: 100 })
      .should('have.value', password) */

    cy.get('#login-button').click();

    cy.get('.error-text').should('have.length', 2);

    cy.get('#username')
      .type(loginUser).should('have.value', loginUser)
    cy.get('#password')
      .type(password).should('have.value', password)

    cy.get('#login-button').click();
}