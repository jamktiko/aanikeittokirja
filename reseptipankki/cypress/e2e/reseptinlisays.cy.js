describe('Reseptinlisays', () => {
  it('Siirtyy osoitteeseen localhost:3001', () => {
    cy.visit('localhost:3001');
  });

  it('Etsitään sivulta hampurilaisvalikon painike ja painetaan sitä', () => {
    // Sivuvalikko aukeaa
    cy.get('.buttonInvisible').click();
  });

  it('Etsitään "Kirjaudu" sivupalkista ja klikataan sitä', () => {
    cy.contains('Kirjaudu').click();
  });

  it('Tarkistetaan että ollaan sovelluksen Kirjautumissivulla', () => {
    cy.contains('Kirjautuminen');
  });

  it('Siirrytään sivulla sähköpostin input kenttään', () => {
    // Kirjoitetaan oma sähköposti osoite
    cy.get('.accountFormRow').first().type('aa4498@student.jamk.fi');
  });

  it('Siirrytään sivulla salasanan input kenttään', () => {
    // Kirjoitetaan oma sähköposti osoite
    cy.get('.accountFormRow').last().type('salasana');
  });

  it('Sisäänkirjautuminen ja reseptinlisäys', () => {
    cy.get('.accountFormSubmitButton').click();

    // Tarkistetaan, että ollaan kirjauduttu oikealla sähköpostilla
    cy.contains('Hei Toni!');

    // Haetaan sivuvalikon painike ja klikataan sitä
    cy.get('.buttonInvisible').click();

    // Etsitään sivuvalikosta 'Kirjoita resepti' ja klikataan sitä
    cy.contains('Kirjoita resepti').click();

    // Siirrytään 'Reseptin nimi' input kenttään
    cy.get('.textInput').first().type('Perunamuusi');

    // Siirrytään 'Aines' input kenttään ja kirjoitetaan aines
    cy.get('.ingredientInputTable').first().type('Peruna');

    // Painetaan '+ UUSI AINES' painiketta
    cy.contains('+ Uusi aines').click();
  });
});
