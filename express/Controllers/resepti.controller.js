const Resepti = require('../models/resepti.model.js');

// Luo uusi käyttäjä
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Sisältö ei voi olla tyhjä!',
    });
  }

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

  Resepti.create(resepti, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Virhe tapahtui käyttäjää luodessa.',
      });
    else res.send(data);
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

// Hae käyttäjä id:n perusteella
exports.findOne = (req, res) => {
  Resepti.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Käyttjä not found',
        });
      } else {
        res.status(500).send({
          message: 'Virhe haussa.',
        });
      }
    } else res.send(data);
  });
};

// Hae kaikki adminit
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
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  console.log(req.body);

  Resepti.updateById(req.params.id, new Resepti(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Resepti with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating Resepti with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista resepti id:n perusteella
exports.delete = (req, res) => {
  Resepti.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting resepti with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
