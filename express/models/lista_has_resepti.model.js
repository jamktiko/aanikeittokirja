/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Lista_has_Reseptin malli
const Lista_has_Resepti = function (lista_has_resepti) {
  this.Lista_l_id = lista_has_resepti.Lista_l_id;
  this.Resepti_r_id = lista_has_resepti.Resepti_r_id;
};

// Uuden lista_has_reseptin luominen
Lista_has_Resepti.create = (newLista_has_Resepti, result) => {
  sql.query(
    'INSERT INTO Lista_has_Resepti SET ?',
    newLista_has_Resepti,
    (err, res) => {
      if (err) {
        // Jos lisäys epäonnistui
        console.log('error: ', err);
        result(err, null);
        return;
      }

      // Jos lisäys onnistui
      console.log('Created lista_has_resepti with id: ', {
        id: res.insertId,
        ...newLista_has_Resepti
      });
      result(null, { id: res.insertId, ...newLista_has_Resepti });
    }
  );
};

// Lista_has_reseptin haku listan id:n perusteella
Lista_has_Resepti.findById = (id, result) => {
  sql.query(
    `SELECT * FROM Lista_has_Resepti WHERE Lista_l_id = ${id}`,
    (err, res) => {
      if (err) {
        // Jos haku epäonnistui
        console.log('error: ', err);
        result(err, null);
        return;
      }

      // Jos haku onnistui
      if (res.length) {
        console.log('Found lista_has_resepti: ', res);
        result(null, res);
        return;
      }

      // Jos lista_has_reseptiä ei löytynyt id:llä
      result({ kind: 'not_found' }, null);
    }
  );
};

// Kaikkien lista_has_reseptien haku
Lista_has_Resepti.getAll = (result) => {
  let query = 'SELECT * FROM Lista_has_Resepti';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Lista_has_Resepti: ', res);
    result(null, res);
  });
};

// Lista_has_reseptin poisto lista_has_reseptin id:n perusteella
Lista_has_Resepti.remove = (req, result) => {
  sql.query(
    'DELETE FROM Lista_has_Resepti WHERE Resepti_r_id = ? AND Lista_l_id = ?',
    [req.params.r, req.params.l],
    (err, res) => {
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
      console.log('Deleted lista_has_resepti with id: ', id);
      result(null, res);
    }
  );
};

module.exports = Lista_has_Resepti;
