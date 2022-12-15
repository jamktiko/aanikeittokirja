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

  it('Haetaan valikosta "Omat listat" ja klikataan', () => {
    cy.contains('Omat listat').click();
  });

  it('Klikataan "+ UUSI LISTA" -painiketta', () => {
    cy.contains('+ UUSI LISTA').click();
  });

  it('Kirjoita "Nimi" -input kenttään: testi', () => {
    cy.get('.textInput').first().type('testi');
  });

  it('Kirjoita "Kuvaus" -input kenttään: testi', () => {
    cy.get('.textInput').last().type('testi');
  });

  it('Hae lisää painike ja klikkaa', () => {
    cy.get('button[class="buttonClass textColorSecondary primary"]').click();
  });

  it('Hae "testi" -lista ja klikkaa', () => {
    cy.contains('testi').click();
  });

  it('Klikkaa listan valikko -painiketta', () => {
    cy.get('path');
  });

  it('Etsi valikosta "Poista lista" ja klikkaa', () => {
    cy.contains('Poista lista').click();
  });

  it('Klikkaa poista painiketta', () => {
    cy.get('button[class="buttonClass textColorSecondary warning"]').click();
  });
});
