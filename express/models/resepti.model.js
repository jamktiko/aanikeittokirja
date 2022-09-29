const sql = require('../connection');

const Resepti = function (Resepti) {
  this.nimi = Resepti.nimi;
  this.ainekset = Resepti.ainekset;
  this.ohjeet = Resepti.ohjeet;
  this.erikoisruokavaliot = Resepti.erikoisruokavaliot;
  this.kategoriat = Resepti.kategoriat;
  this.valmistusaika = Resepti.valmistusaika;
  this.annosten_maara = Resepti.annosten_maara;
  this.kuva = Resepti.kuva;
  this.julkinen = Resepti.julkinen;
  this.uusi = Resepti.uusi;
  this.kayttaja_k_id = Resepti.kayttaja_k_id;
};

// Luodaan uusi resepti,
// newResepti on reseptin sisältö
Resepti.create = (newResepti, result) => {
  sql.query('INSERT INTO Resepti SET ?', newResepti, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created Resepti: ', { id: res.insertId, ...newResepti });
    result(null, { id: res.insertId, ...newResepti });
  });
};

// Haetaan resepti id:n perusteella,
// id on reseptin id
Resepti.findById = (id, result) => {
  sql.query(`SELECT * FROM Resepti WHERE r_id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // resepti löytyi
    if (res.length) {
      console.log('found Resepti: ', res[0]);
      result(null, res[0]);
      return;
    }
    // reseptiä ei löytynyt
    result({ kind: 'not_found' }, null);
  });
};

// Haetaan käyttäjän reseptit,
// kayttaja_k_id on käyttäjän id
Resepti.findByUser = (kayttaja_k_id, result) => {
  sql.query(
    `SELECT * FROM Resepti WHERE kayttaja_k_id = ${kayttaja_k_id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      // käyttäjä löytyi
      if (res.length) {
        console.log('found Käyttäjä: ', res[0]);
        result(null, res[0]);
        return;
      }
      // käyttäjää ei löytynyt
      result({ kind: 'not_found' }, null);
    }
  );
};

// Päivitetään resepti id:n perusteella,
// id on reseptin id,
// Resepti on reseptin sisältö
Resepti.updateById = (id, Resepti, result) => {
  sql.query(
    'UPDATE Resepti SET nimi = ?, ainekset = ?, ohjeet = ?, erikoisruokavaliot = ?, kategoriat = ?, valmistusaika = ? WHERE annosten_maara = ?',
    'kuva = ?',
    'julkinen = ?',
    'uusi = ?',
    'kayttaja_id = ?',
    [
      Resepti.nimi,
      Resepti.ainekset,
      Resepti.ohjeet,
      Resepti.erikoisruokavaliot,
      Resepti.kategoriat,
      Resepti.valmistusaika,
      Resepti.annosten_maara,
      Resepti.kuva,
      Resepti.julkinen,
      Resepti.uusi,
      Resepti.kayttaja_id,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // reseptiä ei löytynyt
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Päivitettiin Resepti: ', { id: id, ...Resepti });
      result(null, { id: id, ...Resepti });
    }
  );
};

// Poistetaan resepti id:n perusteella,
// id on reseptin id
Resepti.remove = (id, result) => {
  sql.query('DELETE FROM Resepti WHERE r_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // reseptiä ei löytynyt
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted Resepti with id: ', id);
    result(null, res);
  });
};

module.exports = Resepti;