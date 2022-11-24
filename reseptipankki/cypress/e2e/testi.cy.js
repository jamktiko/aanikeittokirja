describe('Reseptinhaku', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Siirrytään sovellukseen url -osoitteessa 3001', () => {
    cy.visit('localhost:3001');
  });

  it('Lisätään uusi resepti ja poistetaan se', () => {
    // Haetaan sivuvalikon painike ja klikataan sitä

    cy.get('.buttonInvisible').click();

    cy.wait(3000);
  });

  it('Lisätään uusi resepti ja poistetaan se', () => {
    // Etsi valikosta kirjoita resepti ja paina sitä
    cy.contains('Kirjoita resepti').click();
  });
});
