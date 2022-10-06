const Resepti = require('../models/resepti.model.js');
const Aines = require('../models/aines.model.js');
const conn = require('../connection');

// Luo uusi käyttäjä
exports.create = (req, res) => {
  //Tämä on transaktio
  conn.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    if (!req.body) {
      res.status(400).send({
        message: 'Sisältö ei voi olla tyhjä!',
      });
      return;
    }
    //Reseptin malli
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
    //Tähän otetaan lista aineksista
    const ainekset = req.body.ainekset;

    //Tässä luodaan uusi resepti yllä olevan pohjan avulla
    Resepti.create(resepti, (err, data) => {
      if (err) {
        conn.rollback(function () {
          throw err;
        });
      } else {
        //Jos reseptin luonti onnistuu niin se palauttaa reseptin ID:n joka otetaan tässä muuttujaan
        let id = data.id;
        //Käydään läpi kaikki aines listan ainekset ja luodaan niistä reseptin ainekset tietokantaan
        ainekset.forEach((aines) => {
          //Yllä talteen otettua id:tä käytetään tässä että ainekseen saadaan oikan reseptin ID.
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
        //Viimeksi jos ei ole tullut virheitä muutokset commitoidaan tietokantaa.
        conn.commit(function (err) {
          console.log('commit');
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          } else {
            console.log('successfully added resepti and related aines');
            res.send(data);
          }
        });
      }
    });
  });
};

// Hae kriteereiden perusteella

exports.findByCriteria = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Sisältö ei voi olla tyhjä!',
    });
  }
  const kriteeria = {
    hakusana: req.body.hakusana,
    erikoisruokavaliot: req.body.erikoisruokavaliot,
  };
};

// Hae kaikki reseptit
exports.findAll = (req, res) => {
  const enimi = req.query.title;

  Resepti.getAll(enimi, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui käyttäjie hakiessa.',
      });
    else res.send(data);
  });
};

// Hae Resepti id:n perusteella
exports.findOne = (req, res) => {
  Resepti.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Resepti not found',
        });
      } else {
        res.status(500).send({
          message: 'Virhe haussa.',
        });
      }
    } else res.send(data);
  });
};

// Hae kaikki julkiset
exports.findAllPublic = (req, res) => {
  Resepti.getAllPublic((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui reseptejä etsiessä.',
      });
    else res.send(data);
  });
};

// Päivitä käyttäjä id:n perusteella
exports.update = (req, res) => {
  //Tässä taas käytetään transaktiota
  conn.beginTransaction(function (err) {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });
    }
    //Data tähän funktioon tulee samassa muodossa kuin uuden luontiin
    //joten tässä myös otetaan resepti omaan muuttujaan ja lista aineksista toiseen
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
    console.log(req.body);
    //Resepti päivitetään tässä
    Resepti.updateById(req.params.id, resepti, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).send({
            message: `Not found Resepti with id ${req.params.id}.`,
          });
          conn.rollback(function () {
            throw err;
          });
        } else {
          res.status(500).send({
            message: 'Error updating Resepti with id ' + req.params.id,
          });
          conn.rollback(function () {
            throw err;
          });
        }
      } else {
        console.log(req.params.id);
        //Tässä poistetaan kaikki vanhat ainekset
        Aines.removeByRecipe(req.params.id, (err, data) => {
          if (err) {
            conn.rollback(function () {
              throw err;
              /*res.status(500).send({
                message: 'Error deleting aines with r_id ' + req.params.id,
              });*/
            });
          } else {
            //Tässä luodaan uudet ainekset jotka korvaavat vanhat
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
            conn.commit(function (err) {
              console.log('commit');
              if (err) {
                conn.rollback(function () {
                  throw err;
                });
              }
              res.send(data);
              console.log('successfully deleted resepti and related aines');
            });
          }
        });
      }
    });
  });
};

// Poista resepti id:n perusteella
exports.delete = (req, res) => {
  conn.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    Aines.removeByRecipe(req.params.id, (err, data) => {
      if (err) {
        conn.rollback(function () {
          throw err;
          /*res.status(500).send({
            message: 'Error deleting aines with r_id ' + req.params.id,
          });*/
        });
      } else {
        console.log(data);
        //res.send(data);
      }
      Resepti.remove(req.params.id, (err, data) => {
        if (err) {
          conn.rollback(function () {
            throw err;
            //res.status(500).send({
            //  message: 'Error deleting resepti with id ' + req.params.id,
            //});
          });
        } else {
          console.log(data);
          //  res.send(data);
        }
        conn.commit(function (err) {
          console.log('commit');
          if (err) {
            conn.rollback(function () {
              throw err;
            });
          }
          res.send(data);
          console.log('successfully deleted resepti and related aines');
        });
      });
    });
  });
};
