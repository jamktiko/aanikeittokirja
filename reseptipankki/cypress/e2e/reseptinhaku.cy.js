describe('Reseptinhaku', () => {
  it('Siirtyy osoitteeseen localhost', () => {
    cy.visit('localhost:3001');
  });

  it('Tarkistetaan että ollaan sovelluksen etusivulla', () => {
    cy.contains('Etusivu');
    // Odota 4 sekuntia
    cy.wait(4000);
  });

  it('Etsitään sivulta hampurilaisvalikon painike ja painetaan sitä', () => {
    // Sivuvalikko aukeaa
    cy.get('.buttonInvisible').click();
    // Odota 4 sekuntia
    cy.wait(4000);
  });

  it('Tarkistetaan että sivupalkista löytyy "Hae reseptejä"', () => {
    // Klikataan elementtiä, joka vie reseptinhaku sivulle
    cy.contains('Hae reseptejä').click();
    // Odota 4 sekuntia
    cy.wait(4000);
  });

  it('Siirrytään sivulla hakukenttään ja kirjoitetaan reseptin nimi', () => {
    cy.get('.searchBar').type('Pannukakku');
  });
});
