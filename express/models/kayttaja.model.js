/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

const Kayttaja = function (Kayttaja) {
  this.enimi = Kayttaja.enimi;
  this.snimi = Kayttaja.snimi;
  this.email = Kayttaja.email;
  this.salasana = Kayttaja.salasana;
  this.isAdmin = Kayttaja.isAdmin;
  this.erikoisruokavaliot = Kayttaja.erikoisruokavaliot;
};
Kayttaja.create = (newKayttaja, result) => {
  sql.query('INSERT INTO Kayttaja SET ?', newKayttaja, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created Kayttaja: ', { id: res.insertId, ...newKayttaja });
    result(null, { id: res.insertId, ...newKayttaja });
  });
};

Kayttaja.findById = (id, result) => {
  sql.query(`SELECT * FROM Kayttaja WHERE k_id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found Kayttaja: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found Kayttaja with the id
    result({ kind: 'not_found' }, null);
  });
};

Kayttaja.getAll = (enimi, result) => {
  let query = 'SELECT * FROM Kayttaja';

  if (enimi) {
    query += ` WHERE title LIKE '%${enimi}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('Kayttajas: ', res);
    result(null, res);
  });
};

Kayttaja.getAllAdmins = (result) => {
  sql.query('SELECT * FROM Kayttaja WHERE IsAdmin = 1', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('Kayttaja: ', res);
    result(null, res);
  });
};

Kayttaja.updateById = (id, Kayttaja, result) => {
  sql.query(
    'UPDATE Kayttaja SET enimi = ?, snimi = ?, email = ?, salasana = ?, isAdmin = ?, erikoisruokavaliot = ? WHERE k_id = ?',
    [
      Kayttaja.enimi,
      Kayttaja.snimi,
      Kayttaja.email,
      Kayttaja.salasana,
      Kayttaja.isAdmin,
      Kayttaja.erikoisruokavaliot,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Kayttaja with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Päivitettiin Käyttäjä: ', { id: id, ...Kayttaja });
      result(null, { id: id, ...Kayttaja });
    }
  );
};

Kayttaja.remove = (id, result) => {
  sql.query('DELETE FROM Kayttaja WHERE k_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Kayttaja with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted Kayttaja with id: ', id);
    result(null, res);
  });
};

module.exports = Kayttaja;
