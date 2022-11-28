/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

// Kalenteri_itemin malli
const Kalenteri_Item = function (kalenteri_item) {
  this.pvm = kalenteri_item.pvm;
  this.Kayttaja_k_id = kalenteri_item.Kayttaja_k_id;
  this.Resepti_r_id = kalenteri_item.Resepti_r_id;
};

// Uuden kalenteri_itemin luominen
Kalenteri_Item.create = (newKalenteri_Item, result) => {
  sql.query(
    'INSERT INTO Kalenteri_Item SET ?',
    newKalenteri_Item,
    (err, res) => {
      if (err) {
        // Jos lisäys epäonnistui
        console.log('error: ', err);
        result(err, null);
        return;
      }

      // Jos lisäys onnistui
      console.log('Created kalenteri_item: ', {
        id: res.insertId,
        ...newKalenteri_Item,
      });
      result(null, { id: res.insertId, ...newKalenteri_Item });
    }
  );
};

// Kalenteri_itemin haku kalenteri_itemin id:n perusteella
Kalenteri_Item.findById = (id, result) => {
  sql.query(`SELECT * FROM Kalenteri_Item WHERE ka_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found kalenteri_item: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos kalenteri_itemiä ei löytynyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

Kalenteri_Item.findByUser = (id, result) => {
  sql.query(
    'SELECT * FROM Kalenteri_Item k INNER JOIN Resepti r ON r.r_id = k.Resepti_r_id WHERE k.Kayttaja_k_id = ?',
    id,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      console.log('Kalenteri_Item: ', res);
      result(null, res);
    }
  );
};

// Kaikkien kalenteri_itemien haku
Kalenteri_Item.getAll = (result) => {
  let query = 'SELECT * FROM Kalenteri_Item';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Kalenteri_item: ', res);
    result(null, res);
  });
};

// Kalenteri_itemin päivitys kalenteri_itemin id:n perusteella
Kalenteri_Item.updateById = (id, Kalenteri_Item, result) => {
  sql.query(
    'UPDATE Kalenteri_Item SET pvm = ?, Kayttaja_k_id = ?, Resepti_r_id = ? WHERE ka_id = ?',
    [
      Kalenteri_Item.pvm,
      Kalenteri_Item.Kayttaja_k_id,
      Kalenteri_Item.Resepti_r_id,
      id,
    ],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('error: ', err);
        result(null, err);
        return;
      }

      // Jos päivitettävää kalenteri_itemiä ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated kalenteri_item: ', { id: id, ...lista });
      result(null, { id: id, ...lista });
    }
  );
};

// Kalenteri_itemin poisto kalenteri_itemin id:n perusteella
Kalenteri_Item.remove = (poistettava, result) => {
  const query = `DELETE FROM Kalenteri_Item WHERE ka_id = ${poistettava.ka_id}`;
  sql.query(query, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos poistettavaa kalenteri_itemiä ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted kalenteri_item with id: ', poistettava.ka_id);
    result(null, res);
  });
};

module.exports = Kalenteri_Item;
