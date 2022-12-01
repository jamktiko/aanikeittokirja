/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Ilmiannon malli
const Ilmianto = function (ilmianto) {
  this.i_id = ilmianto.i_id;
  this.Kayttaja_k_id = ilmianto.Kayttaja_k_id;
  this.Resepti_r_id = ilmianto.Resepti_r_id;
  this.viesti = ilmianto.viesti;
  this.pvm = ilmianto.pvm;
};

// Uuden Ilmiannon luominen
Ilmianto.create = (newIlmianto, result) => {
  sql.query('INSERT INTO Ilmiannot SET ?', newIlmianto, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('Created Ilmianto: ', {
      id: res.insertId,
      ...newIlmianto,
    });
    result(null, { id: res.insertId, ...newIlmianto });
  });
};

module.exports = Ilmianto;
