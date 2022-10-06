/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

const Aines = function (Aines) {
  this.aines = Aines.aines;
  this.maara = Aines.maara;
  this.yksikko = Aines.yksikko;
  this.Resepti_r_id = Aines.Resepti_r_id;
};

Aines.create = (newAines, result) => {
  sql.query('INSERT INTO Aines SET ?', newAines, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created Aines: ', { id: res.insertId, ...newAines });
    result(null, { id: res.insertId, ...newAines });
  });
};

Aines.findById = (id, result) => {
  sql.query(`SELECT * FROM Aines WHERE ai_id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found aines: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found aines with the id
    result({ kind: 'not_found' }, null);
  });
};

Aines.getAll = (result) => {
  let query = 'SELECT * FROM Aines';

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('Ainekset: ', res);
    result(null, res);
  });
};

Aines.updateById = (id, aines, result) => {
  sql.query(
    'UPDATE Aines SET aines = ?, maara = ?, yksikko = ? WHERE ai_id = ?',
    [aines.aines, aines.maara, aines.yksikko, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found aines with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Päivitettiin aines: ', { id: id, ...aines });
      result(null, { id: id, ...aines });
    }
  );
};

Aines.remove = (id, result) => {
  sql.query('DELETE FROM Aines WHERE ai_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found aines with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted aines with id: ', id);
    result(null, res);
  });
};

Aines.removeByRecipe = (r_id, result) => {
  sql.query('DELETE FROM Aines WHERE Resepti_r_id = ?', r_id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found aines with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted aines with r_id: ', r_id);
    result(null, res);
  });
};

module.exports = Aines;
