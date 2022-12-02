describe('Reseptinhaku', () => {
  it('Tehdään reseptinhaku nimellä "pannukkakku""', () => {
    // Siirrytään sovellukseen portin 3001 kautta
    cy.visit('localhost:3001');

    /* Etsitään sivulta hampurilaisvalikon painike ja painetaan
    sitä, jolloin sivupalkki aukeaa */
    cy.get('.buttonInvisible').click();

    /* Tarkistetaan että sivupalkista löytyy 'Hae reseptejä'
    ja klikataan elementtiä joka vie sivulle reseptinhaku sivulle */
    cy.contains('Hae reseptejä').click();

    // Siirrytään sivulla hakukenttään ja kirjoitetaan reseptin nimi
    cy.get('.searchBar').type('Pannukakku');

    // Valitaan resepti ja siirrytään reseptin omalle sivulle
    cy.get('.cardImageDiv').click();
  });
});
