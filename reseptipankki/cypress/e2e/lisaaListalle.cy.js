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

  it('Lisätään resepti listalle ja poistetaan se', () => {
    // Haetaan sivuvalikon painike ja klikataan sitä
    cy.get('.buttonInvisible').click();

    cy.wait(2000);

    // Etsi valikosta kirjoita resepti ja paina sitä
    cy.contains('Hae reseptejä').click();

    // Etsitään resepteistä suklaakeksit ja klikataan sitä
    cy.contains('Suklaakeksit').click();

    // Haetaan valikkopainike ja klikataan sitä
    cy.get('button[class="recipeActionMenuIcon buttonInvisible"]').click();

    // Etsitään valikosta "Lisää listalle" ja klikataan
    cy.contains('Lisää listalle').click();

    // Etsitään "Tonin lista" ja klikataan
    cy.contains('Tonin lista').click();

    // Haetaan valikkopainike ja klikataan
    cy.get('.menuIcon').click();

    // Etsitään "Omat listat" valikosta ja klikataan
    cy.contains('Omat listat').click();

    // Haetaan valikon elementti ja klikataan
    cy.get('.listCardIcon').click();

    // Haetaan painike ja klikataan
    cy.get('path').click();

    // Etsitään "Poista reseptejä" painike ja klikataan
    cy.contains('Poista reseptejä').click();

    // Etsitään "Suklaakeksit" ja klikataan
    cy.contains('Suklaakeksit').click();

    // Etsitään "Poista listalta" ja klikataan
    cy.contains('Poista listalta').click();
  });
});
