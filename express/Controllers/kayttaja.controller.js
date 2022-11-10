/*
Contoller käyttää modelin metodeja ja käsittelee niiden palauttamia arvoja.
*/

const ACI = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: 'eu-west-1_oa2A5XgI9',
  ClientId: '2cboqa7m7hiuihabauuoca2stt',
};

const UserPoolConstructor = ACI.CognitoUserPool;

const UserPool = new UserPoolConstructor(poolData);

const Kayttaja = require('../models/kayttaja.model.js');

// Luo uusi käyttäjä
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }
  const attributelist = [];

  const dataName = {
    Name: 'given_name',
    Value: req.body.enimi,
  };

  const dataFamily = {
    Name: 'family_name',
    Value: req.body.snimi,
  };

  const attGivenName = new ACI.CognitoUserAttribute(dataName);
  const attFamilyName = new ACI.CognitoUserAttribute(dataFamily);

  attributelist.push(attGivenName);
  attributelist.push(attFamilyName);

  UserPool.signUp(
    req.body.email,
    req.body.password,
    attributelist,
    null,
    (err, cognData) => {
      console.log('cognData: ', cognData.userSub);
      if (err) {
        console.error(err);
      } else {
        const kayttaja = new Kayttaja({
          enimi: req.body.enimi,
          snimi: req.body.snimi,
          email: req.body.email,
          cognito_id: cognData.userSub,
          isAdmin: req.body.isAdmin,
          erikoisruokavaliot: req.body.erikoisruokavaliot,
        });

        Kayttaja.create(kayttaja, (err, data) => {
          if (err) {
            res.status(500).send({
              message: err.message || 'Error creating an user',
            });
          } else res.send(data);
        });
      }
    }
  );
};

// Hae kaikki käyttäjät
exports.findAll = (req, res) => {
  const enimi = req.query.title;

  Kayttaja.getAll(enimi, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error getting users',
      });
    } else res.send(data);
  });
};

// Hae käyttäjä käyttäjän id:n perusteella
exports.findOne = (req, res) => {
  Kayttaja.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Hae käyttäjä käyttäjän sähköpostin perusteella
exports.findByEmail = (req, res) => {
  Kayttaja.findByEmail(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Haetaan käyttäjä cognito käyttäjänimen perusteella
exports.findByCId = (req, res) => {
  Kayttaja.getByCId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Error in search',
        });
      }
    } else res.send(data);
  });
};

// Hae kaikki adminit
exports.findAllAdmins = (req, res) => {
  Kayttaja.getAllAdmins((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Error getting users',
      });
    } else res.send(data);
  });
};

// Päivitä käyttäjä käyttäjän id:n perusteella
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Body cannot be empty!',
    });
  }

  console.log(req.body);

  Kayttaja.updateById(req.params.id, new Kayttaja(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found user with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: 'Error updating user with id ' + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Poista käyttäjä käyttäjän id:n perusteella
exports.delete = (req, res) => {
  Kayttaja.remove(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error deleting user with id ' + req.params.id,
      });
    } else res.send(data);
  });
};
