/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

const Ostoslista = function (Ostoslista) {
  this.nimi = Ostoslista.nimi;
  this.Kayttaja_k_id = Ostoslista.Kayttaja_k_id;
};

Ostoslista.create = (newOstoslista, result) => {
  sql.query('INSERT INTO Ostoslista SET ?', newOstoslista, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created ostoslista: ', { id: res.insertId, ...newOstoslista });
    result(null, { id: res.insertId, ...newOstoslista });
  });
};

Ostoslista.findById = (id, result) => {
  sql.query(`SELECT * FROM Ostoslista WHERE k_id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found ostoslista: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found ostoslista with the id
    result({ kind: 'not_found' }, null);
  });
};

Ostoslista.getAll = (enimi, result) => {
  let query = 'SELECT * FROM Ostoslista';

  if (enimi) {
    query += ` WHERE title LIKE '%${enimi}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('ostoslistat: ', res);
    result(null, res);
  });
};

Ostoslista.updateById = (id, ostoslista, result) => {
  sql.query(
    'UPDATE Ostoslista SET nimi = ? WHERE o_id = ?',
    [ostoslista.nimi, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Ostoslista with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Päivitettiin ostoslista: ', { id: id, ...ostoslista });
      result(null, { id: id, ...ostoslista });
    }
  );
};

Ostoslista.remove = (id, result) => {
  sql.query('DELETE FROM Ostoslista WHERE o_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found ostoslista with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted ostoslista with id: ', id);
    result(null, res);
  });
};

module.exports = Ostoslista;
