describe('Kirjautuminen, lisää listalle ja poista listalta', () => {
  // Palauttaa local storagen käyttäjän kirjautumistiedot ennen jokaisen testin
  // alkua.
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  // Tallentaa local storagen käyttäjän kirjautumistiedot jokaisen testin
  // jälkeen.
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Siirrytään sovellukseen url -osoitteessa 3001', () => {
    cy.visit('localhost:3001');
    // Tyhjentää local storagen, jotta kirjautumistiedot eivät säily muistissa
    // edellisistä testeistä.
    cy.clearLocalStorage();
  });

  it('Avaa sivuvalikko ja klikkaa hampurilaisvalikon painiketta', () => {
    cy.get('.buttonInvisible').click();
  });

  it('Etsi sivuvalikosta kirjautuminen ja klikkaa sitä', () => {
    cy.contains('Kirjaudu').click();
  });

  it('Siirry Sähköpostin input kenttään ja kirjoita sähköposti osoite', () => {
    cy.get('.accountFormRow').first().type('aa4498@student.jamk.fi');
  });

  it('Siirry salasanan input kenttään ja kirjoita salasana', () => {
    cy.get('.accountFormRow').last().type('salasana');
  });

  it('Paina "kirjaudu sisään" -painiketta ', () => {
    cy.get('.accountFormSubmitButton').click();
  });

  it('Haetaan sivuvalikon painike ja klikataan sitä', () => {
    cy.get('.buttonInvisible').click();
    cy.wait(2000);
  });

  it('Etsi valikosta kirjoita resepti ja paina sitä', () => {
    cy.contains('Hae reseptejä').click();
  });

  it('Etsitään resepteistä suklaakeksit ja klikataan sitä', () => {
    cy.contains('Suklaakeksit').click();
  });

  it('Haetaan valikkopainike ja klikataan sitä', () => {
    cy.get('button[class="recipeActionMenuIcon buttonInvisible"]').click();
  });

  it('Etsitään valikosta "Lisää listalle" ja klikataan', () => {
    cy.contains('Lisää listalle').click();
  });

  it('Etsitään "Tonin lista" ja klikataan', () => {
    cy.contains('Tonin lista').click();
  });

  it('Haetaan valikkopainike ja klikataan', () => {
    cy.get('.menuIcon').click();
  });

  it('Etsitään "Omat listat" valikosta ja klikataan', () => {
    cy.contains('Omat listat').click();
  });

  it('Haetaan valikon elementti ja klikataan', () => {
    cy.get('.listCardIcon').click();
  });

  it('Haetaan painike ja klikataan', () => {
    cy.get('path').click();
  });

  it('Etsitään "Poista reseptejä" painike ja klikataan', () => {
    cy.contains('Poista reseptejä').click();
  });

  it('Etsitään "Suklaakeksit" ja klikataan', () => {
    cy.contains('Suklaakeksit').click();
  });

  it('Etsitään "Poista listalta" ja klikataan', () => {
    cy.contains('Poista listalta').click();
  });
});
