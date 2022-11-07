/* 
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Resepti = require('../models/resepti.model.js');
const Aines = require('../models/aines.model.js');
const conn = require('../connection');

// Luo uusi resepti
exports.create = (req, res) => {
  // Tämä on transaktion alku
  conn.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    if (!req.body) {
      res.status(400).send({
        message: 'Body cannot be empty!',
      });
      return;
    }
    // Reseptin malli
    const resepti = new Resepti({
      nimi: req.body.nimi,
      ohjeet: req.body.ohjeet,
      erikoisruokavaliot: req.body.erikoisruokavaliot,
      kategoriat: req.body.kategoriat,
      valmistusaika: req.body.valmistusaika,
      annosten_maara: req.body.annosten_maara,
      kuva: req.body.kuva,
      julkinen: req.body.julkinen,
      uusi: req.body.uusi,
      kayttaja_k_id: req.body.kayttaja_k_id,
    });
    // Tähän otetaan lista aineksista
    const ainekset = req.body.ainekset;
    const lisaaja = req.headers.cognitoId;
    // Tässä luodaan uusi resepti ylläolevan mallipohjan avulla
    Resepti.create(resepti, (err, data) => {
      if (err) {
        conn.rollback(function () {
          throw err;
        });
      } else {
        // Jos reseptin luonti onnistuu, palautetaan reseptin id joka otetaan muuttujaan
        let id = data.id;
        //Jos reseptin luonti onnistuu, haetaan reseptin omistajan cognito_id ja verrataan sitä reseptin lisääjään
        //niiden kuuluu olla sama
        Kayttaja.findById(data.kayttaja_k_id, (err, data) => {
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          } else {
            if (data.cognito_Id == lisaaja) {
              // Käydään läpi kaikki aineslistan ainekset ja luodaan niistä reseptin ainekset tietokantaan
              ainekset.forEach((aines) => {
                // Yllä talteenotettua id:tä käytetään tässä, jotta ainesosaan saadaan oikean reseptin id
                const AinesData = new Aines({
                  aines: aines.aines,
                  maara: aines.maara,
                  yksikko: aines.yksikko,
                  Resepti_r_id: id,
                });
                Aines.create(AinesData, (err, data) => {
                  if (err) {
                    conn.rollback(function () {
                      throw err;
                    });
                  }
                });
              });
            } else {
              conn.rollback(function () {
                throw err;
              });
            }
          }
        });
      }
    });
    // Lopuksi muutokset commitoidaan tietokantaan, jos ei ole tullut virheitä
    conn.commit(function (err) {
      console.log('commit');
      if (err) {
        conn.rollback(function () {
          throw err;
        });
      } else {
        console.log('Successfully added recipe and related ingredients');
        res.send(data);
      }
    });
  }); // Transaktion loppu
};

// Hae kriteereiden perusteella,
// tällä hetkellä haku hakee vain reseptin nimestä
exports.findByCriteria = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }
  // Haun kriteerit
  const kriteeria = {
    hakusana: req.body.hakusana,
    erikoisruokavaliot: req.body.erikoisruokavaliot,
    kategoriat: req.body.kategoriat,
  };
  Resepti.findByCriteria(kriteeria, (err, data) => {
    if (data == null) {
      res.send([]);
    } else res.send(data);
  });
};

// Hae kaikki reseptit
exports.findAll = (req, res) => {
  Resepti.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting recipes',
      });
    else res.send(data);
  });
};

// Hae resepti reseptin id:n perusteella
exports.findOne = (req, res) => {
  Resepti.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Recipe not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Hae kaikki julkiset resepit
exports.findAllPublic = (req, res) => {
  Resepti.getAllPublic((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting recipes',
      });
    else res.send(data);
  });
};

// Päivitä resepti id:n perusteella
exports.update = (req, res) => {
  // Tämä on transaktion alku
  conn.beginTransaction(function (err) {
    if (!req.body) {
      res.status(400).send({
        message: 'Body cannot be empty!',
      });
    }
    // Data tähän funktioon tulee samassa muodossa kuin uuden luontiin,
    // joten resepti otetaan omaan muuttujaan ja lista aineksista omaan
    const resepti = new Resepti({
      nimi: req.body.nimi,
      ohjeet: req.body.ohjeet,
      erikoisruokavaliot: req.body.erikoisruokavaliot,
      kategoriat: req.body.kategoriat,
      valmistusaika: req.body.valmistusaika,
      annosten_maara: req.body.annosten_maara,
      kuva: req.body.kuva,
      julkinen: req.body.julkinen,
      uusi: req.body.uusi,
      kayttaja_k_id: req.body.kayttaja_k_id,
    });
    const ainekset = req.body.ainekset;
    const lisaaja = req.headers.cognitoId;
    console.log(req.body);

    // Resepti päivitetään tässä
    Resepti.updateById(req.params.id, resepti, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Not found recipe with id ${req.params.id}.`,
          });
          conn.rollback(function () {
            throw err;
          });
        } else {
          res.status(500).send({
            message: 'Error updating recipe with id ' + req.params.id,
          });
          conn.rollback(function () {
            throw err;
          });
        }
      } else {
        Kayttaja.findById(data.kayttaja_k_id, (err, data) => {
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          } else {
            if (data.cognito_Id == lisaaja) {
              Aines.removeByRecipe(req.params.id, (err, data) => {
                if (err) {
                  conn.rollback(function () {
                    throw err;
                    /* res.status(500).send({
                      message: 'Error deleting aines with r_id ' + req.params.id,
                    }); */
                  });
                } else {
                  // Tässä luodaan uudet ainekset jotka korvaavat vanhat
                  ainekset.forEach((aines) => {
                    const AinesData = new Aines({
                      aines: aines.aines,
                      maara: aines.maara,
                      yksikko: aines.yksikko,
                      Resepti_r_id: req.params.id,
                    });
                    Aines.create(AinesData, (err, data) => {
                      if (err) {
                        conn.rollback(function () {
                          throw err;
                        });
                      }
                    });
                  });
                }
              });
            } else {
              conn.rollback(function () {
                throw err;
              });
            }
          }
        });
      }
    });
    conn.commit(function (err) {
      console.log('commit');
      if (err) {
        conn.rollback(function () {
          throw err;
        });
      }
      res.send(data);
      console.log('Successfully updated recipe and related ingredients');
    });
  }); // Transaktion loppu
};

// Poista resepti reseptin id:n perusteella
// Tämä versio käyttää tietokannassa cascade toimintoa poistamaan tarvittavat asiat kun resepti poistetaan.
exports.delete = (req, res) => {
  conn.beginTransaction(function (err) {
    const lisaaja = req.headers.cognitoId;
    Resepti.remove(req.params.id, (err, data) => {
      if (err) {
        conn.rollback(function () {
          res.status(500).send({
            message: 'Error deleting resepti with id ' + req.params.id,
          });
        });
      } else {
        Kayttaja.findById(data.kayttaja_k_id, (err, data) => {
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          } else {
            if (data.cognito_Id !== lisaaja) {
              conn.rollback(function () {});
            }
          }
        });
      }
    });
    conn.commit(function (err) {
      console.log('commit');
      if (err) {
        conn.rollback(function () {
          throw err;
        });
      }
      res.send(data);
      console.log('Successfully deleted recipe and related ingredients');
    });
  });
};
