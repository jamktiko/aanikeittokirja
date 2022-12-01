/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Aineksen malli
const Ostoslista_aines = function (ostoslista_aines) {
  this.oa_id = ostoslista_aines.oa_id;
  this.aines = ostoslista_aines.aines;
  this.maara = ostoslista_aines.maara;
  this.yksikko = ostoslista_aines.yksikko;
  this.Ostoslista_o_id = ostoslista_aines.Ostoslista_o_id;
};

// Uuden aineksen lisääminen
Ostoslista_aines.create = (newOstoslistaAines, result) => {
  sql.query(
    'INSERT INTO Ostoslista_aines SET ?',
    newOstoslistaAines,
    (err, res) => {
      if (err) {
        // Jos lisäys epäonnistui
        console.log('Error: ', err);
        result(err, null);
        return;
      }

      // Jos lisäys onnistui
      console.log('Created ingredient: ', {
        id: res.insertId,
        ...newOstoslistaAines,
      });
      result(null, { id: res.insertId, ...newOstoslistaAines });
    }
  );
};

// Aineksen haku aineksen id:n perusteella
Ostoslista_aines.findById = (id, result) => {
  sql.query(
    `SELECT * FROM Ostoslista_aines WHERE oa_id = ${id}`,
    (err, res) => {
      if (err) {
        // Jos haku epäonnistui
        console.log('Error: ', err);
        result(err, null);
        return;
      }

      // Jos haku onnistui
      if (res.length) {
        console.log('Found ingredient: ', res[0]);
        result(null, res[0]);
        return;
      }

      // Jos ainesta ei löytynyt id:llä
      result({ kind: 'not_found' }, null);
    }
  );
};

// Kaikkien ainesten haku
Ostoslista_aines.getAll = (result) => {
  let query = 'SELECT * FROM Ostoslista_aines';

  // Jos haku epäonnistui
  sql.query(query, (err, res) => {
    if (err) {
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Ingredients: ', res);
    result(null, res);
  });
};

// Ainesten haku reseptin perusteella
Ostoslista_aines.findByShoppingList = (id, result) => {
  sql.query(
    'SELECT * FROM Ostoslista_aines WHERE Ostoslista_o_id = ?',
    id,
    (err, res) => {
      if (err) {
        console.log('Error: ', err);
        result(null, err);
        return;
      }
      console.log('Ingredients: ', res);
      result(null, res);
    }
  );
};

// Aineksen päivitys aineksen id:n perusteella
Ostoslista_aines.updateById = (id, aines, result) => {
  sql.query(
    'UPDATE Ostoslista_aines SET aines = ?, maara = ?, yksikko = ? WHERE oa_id = ?',
    [aines.aines, aines.maara, aines.yksikko, id],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('Error: ', err);
        result(null, err);
        return;
      }

      // Jos päivitettävää ainesta ei löytynyt
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated ingredient: ', { id: id, ...aines });
      result(null, { id: id, ...aines });
    }
  );
};

// Aineksen poisto aineksen id:n perusteella
Ostoslista_aines.remove = (id, result) => {
  sql.query('DELETE FROM Ostoslista_aines WHERE oa_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos poistettavaa ainesta ei löytynyt
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted ingredient with id: ', id);
    result(null, res);
  });
};

// Aineksen poisto reseptin poiston seurauksena
Ostoslista_aines.removeByList = (o_id, result) => {
  sql.query(
    'DELETE FROM Ostoslista_aines WHERE Ostoslista_o_id = ?',
    o_id,
    (err, res) => {
      if (err) {
        // Jos poisto epäonnistui
        console.log('error: ', err);
        result(null, err);
        return;
      }

      // Jos poistettavaa ainesta ei löytynyt
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos poisto onnistui
      console.log('Deleted ingredient with recipe id (o_id): ', o_id);
      result(null, res);
    }
  );
};

module.exports = Ostoslista_aines;
