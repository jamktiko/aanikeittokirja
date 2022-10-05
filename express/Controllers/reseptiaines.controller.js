const Resepti = require('../models/resepti.model.js');
const Aines = require('../models/aines.model.js');

conn.beginTransaction((err) => {
  // transaktion alku
  if (err) {
    // jos virhe niin transaktiota ei aloiteta
    return handleError(err);
  }
  exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: 'Sisältö ei voi olla tyhjä!',
      });
    }
    if (err) {
      // jos virhe niin rollback peruutetaan
      return conn.rollback(() => {
        throw err;
      });
    }

    // RESEPTIN LISÄYS
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
      if (err) {
        // jos virhe, rollback peruutetaan
        res.status(500).send({
          message: err.message || 'Virhe tapahtui reseptiä lisättäessä.',
        });
        return conn.rollback(() => {
          throw err;
        });
      } else {
        res.send(data);
      }

      // AINESOSAN LISÄYS
      const aines = new Aines({
        aines: req.body.aines,
        maara: req.body.maara,
        yksikko: req.body.yksikko,
        Resepti_r_id: req.body.Resepti_r_id,
      });

      Aines.create(aines, (err, data) => {
        if (err) {
          // jos virhe, rollback peruutetaan
          res.status(500).send({
            message: err.message || 'Virhe tapahtui ainesta lisättäessä.',
          });
          return conn.rollback(() => {
            throw err;
          });
        } else {
          res.send(data);
        }
      });

      conn.commit((err) => {
        // commit on koko transaktion suoritus
        if (err) {
          return conn.rollback(() => {
            throw err;
          });
        }
      });
    }); // reseptin lisäyksen lopetus

    console.log('Lisätty resepti ' + resepti.nimi + ' ja aines ' + aines.aines);
    //console.log(result);
    //return result;
  };
}); //transaktion loppu
