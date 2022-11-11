describe('Reseptinhaku', () => {
  it('Siirrytään sovellukseen url -osoitteessa 3001', () => {
    cy.visit('localhost:3001');
  });

  it('Avataan sivuvalikko klikkaamalla hampurilaisvalikon painiketta', () => {
    cy.get('.buttonInvisible').click();
  });

  it('Etsitään sivuvalikosta kirjautuminen ja klikataan sitä', () => {
    cy.contains('Kirjaudu').click();
  });

  it('Siirrytään Sähköpostin input kenttään ja kirjoitetaan sähköposti', () => {
    cy.get('.accountFormRow').first().type('aa4498@student.jamk.fi');
  });

  it('Siirrytään salasanan input kenttään ja kirjoitetaan salasana', () => {
    cy.get('.accountFormRow').last().type('salasana');
  });

  it('Painetaan "kirjaudu sisään" -painiketta ', () => {
    cy.get('.accountFormSubmitButton').click();
  });

  it('Avataan sivuvalikko klikkaamalla hampurilaisvalikon painiketta', () => {
    cy.get('.buttonInvisible').click();

    cy.wait(1000);

    // Etsi valikosta kirjoita resepti ja paina sitä
    cy.contains('Kirjoita resepti').click();

    // Haetaan "Reseptin nimi" -input kenttä ja kirjoitetaan Juustokakku
    cy.get('input[class="textInput recipeNameInput"]').type('Juustokakku');

    // Siirrytään "aines" input kenttään ja kirjoitetaan "Sokeri".
    cy.get('input[class="ingredientNameInput tableInput"]').type('Sokeri');

    // Siirrytään "määrä" input kenttään ja kirjoitetaan "1".
    cy.get('input[class="ingredientAmountInput tableInput"]').type('1');

    // Siirrytään "Yksikkö" dropdown -valikkoon ja valitaa "rkl"
    cy.get('select').select('tl');

    // Haetaan "+ Uusi aines" painike ja klikataan sitä.
    cy.contains('+ Uusi aines').click();

    // Siirrytään "aines" input kenttään ja kirjoitetaan "Vehnäjauho".
    cy.get('input[class="ingredientNameInput tableInput"]')
      .last()
      .type('Vehnäjauho');

    // Siirrytään "määrä" input kenttään ja kirjoitetaan "1".
    cy.get('input[class="ingredientAmountInput tableInput"]').last().type('1');

    // Siirrytään "Yksikkö" dropdown -valikkoon ja valitaa "rkl"
    cy.get('select').last().select('dl');

    cy.get('.recipeDirections').type('Sekoita ainekset.');

    cy.get('.submitButtonContainer').click();
  });
});
