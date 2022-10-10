/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Lista_has_Reseptin malli
const Lista_has_Resepti = function (lista_has_resepti) {
  this.Lista_l_id = lista_has_resepti.Lista_l_id;
  this.Resepti_r_id = lista_has_resepti.Resepti_r_id;
};

// Reseptin lisääminen lista_has_resepti-tauluun
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
      console.log('Added to the list a recipe with id: ', {
        id: res.insertId,
        ...newLista_has_Resepti,
      });
      result(null, { id: res.insertId, ...newLista_has_Resepti });
    }
  );
};
