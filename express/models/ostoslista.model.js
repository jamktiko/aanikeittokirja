/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Ostoslistan malli
const Ostoslista = function (Ostoslista) {
  this.nimi = Ostoslista.nimi;
  this.Kayttaja_k_id = Ostoslista.Kayttaja_k_id;
};

// Uuden ostoslistan lisääminen
Ostoslista.create = (newOstoslista, result) => {
  sql.query('INSERT INTO Ostoslista SET ?', newOstoslista, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('Created shopping list: ', {
      id: res.insertId,
      ...newOstoslista,
    });
    result(null, { id: res.insertId, ...newOstoslista });
  });
};

// Ostoslistan haku ostoslistan id:n perusteella
Ostoslista.findById = (id, result) => {
  sql.query(`SELECT * FROM Ostoslista WHERE o_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found shopping list: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos ostoslistaa ei löytytnyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Kaikkien ostoslistojen haku
Ostoslista.getAll = (result) => {
  let query = 'SELECT * FROM Ostoslista';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Shopping lists: ', res);
    result(null, res);
  });
};

// Ostoslistan päivitys ostoslistan id:n perusteella
Ostoslista.updateById = (id, ostoslista, result) => {
  sql.query(
    'UPDATE Ostoslista SET nimi = ? WHERE o_id = ?',
    [ostoslista.nimi, id],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('Error: ', err);
        result(null, err);
        return;
      }

      // Jos ostoslistaa ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated shopping list: ', { id: id, ...ostoslista });
      result(null, { id: id, ...ostoslista });
    }
  );
};

// Ostoslistan poistaminen ostoslistan id:n perusteella
Ostoslista.remove = (id, result) => {
  sql.query('DELETE FROM Ostoslista WHERE o_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos ostoslistaa ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted shopping list with id: ', id);
    result(null, res);
  });
};

module.exports = Ostoslista;
