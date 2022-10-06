/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

const Lista = function (lista) {
  this.nimi = lista.enimi;
  this.kuvaus = lista.snimi;
  this.Kayttaja_k_id = lista.email;
};
Lista.create = (newLista, result) => {
  sql.query('INSERT INTO Lista SET ?', newLista, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created Lista: ', { id: res.insertId, ...newLista });
    result(null, { id: res.insertId, ...newLista });
  });
};

Lista.findById = (id, result) => {
  sql.query(`SELECT * FROM Lista WHERE l_id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found lista: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found Kayttaja with the id
    result({ kind: 'not_found' }, null);
  });
};

Lista.getAll = (enimi, result) => {
  let query = 'SELECT * FROM Lista';

  if (enimi) {
    query += ` WHERE title LIKE '%${enimi}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('Lista: ', res);
    result(null, res);
  });
};

Lista.getAllAdmins = (result) => {
  sql.query('SELECT * FROM Lista WHERE IsAdmin = 1', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('Lista: ', res);
    result(null, res);
  });
};

Lista.updateById = (id, lista, result) => {
  sql.query(
    'UPDATE Lista SET nimi = ?, kuvaus = ? WHERE k_id = ?',
    [lista.nimi, lista.kuvaus, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found lista with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Päivitettiin lista: ', { id: id, ...lista });
      result(null, { id: id, ...lista });
    }
  );
};

Lista.remove = (id, result) => {
  sql.query('DELETE FROM Lista WHERE k_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found lista with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted Lista with id: ', id);
    result(null, res);
  });
};

module.exports = Lista;
