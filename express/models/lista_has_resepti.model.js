/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Lista_has_reseptin malli,
// sisältää vain viittauksen reseptin id:hen
const Lista_has_resepti = function (lista_has_resepti) {
  this.Resepti_r_id = lista_has_resepti.Resepti_r_id;
};

// Reseptin lisääminen lista_has_resepti-tauluun
Lista_has_resepti.create = (newLista_has_resepti, result) => {
  sql.query(
    'INSERT INTO Lista_has_resepti SET ?',
    newLista_has_resepti,
    (err, res) => {
      if (err) {
        // Jos lisäys epäonnistui
        console.log('error: ', err);
        result(err, null);
        return;
      }

      // Jos lisäys onnistui
      console.log('Added to the list a recipe with id: ', {
        id: res.insertId,
        ...newLista_has_resepti,
      });
      result(null, { id: res.insertId, ...newLista_has_resepti });
    }
  );
};
