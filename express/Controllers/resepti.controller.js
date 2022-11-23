/*
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const Resepti = require('../models/resepti.model.js');
const Aines = require('../models/aines.model.js');
const pool = require('../connection');
const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi resepti
exports.create = (req, res) => {
  // Transaktio vaatii Poolin (jatkuva / monta yhteyttä) sijaan Connectionin (yksi yhteys)
  pool.getConnection(function (err, conn) {
    // Tämä on transaktion alku
    conn.beginTransaction(function (err) {
      if (err) {
        conn.release();
        throw err;
      }
      if (!req.body) {
        conn.rollback(function () {
          res.status(400).send({
            message: 'Body cannot be empty!',
          });
          conn.release();
          return;
        });
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
      const lisaaja = req.headers.cognitoid;
      // Tässä luodaan uusi resepti ylläolevan mallipohjan avulla
      Resepti.create(resepti, (err, data) => {
        const recipeData = data;
        if (err) {
          conn.rollback(function () {
            conn.release();
            throw err;
          });
        } else {
          // Jos reseptin luonti onnistuu, palautetaan reseptin id joka otetaan muuttujaan
          const id = data.id;
          console.log('data', data);
          // Jos reseptin luonti onnistuu, haetaan reseptin omistajan cognito_id ja verrataan sitä reseptin lisääjään
          // niiden kuuluu olla sama
          Kayttaja.findById(data.kayttaja_k_id, (err, data) => {
            console.log('kayttaja_k_id', data.k_id);
            if (err) {
              conn.rollback(function () {
                conn.release();
                throw err;
              });
            } else {
              if (data.cognito_id == lisaaja && lisaaja !== undefined) {
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
                        conn.release();
                        throw err;
                      });
                    }
                  });
                });
                // Lopuksi muutokset commitoidaan tietokantaan, jos ei ole tullut virheitä
                // Transaktion loppu
                conn.commit(function (err) {
                  console.log('commit');
                  if (err) {
                    conn.rollback(function () {
                      conn.release();
                      console.log('Rollback done!');
                    });
                  } else {
                    console.log(
                      'Successfully added recipe and related ingredients'
                    );
                    res.send(recipeData);
                  }
                });
              } else {
                conn.rollback(function () {
                  conn.release();
                  console.log('Rollback done!');
                  res.status(401).send("You don't have permission to do this!");
                });
              }
            }
          });
        }
      });
    });
  });
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
    aloitus: req.body.aloitus,
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
    if (err) {
      res.status(500).send({
        message: err.message || 'Error getting recipes',
      });
    } else res.send(data);
  });
};

// Hae suositellut reseptit
exports.findAllRecommended = (req, res) => {
  Resepti.getAllRecommended((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error getting recipes',
      });
    else res.send(data);
  });
};

// Lisää resepti suositeltuihin
exports.recommendRecipe = (req, res) => {
  Kayttaja.getByCId(req.headers.cognitoid, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Error finding user',
      });
    else {
      if (data[0].isAdmin == 1) {
        Resepti.recommendRecipe(req.params.id, (err, data) => {
          if (err)
            res.status(500).send({
              message: err.message || 'Error adding recipe to recommended',
            });
          else res.send(data);
        });
      } else {
        res.status(401).send({ message: 'Only admins can add to recommended' });
      }
    }
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
    if (err) {
      res.status(500).send({
        message: err.message || 'Error getting recipes',
      });
    } else res.send(data);
  });
};

//Hae yhden käyttäjän kaikki reseptit

exports.findByUser = (req, res) => {
  Resepti.findByUser(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.messsage || 'Error getting recipes',
      });
    } else {
      res.send(data);
    }
  });
};

// Päivitä resepti id:n perusteella
exports.update = (req, res) => {
  // Tämä on transaktion alku
  pool.getConnection(function (err, conn) {
    conn.beginTransaction(function (err) {
      if (!req.body) {
        conn.release();
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

      // Resepti päivitetään tässä
      Resepti.updateById(req.params.id, resepti, (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.status(404).send({
              message: `Not found recipe with id ${req.params.id}.`,
            });
            conn.rollback(function () {
              conn.release();
              throw err;
            });
          } else {
            res.status(500).send({
              message: 'Error updating recipe with id ' + req.params.id,
            });
            conn.rollback(function () {
              conn.release();
              throw err;
            });
          }
        } else {
          Kayttaja.findById(data.kayttaja_k_id, (err, data) => {
            if (err) {
              conn.rollback(function () {
                conn.release();
                throw err;
              });
            } else {
              if (data.cognito_Id == lisaaja) {
                Aines.removeByRecipe(req.params.id, (err, data) => {
                  if (err) {
                    conn.rollback(function () {
                      conn.release();
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
                            conn.release();
                            throw err;
                          });
                        }
                      });
                    });

                    conn.commit(function (err) {
                      console.log('commit');
                      if (err) {
                        conn.rollback(function () {
                          conn.release();
                          throw err;
                        });
                      }
                      res.send(data);
                      console.log(
                        'Successfully updated recipe and related ingredients'
                      );
                    });
                  }
                });
              } else {
                conn.rollback(function () {
                  conn.release();
                  throw err;
                });
              }
            }
          });
        }
      });
    }); // Transaktion loppu
  });
};

// Poista resepti reseptin id:n perusteella
// Tämä versio käyttää tietokannassa cascade toimintoa poistamaan tarvittavat asiat kun resepti poistetaan.
exports.delete = (req, res) => {
  const poistaja = req.headers.cognitoId;
  Resepti.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error in search' });
    } else {
      Kayttaja.findById(data.Kayttaja_k_id, (err, data) => {
        if (err) {
          res.status(500).send({ message: 'Error in search' });
        } else {
          if (data.cognito_Id !== poistaja) {
            res
              .status(501)
              .send({ message: 'You can not delete other peoples recipes' });
          } else {
            Resepti.remove(req.params.id, (err, data) => {
              if (err) {
                res.status(500).send({
                  message: 'Error deleting resepti with id ' + req.params.id,
                });
              } else {
                res.send(data);
                console.log(
                  'Successfully deleted recipe and related ingredients'
                );
              }
            });
          }
        }
      });
    }
  });
};
