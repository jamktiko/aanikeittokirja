describe('Kirjautuminen, reseptin lisäys ja poisto', () => {
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
    // edellisistä testeistä
    cy.clearLocalStorage();
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

  it('Hae sivuvalikon painike ja klikkaa sitä', () => {
    cy.get('.buttonInvisible').click();
    // Odota 2 sekuntia
    cy.wait(2000);
  });

  it('Etsi valikosta kirjoita resepti ja klikkaa sitä', () => {
    cy.contains('Kirjoita resepti').click();
    // Odota 2 sekuntia
    cy.wait(2000);
  });

  it('Haetaan "Reseptin nimi" input kenttä ja kirjoitetaan Juustokakku', () => {
    cy.get('input[class="textInput recipeNameInput"]').type('Juustokakku');
  });

  it('Siirrytään "aines" input kenttään ja kirjoitetaan "Sokeri".', () => {
    cy.get('input[class="ingredientNameInput tableInput"]').type('Sokeri');
  });

  it('Siirrytään "määrä" input kenttään ja kirjoitetaan "1".', () => {
    cy.get('input[class="ingredientAmountInput tableInput"]').type('1');
  });

  it('Siirrytään "Yksikkö" dropdown -valikkoon ja valitaa "rkl"', () => {
    cy.get('select').select('tl');
  });

  it('Haetaan "+ Uusi aines" painike ja klikataan sitä.', () => {
    cy.contains('+ Uusi aines').click();
  });

  it('Siirrytään "aines" input kenttään ja kirjoitetaan "Vehnäjauho".', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')
      .last()
      .type('Vehnäjauho');
  });

  it('Siirrytään "määrä" input kenttään ja kirjoitetaan "1".', () => {
    cy.get('input[class="ingredientAmountInput tableInput"]').last().type('1');
  });

  it('Siirrytään "Yksikkö" dropdown -valikkoon ja valitaa "rkl"', () => {
    cy.get('select').last().select('dl');
  });

  it('Haetaan "Ohjeet" input kenttä ja kirjoitetaan "Sekoita ainekset"', () => {
    cy.get('.recipeDirections').type('Sekoita ainekset.');
  });

  it('Haetaan "Lisää resepti" painike ja klikataan sitä.', () => {
    cy.get('.submitButtonContainer').click();
    // Odota 2 sekuntia
    cy.wait(2000);
  });

  it('Haetaan valikko painike ja klikataan sitä', () => {
    cy.get('button[class="recipeActionMenuIcon buttonInvisible"]').click();
  });

  it('Etsitään valikosta "Poista" ja klikataan sitä', () => {
    cy.contains('Poista').click();
  });

  it('Hae "Poista" -painike joka avautuu uuten valikkoon ja klikkaa', () => {
    cy.get('button[class="buttonClass textColorSecondary warning"]').click();
  });
});
