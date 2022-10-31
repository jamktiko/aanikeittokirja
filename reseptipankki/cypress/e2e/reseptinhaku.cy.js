describe('Reseptinhaku', () => {
  it('clicks the link "type"', () => {
    cy.visit('localhost:3001');

    // Tarkistetaan että ollaan sovelluksen etusivulla
    cy.contains('Etusivu');

    /* Etsitään sivulta hampurilaisvalikon painike ja painetaan
    sitä, jolloin sivupalkki aukeaa */
    cy.get('.buttonInvisible').click();

    /* Tarkistetaan että sivupalkista löytyy 'Hae reseptejä'
    ja klikataan elementtiä joka vie sivulle reseptinhaku sivulle */
    cy.contains('Hae reseptejä').click();

    // Siirrytään sivulla hakukenttään ja kirjoitetaan reseptin nimi
    cy.get('.searchBar').type('Pannukakku');
  });
});
