/* 
Model on yhden tablen malli joka myös sisältää sen käsittelyyn käytettävät metodit.
*/

const sql = require('../connection');

//Reseptin malli
const Resepti = function (Resepti) {
  this.r_id = Resepti.r_id;
  this.nimi = Resepti.nimi;
  this.ohjeet = Resepti.ohjeet;
  this.erikoisruokavaliot = Resepti.erikoisruokavaliot;
  this.kategoriat = Resepti.kategoriat;
  this.valmistusaika = Resepti.valmistusaika;
  this.annosten_maara = Resepti.annosten_maara;
  this.kuva = Resepti.kuva;
  this.julkinen = Resepti.julkinen;
  this.uusi = Resepti.uusi;
  this.kayttaja_k_id = Resepti.kayttaja_k_id;
};

// Uuden reseptin lisääminen
Resepti.create = (newResepti, result) => {
  sql.query('INSERT INTO Resepti SET ?', newResepti, (err, res) => {
    if (err) {
      // Jos lisäys epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos lisäys onnistui
    console.log('Created recipe: ', { id: res.insertId, ...newResepti });
    result(null, { id: res.insertId, ...newResepti });
  });
};

// Kaikkien reseptien hakeminen
Resepti.getAll = (result) => {
  let query = 'SELECT * FROM Resepti';

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Recipes: ', res);
    result(null, res);
  });
};

Resepti.getAllRecommended = (result) => {
  sql.query(
    'SELECT *, coalesce(AVG(a.arvostelu), null) as keskiarvo FROM Resepti r LEFT JOIN Arvostelu a ON a.Resepti_r_id = r.r_id RIGHT OUTER JOIN Suositellut s ON s.Resepti_r_id = r.r_id GROUP BY r_id ORDER BY s_id DESC;',
    (err, res) => {
      if (err) {
        console.log('error:', err);
        result(null, err);
        return;
      }
      console.log('Recipes:', res);
      result(null, res);
    }
  );
};

Resepti.recommendRecipe = (recipe, result) => {
  sql.query(
    `INSERT INTO Suositellut SET Resepti_r_id = ${recipe}`,
    (err, res) => {
      if (err) {
        console.log('error:', err);
        result(null, err);
        return;
      }
      console.log('Added recipe to recommended:', res);
      result(null, res);
    }
  );
};

// Reseptin hakeminen reseptin id:n perusteella
Resepti.findById = (id, result) => {
  sql.query(`SELECT * FROM Resepti WHERE r_id = ${id}`, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found recipe: ', res[0]);
      result(null, res[0]);
      return;
    }

    // Jos reseptiä ei löytynyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Reseptin hakeminen kriteerien perusteella,
// criterian pitäisi sisältää hakusana sekä erikoisruokavaliot
/* esimerkki
{
    "hakusana": "makarooni",
    "erikoisruokavaliot":{
        \"kasvissyoja\": 0,
        \"maidoton\": 0,
        \"vegaaninen\": 0,
        \"gluteeniton\": 0,
        \"laktoositon\": 0,
        \"kananmunaton\": 0,
        \"vähärasvainen\": 0,
        \"vähähiilihydr\": 0,
      },
    "kategoriat":{
      \"\": 0,
    }
} */
// mutta hakee tällä hetkellä vain reseptin nimestä
Resepti.findByCriteria = (criteria, result) => {
  let query = `SELECT r_id, nimi, ohjeet, erikoisruokavaliot, kategoriat, valmistusaika, annosten_maara, kuva, julkinen, uusi, r.Kayttaja_k_id, coalesce(AVG(a.arvostelu), null) as keskiarvo FROM Resepti r LEFT JOIN Arvostelu a ON a.Resepti_r_id = r.r_id WHERE r.julkinen = 1`;
  if (criteria.hakusana) {
    query += ` AND r.nimi LIKE "%${criteria.hakusana}%"`;
  }
  //Jos haussa on kategorioita niin ne otetaan huomioon
  //Jos ei niitä ei mainita haussa
  if (criteria.kategoriat) {
    query += ` AND (`;
    for (let i = 0; i < criteria.kategoriat.length; i++) {
      if (i === 0) {
        query += `JSON_EXTRACT(kategoriat, "$.${criteria.kategoriat[i]}") = 1`;
      } else {
        query += ` OR JSON_EXTRACT(kategoriat, "$.${criteria.kategoriat[i]}") = 1`;
      }
    }
    query += `)`;
  }

  //Jos haussa on erikoisruokavalioita niin ne otetaan huomioon
  //Jos ei niitä ei mainita haussa
  if (criteria.erikoisruokavaliot) {
    criteria.erikoisruokavaliot.forEach((er) => {
      query += ` AND JSON_EXTRACT(erikoisruokavaliot, "$.${er}") = 1`;
    });
  }

  query += ' GROUP BY r_id ';

  /*
  Tulosten järjestys. Jos criteria.jarjestys = r_id, näkyy uusimmat ensin,
  jos se on keskiarvo, näkyy parhaaksi arvostellut ensin.
  */
  query += ` ORDER BY ${criteria.jarjestys} DESC`;

  // Jos haussa tulee mukana aloitus (offset), lisätään se queryyn.
  if (criteria.aloitus !== undefined)
    query += ` LIMIT 10 OFFSET ${criteria.aloitus}`;

  sql.query(query, (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(err, []);
      return;
    }

    // Jos haku onnistui
    if (res.length) {
      console.log('Found recipes: ', res.length, ' pcs');
      result(null, res);
      return;
    }

    // Jos reseptiä ei löytynyt id:llä
    result({ kind: 'not_found' }, null);
  });
};

// Käyttäjän reseptien hakeminen käyttäjän id:n perusteella
Resepti.findByUser = (kayttaja_k_id, result) => {
  sql.query(
    `SELECT r_id, nimi, ohjeet, erikoisruokavaliot, kategoriat, valmistusaika, annosten_maara, kuva, julkinen, uusi, r.Kayttaja_k_id, coalesce(AVG(a.arvostelu), null) as keskiarvo FROM Resepti r LEFT JOIN Arvostelu a ON a.Resepti_r_id = r.r_id WHERE r.kayttaja_k_id = ${kayttaja_k_id} GROUP BY r_id`,
    (err, res) => {
      if (err) {
        // Jos haku epäonnistui
        console.log('Error: ', err);
        result(err, null);
        return;
      }
      // Jos haku onnistui
      if (res.length) {
        console.log('Found recipes: ', res);
        result(null, res);
        return;
      }
      // Jos reseptiä ei löytynyt id:llä
      result({ kind: 'not_found' }, null);
    }
  );
};

// Kaikkien julkisten reseptien hakeminen
Resepti.getAllPublic = (result) => {
  sql.query('SELECT * FROM Resepti WHERE julkinen = 1', (err, res) => {
    if (err) {
      // Jos haku epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos haku onnistui
    console.log('Recipes: ', res);
    result(null, res);
  });
};

// Reseptin päivitys reseptin id:n perusteella
Resepti.updateById = (id, Resepti, result) => {
  sql.query(
    'UPDATE Resepti SET nimi = ?, ohjeet = ?, erikoisruokavaliot = ?, kategoriat = ?, valmistusaika = ?, annosten_maara = ?, kuva = ?, julkinen = ?, uusi = ?, kayttaja_k_id = ? WHERE r_id = ?',
    [
      Resepti.nimi,
      Resepti.ohjeet,
      Resepti.erikoisruokavaliot,
      Resepti.kategoriat,
      Resepti.valmistusaika,
      Resepti.annosten_maara,
      Resepti.kuva,
      Resepti.julkinen,
      Resepti.uusi,
      Resepti.kayttaja_k_id,
      id,
    ],
    (err, res) => {
      if (err) {
        // Jos päivitys epäonnistui
        console.log('Error: ', err);
        result(null, err);
        return;
      }

      // Jos reseptiä ei löytynyt id:llä
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      // Jos päivitys onnistui
      console.log('Updated recipe: ', { id: id, ...Resepti });
      result(null, { id: id, ...Resepti });
    }
  );
};

// Reseptin poistaminen reseptin id:n perusteella
Resepti.remove = (id, result) => {
  sql.query('DELETE FROM Resepti WHERE r_id = ?', id, (err, res) => {
    if (err) {
      // Jos poisto epäonnistui
      console.log('Error: ', err);
      result(null, err);
      return;
    }

    // Jos reseptiä ei löytynyt id:llä
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    // Jos poisto onnistui
    console.log('Deleted recipe with id: ', id);
    result(null, res);
  });
};

module.exports = Resepti;
