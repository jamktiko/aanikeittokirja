/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
import { React, useState } from 'react';
import axios from 'axios';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import UserWelcomePage from './UserWelcomePage';
import '../styles/UserRegisterLoginPage.css';

/*
UserRegisterPage on tämän tiedoston varsinainen pääkomponentti.
Se sisältää lomakkeen, jolla käyttäjä voi rekisteröityä.
*/
const UserRegisterPage = () => {
  // Lomakkeen tekstikenttien arvojen tilat:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [given_name, setGivenname] = useState('');
  const [family_name, setFamilyname] = useState('');

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [errorMessage, setErrorMessage] = useState('');
  // Tieto siitä mikä lomakkeen tila ei läpäise validointia:
  const [errorHighlight, setErrorHighlight] = useState('');

  // Tieto siitä, onko käyttäjätunnus luotu onnistuneesti.
  // Kun true, laitetaan UserWelcomePage-komponentti näkyviin.
  const [success, setSuccess] = useState(false);

  /* Aws cognitosta löytyvät tiedot userPoolid ja ClientId */
  const poolData = {
    UserPoolId: 'eu-west-1_oa2A5XgI9',
    ClientId: '2cboqa7m7hiuihabauuoca2stt',
  };

  /* Käyttäjän tunnistaminen cognitosta */
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
  const attributelist = [];

  const UserPool = new CognitoUserPool(poolData);

  const logRegisteredUserIn = () => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        // Laitetaan kirjautumistiedot localStorageen:
        localStorage.setItem('user', JSON.stringify(data));
      },

      onFailure: (err) => {
        console.error(err);
      },

      newPasswordRequired: (data) => {
        console.log('newPasswordRequired:', data);
      },
    });
  };

  /* rekisteröi käyttäjän ensin RDS:n,
  ja sen onnistuttua rekisteröi käyttäjän Cognitoon */
  const registerUser = () => {
    // luodaan käyttäjäobjekti, joka liitetään post-pyyntöön.
    const userObject = {
      enimi: given_name, // saadaan lomakkeesta
      snimi: family_name, // saadaan lomakkeesta
      email: email, // saadaan lomakkeesta
      cognito_id: null, // saadaan Cognitosta, updatetaan myöhemmin
      isAdmin: 0, // oletuksena ei ole admin
      erikoisruokavaliot: null, // käyttäjä voi lisätä itse myöhemmin
    };
    // RDS-tietokantaan lisäys
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/`, userObject)
      .then((rdsData) => {
        // Cognitoon lisäys
        UserPool.signUp(
          email,
          password,
          attributelist,
          null,
          (err, cognData) => {
            if (err) {
              /*
              Jos käyttäjän lisääminen Cognitoon epäonnistuu, RDS:ään luotu
              käyttäjä poistetaan:
              */
              axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/
              ${rdsData.data.id}`
              );
            } else {
              /*
              Jos käyttäjän lisääminen Cognitoon onnistuu, päivitetään RDS:ään
              luotu käyttäjä, eli lisätään sille cogniton ID:
              */
              axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/
              ${rdsData.data.id}`,
                { ...userObject, cognito_id: cognData.userSub }
              );

              // Kirjataan uusi käyttäjä sisään:
              logRegisteredUserIn();

              /*
              Muutetaan onnistumisen tila trueksi, jolloin käyttäjän
              tervetulleeksi toivottava komponentti tulee näkyviin.
              */
              setSuccess(true);
            }
          }
        );
      })
      .catch((err) => {
        console.error('Adding user to RDS failed: ', err);
      });
  };

  const validationError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  };

  // Funktio, joka tarkistaa, onko lomakkeen tiedot oikein.
  // Jos on, palauttaa true, muuten false.
  const validate = () => {
    if (!given_name || given_name.length < 2) {
      setErrorHighlight('given_name');
      validationError('Lisää kelvollinen etunimi!');
      return false;
    }

    // if (!family_name || family_name.length < 2) {
    //   setErrorHighlight('family_name');
    //   validationError('Lisää kelvollinen sukunimi!');
    //   return false;
    // }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setErrorHighlight('email');
      validationError('Lisää kelvollinen sähköpostiosoite!');
      return false;
    }

    if (!password || password.length < 8) {
      setErrorHighlight('password');
      validationError('Salasanassa on oltava vähintään kahdeksan merkkiä!');
      return false;
    }

    if (password !== passwordConfirm) {
      setErrorHighlight('passwordConfirm');
      validationError('Salasanat eivät täsmää!');
      return false;
    }

    return true;
  };

  // Funktio joka lähettää lomakkeen käyttäjätiedot.
  // event.preventDefault() estää sivun uudelleenlatautumisen.
  const onSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      const dataName = {
        Name: 'given_name',
        Value: given_name,
      };

      const dataFamily = {
        Name: 'family_name',
        Value: family_name,
      };

      const attGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataName
      );
      const attFamilyName = new AmazonCognitoIdentity.CognitoUserAttribute(
        dataFamily
      );

      attributelist.push(attGivenName);
      attributelist.push(attFamilyName);

      /*
      Kutsuu registerUser-funktiota, joka lisää käyttäjän
      RDS-tietokantaan ja Cognitoon
      */
      registerUser();
    }
  };

  return (
    <div className="accountFormContainer">
      <div>
        <h1 className="formHeader">Rekisteröidy</h1>
        <p className="formInfoText">Pakolliset kentät merkitty *</p>
      </div>

      <div>
        <form onSubmit={onSubmit}>
          <div className="accountFormRow">
            <p
              className={
                errorHighlight === 'given_name' ? 'inputLabelError' : null
              }
            >
              Etunimi <span className="asterix">*</span>
            </p>

            <input
              value={given_name}
              onChange={(event) => setGivenname(event.target.value)}
              type="text"
              className={errorHighlight === 'given_name' ? 'inputError' : null}
              onClick={() => {
                if (errorHighlight === 'given_name') setErrorHighlight('');
              }}
            />
          </div>

          <div className="accountFormRow">
            <p
              className={
                errorHighlight === 'family_name' ? 'inputLabelError' : null
              }
            >
              Sukunimi
            </p>
            <input
              value={family_name}
              onChange={(event) => setFamilyname(event.target.value)}
              type="text"
              className={errorHighlight === 'family_name' ? 'inputError' : null}
              onClick={() => {
                if (errorHighlight === 'family_name') setErrorHighlight('');
              }}
            />
          </div>

          <div className="invisibleDivider" />

          <div className="accountFormRow">
            <p
              className={errorHighlight === 'email' ? 'inputLabelError' : null}
            >
              Sähköposti <span className="asterix">*</span>
            </p>

            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="text"
              className={errorHighlight === 'email' ? 'inputError' : null}
              onClick={() => {
                if (errorHighlight === 'email') setErrorHighlight('');
              }}
            />
          </div>

          <div className="invisibleDivider" />

          <div className="accountFormRow">
            <p
              className={
                errorHighlight === 'password' ||
                errorHighlight === 'passwordConfirm'
                  ? 'inputLabelError'
                  : null
              }
            >
              Salasana (vähintään 8 merkkiä) <span className="asterix">*</span>
            </p>

            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="on"
              className={
                errorHighlight === 'password' ||
                errorHighlight === 'passwordConfirm'
                  ? 'inputError'
                  : null
              }
              onClick={() => {
                if (
                  errorHighlight === 'password' ||
                  errorHighlight === 'passwordConfirm'
                ) {
                  setErrorHighlight('');
                }
              }}
            />
          </div>

          <div className="accountFormRow">
            <p
              className={
                errorHighlight === 'passwordConfirm' ? 'inputLabelError' : null
              }
            >
              Salasana uudelleen <span className="asterix">*</span>
            </p>

            <input
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              type="password"
              autoComplete="on"
              className={
                errorHighlight === 'passwordConfirm' ? 'inputError' : null
              }
              onClick={() => {
                if (errorHighlight === 'passwordConfirm') setErrorHighlight('');
              }}
            />
          </div>

          <div className="accountFormSubmitButton">
            <Button color="primary" text="Rekisteröidy" type="submit" />
          </div>

          <AnimatePresence>
            {errorMessage ? (
              <motion.div
                key="validationErrorMessage"
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <p className="errorMessage">{errorMessage}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </form>
      </div>

      {success ? <UserWelcomePage /> : null}
    </div>
  );
};

export default UserRegisterPage;
