/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Listan malli
const Lista = function (lista) {
  this.nimi = lista.nimi;
  this.kuvaus = lista.kuvaus;
  this.cognito_id = lista.cognito_id;
  this.Kayttaja_k_id = lista.Kayttaja_k_id;
};

// Uuden listan lisääminen
Lista.create = (newLista, result) => {
  sql.query('INSERT INTO Lista SET ?', newLista, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('created list: ', { id: res.insertId, ...newLista });
    result(null, { id: res.insertId, ...newLista });
  });
};

// Listan haku listan id:n perusteella
Lista.findById = (id, result) => {
  sql.query(`SELECT * FROM Lista WHERE l_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('found list: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos listaa ei löytynyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Listan haku käyttäjän cognito id:n perusteella
Lista.findByUser = (id, result) => {
  sql.query(
    `SELECT * , COUNT(Lista_l_id) AS 'reseptit' FROM Lista l LEFT OUTER JOIN Lista_has_Resepti lr ON l.l_id = lr.Lista_l_id WHERE cognito_id = "${id}" GROUP BY nimi`,
    (err, res) => {
      if (err) {
        // Jos haku epäonnistui
        console.log('error: ', err);
        result(err, null);
        return;
      }

      // Jos haku onnistui
      if (res) {
        console.log('found list: ', res);
        result(null, res);
        return;
      }

      // Jos listaa ei löytynyt id:llä
      result({ kind: 'not_found' }, null);
    }
  );
};

// Kaikkien listojen haku
Lista.getAll = (result) => {
  let query = 'SELECT * FROM Lista';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('List: ', res);
    result(null, res);
  });
};

// Listan päivitys listan id:n perusteella
Lista.updateById = (id, lista, result) => {
  sql.query(
    'UPDATE Lista SET nimi = ?, kuvaus = ? WHERE l_id = ?',
    [lista.nimi, lista.kuvaus, id],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('error: ', err);
        result(null, err);
        return;
      }

      // Jos päivitettävää listaa ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated list: ', { id: id, ...lista });
      result(null, { id: id, ...lista });
    }
  );
};

// Listan poisto listan id:n perusteella
Lista.remove = (id, result) => {
  sql.query('DELETE FROM Lista WHERE l_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos poistettavaa listaa ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted list with id: ', id);
    result(null, res);
  });
};

module.exports = Lista;
