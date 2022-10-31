/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Käyttäjän malli
const Kayttaja = function (Kayttaja) {
  this.enimi = Kayttaja.enimi;
  this.snimi = Kayttaja.snimi;
  this.email = Kayttaja.email;
  this.cognito_id = Kayttaja.cognito_id;
  this.isAdmin = Kayttaja.isAdmin;
  this.erikoisruokavaliot = Kayttaja.erikoisruokavaliot;
};

// Uuden käyttäjän luonti
Kayttaja.create = (newKayttaja, result) => {
  sql.query('INSERT INTO Kayttaja SET ?', newKayttaja, (err, res) => {
    if (err) {
      // Jos luonti epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos luonti onnistui
    console.log('Created user: ', { id: res.insertId, ...newKayttaja });
    result(null, { id: res.insertId, ...newKayttaja });
  });
};

// Käyttäjän haku käyttäjän id:n perusteella
Kayttaja.findById = (id, result) => {
  sql.query(`SELECT * FROM Kayttaja WHERE k_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found user: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos käyttäjää ei löytynyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

//Cognito käyttäjänimen perusteella hakeminen

Kayttaja.getByCId = (cId, result) => {
  console.log('running model');
  sql.query(`SELECT * FROM Kayttaja WHERE cognito_id = ${cId}`, (err, res) => {
    console.log('query completed');
    if (err) {
      console.log('Error: ', err);
      result(null, err);
      return;
    }
    console.log('User: ', res);
    result(null, res);
  });
};

// Kaikkien käyttäjien haku tai
// etunimen perusteella (enimi)
Kayttaja.getAll = (enimi, result) => {
  let query = 'SELECT * FROM Kayttaja';

  // Jos määritetty enimi haussa
  if (enimi) {
    query += ` WHERE title LIKE '%${enimi}%'`;
  }

  // Jos haku epäonnistui
  sql.query(query, (err, res) => {
    if (err) {
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Users: ', res);
    result(null, res);
  });
};

// Kaikkien admin-käyttäjien haku
Kayttaja.getAllAdmins = (result) => {
  sql.query('SELECT * FROM Kayttaja WHERE IsAdmin = 1', (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Users: ', res);
    result(null, res);
  });
};

// Käyttäjän päivitys käyttäjän id:n perusteella
Kayttaja.updateById = (id, Kayttaja, result) => {
  sql.query(
    'UPDATE Kayttaja SET enimi = ?, snimi = ?, email = ?, cognito_id = ?, isAdmin = ?, erikoisruokavaliot = ? WHERE k_id = ?',
    [
      Kayttaja.enimi,
      Kayttaja.snimi,
      Kayttaja.email,
      Kayttaja.cognito_id,
      Kayttaja.isAdmin,
      Kayttaja.erikoisruokavaliot,
      id,
    ],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('Error: ', err);
        result(null, err);
        return;
      }

      // Jos päivitettävää käyttäjää ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated user: ', { id: id, ...Kayttaja });
      result(null, { id: id, ...Kayttaja });
    }
  );
};

// Käyttäjän poisto käyttäjän id:n perusteella
Kayttaja.remove = (id, result) => {
  sql.query('DELETE FROM Kayttaja WHERE k_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos poistettavaa käyttäjää ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted user with id: ', id);
    result(null, res);
  });
};

module.exports = Kayttaja;
