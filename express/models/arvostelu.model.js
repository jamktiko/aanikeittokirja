/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Ostoslistan malli
const Arvostelu = function (Arvostelu) {
  this.arvostelu = Arvostelu.arvostelu;
  this.Resepti_r_id = Arvostelu.Resepti_r_id;
  this.Kayttaja_k_id = Arvostelu.Kayttaja_k_id;
};

// Uuden arvostelun lisääminen
Arvostelu.create = (newArvostelu, result) => {
  sql.query('INSERT INTO Arvostelu SET ?', newArvostelu, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('Created review: ', {
      id: res.insertId,
      ...newArvostelu,
    });
    result(null, { id: res.insertId, ...newArvostelu });
  });
};

// Arvosteun haku arvostelun id:n perusteella
Arvostelu.findById = (id, result) => {
  sql.query(`SELECT * FROM arvoselu WHERE a_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found reviw: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos arvostelua ei löytytnyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Arvostelujen haku käyttäjän id:n perusteella
Arvostelu.findByUser = (id, result) => {
  sql.query(`SELECT * FROM arvoselu WHERE a_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found reviw: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos arvostelua ei löytytnyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Arvostelujen haku reseptin ID:n perusteella
Arvostelu.findByRecipe = (id, result) => {
  sql.query(`SELECT * FROM arvoselu WHERE a_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found reviw: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos arvostelua ei löytytnyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Kaikkien arvostelujen haku
Arvostelu.getAll = (result) => {
  let query = 'SELECT * FROM Arvostelu';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Arvostelut: ', res);
    result(null, res);
  });
};

// Arvostelun päivitys arvostelun id:n perusteella
Arvostelu.updateById = (id, arvostelu, result) => {
  sql.query(
    'UPDATE Arvostelu SET nimi = ? WHERE a_id = ?',
    [arvostelu.nimi, id],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('Error: ', err);
        result(null, err);
        return;
      }

      // Jos arvostelua ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated review: ', { id: id, ...arvostelu });
      result(null, { id: id, ...arvostelu });
    }
  );
};

// Arvostelun poistaminen arvostelun id:n perusteella
Arvostelu.remove = (id, result) => {
  sql.query('DELETE FROM Arvostelu WHERE a_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos arvostelua ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted review with id: ', id);
    result(null, res);
  });
};

module.exports = Arvostelu;
