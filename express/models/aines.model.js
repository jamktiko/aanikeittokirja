/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Aineksen malli
const Aines = function (Aines) {
  this.aines = Aines.aines;
  this.maara = Aines.maara;
  this.yksikko = Aines.yksikko;
  this.Resepti_r_id = Aines.Resepti_r_id;
};

// Uuden aineksen lisääminen
Aines.create = (newAines, result) => {
  sql.query('INSERT INTO Aines SET ?', newAines, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('Created ingredient: ', { id: res.insertId, ...newAines });
    result(null, { id: res.insertId, ...newAines });
  });
};

// Aineksen haku aineksen id:n perusteella
Aines.findById = (id, result) => {
  sql.query(`SELECT * FROM Aines WHERE ai_id = ${id}`, (err, res) => {
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

    // Jos haku epäonnistui
    result({ kind: 'not_found' }, null);
  });
};

// Kaikkien ainesten haku
Aines.getAll = (result) => {
  let query = 'SELECT * FROM Aines';

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

// Aineksen päivitys aineksen id:n perusteella
Aines.updateById = (id, aines, result) => {
  sql.query(
    'UPDATE Aines SET aines = ?, maara = ?, yksikko = ? WHERE ai_id = ?',
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
Aines.remove = (id, result) => {
  sql.query('DELETE FROM Aines WHERE ai_id = ?', id, (err, res) => {
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
Aines.removeByRecipe = (r_id, result) => {
  sql.query('DELETE FROM Aines WHERE Resepti_r_id = ?', r_id, (err, res) => {
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
    console.log('Deleted ingredient with recipe id (r_id): ', r_id);
    result(null, res);
  });
};

module.exports = Aines;
