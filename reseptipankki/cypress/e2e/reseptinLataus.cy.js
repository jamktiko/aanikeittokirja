describe('ReseptinLataus', () => {
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

  it('Siirrytään sovellukseen portin 3001 kautta', () => {
    cy.visit('localhost:3001');
    // Tyhjentää local storagen, jotta kirjautumistiedot eivät säily muistissa
    // edellisistä testeistä
    cy.clearLocalStorage();
  });

  it('Avataan sivuvalikko', () => {
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
    cy.contains('Lataa resepti').click();
    // Odota 2 sekuntia
    cy.wait(2000);
  });

  it('Haetaan input elementti ja kirjoitetaan reseptin url-osoite', () => {
    cy.get('.searchBar')
      .click()
      .type(
        'https://www.kotikokki.net/reseptit/nayta/99894/Joulutortut%20vanilja-%20ja%20viikunat%C3%A4ytteell%C3%A4/'
      );
  });

  it('Painetaan "Lataa reseptin" -painiketta ', () => {
    cy.get('button[class="buttonClass textColorSecondary primary"]').click();
  });

  // Tarkistetaan "aines" input kentät
  it('Tarkistetaan, että kopioitu reseptin nimi on oikein', () => {
    cy.get('input[class="textInput recipeNameInput"]').should(
      'have.value',
      'Joulutortut vanilja- ja viikunatäytteellä'
    );
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .should('have.value', 'torttutaikinalevyjä (1 kg)')
      .eq(1)
      .should('have.value', 'viikunoita (kuivattuja)');
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(2)
      .should('have.value', 'vettä');
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(3)
      .should('have.value', 'glögitiivistettä');
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(4)
      .should('have.value', 'sokeria');
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(5)
      .should(
        'have.value',
        'paistonkestävää luumumarmeladia (tai omenamarmeladia)'
      );
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(6)
      .should('have.value', 'vaniljatuorejuustoa');
  });

  it('Siirrytään ensimmäiseen "aines" input kenttään', () => {
    cy.get('input[class="ingredientNameInput tableInput"]')

      .eq(7)
      .should('have.value', 'vaniljasokeria');
  });

  // Tarkistetaan "määrä" input kentät
  it('Tarkistetaan usea "määrä" input kenttä', () => {
    cy.get('input[class="ingredientAmountInput tableInput"]')
      .eq(0, 2, 3, 4, 7)
      .should('have.value', '1');
  });

  it('Tarkistetaan seuraavat "määrä" input kentät', () => {
    cy.get('select').eq(1, 6).should('have.value', 'g');
  });

  it('Tarkistetaan seuraava "määrä" input kenttä', () => {
    cy.get('input[class="ingredientAmountInput tableInput"]')
      .eq(5)
      .should('have.value', '0.5');
  });

  // Tarkistetaan "dropdown" valikoiden arvot
  it('Siirrytään "Yksikkö" dropdown -valikkoon', () => {
    cy.get('select').should('have.value', 'pkt');
  });

  it('Siirrytään "Yksikkö" dropdown -valikkoon', () => {
    cy.get('select').eq(1, 6).should('have.value', 'g');
  });

  it('Siirrytään "Yksikkö" dropdown -valikkoon', () => {
    cy.get('select').eq(2, 3, 4, 5).should('have.value', 'dl');
  });

  it('Siirrytään "Yksikkö" dropdown -valikkoon', () => {
    cy.get('select').eq(7).should('have.value', 'tl');
  });

  it('Siirrytään "Ohjeet" input kenttään', () => {
    cy.get('textarea.textInputLarge.textInput').should(
      'have.value',
      'Paloittele viikunat ja lisää kattilaan veden, glögin, sokerin kanssa. Keitä pehmeiksi n. 30 min. Soseuta tehosekoittimella tai sauvasekoittimella. Sekoita joukkoon paistonkestävä marmeladi.\n\nSekoita vaniljatuorejuusto ja vaniljasokeri keskenään.\n\nLeivo joulutortut. Lisää nokare vaniljatäytettä sekä viikunamarmeladia torttujen päälle. Paista torttuja 225 asteessa n. 15 minuuttia.'
    );
  });

  it('Haetaan sivuvalikon painike ja klikataan', () => {
    cy.get('.buttonInvisible').click();
  });

  it('Etsitään sivuvalikosta kohta "Käyttäjä" ja klikataan', () => {
    cy.contains('Käyttäjä').click();
  });

  it('Etsitään valikosta Kirjaudu ulos ja klikataan', () => {
    cy.contains('Kirjaudu ulos').click();
  });
});
