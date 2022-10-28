/* eslint-disable camelcase */
import { React, useState } from 'react';
import axios from 'axios';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import Button from './Button';
import '../styles/UserRegisterLoginPage.css';

/* importoitu funktio usestate otetaan käyttöön jokaisessa muuttujassa
joita käytetään tietojen syöttöön. Set -alkuista muuttujaa
käytetään tiedon syöttämiseen. Alkuarvot ovat oletuksena tyhjiä. */

const UserRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [given_name, setGivenname] = useState('');
  const [family_name, setFamilyname] = useState('');

  /* Aws cognitosta löytyvät tiedot userPoolid ja ClientId */
  const poolData = {
    UserPoolId: 'eu-west-1_oa2A5XgI9',
    ClientId: '2cboqa7m7hiuihabauuoca2stt',
  };

  /* Käyttäjän tunnistaminen cognitosta */
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
  const attributelist = [];

  const UserPool = new CognitoUserPool(poolData);

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
    console.log(userObject);
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
              console.log(err);
            } else {
              axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/
              ${rdsData.data.id}`,
                { ...userObject, cognito_id: cognData.userSub }
              );
            }
          }
        );
      })
      .catch((err) => {
        console.error('Adding user to RDS failed: ', err);
      });
  };

  // Funktio joka lähettää lomakkeen käyttäjätiedot.
  // event.preventDefault() estää sivun uudelleenlatautumisen.
  const onSubmit = (event) => {
    event.preventDefault();

    if (password === passwordConfirm) {
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

      /* kutsuu registerUser-funktiota,
    joka lisää käyttäjän RDS-tietokantaan ja Cognitoon */
      registerUser();
    } else {
      console.log('Kirjoitetut salasanat eivät täsmää');
    }
  };

  return (
    <div className="accountFormContainer">
      <div>
        <h1 className="formHeader">Rekisteröidy </h1>
      </div>

      <div>
        <form onSubmit={onSubmit}>
          <div className="accountFormRow">
            <p>Etunimi</p>
            <input
              value={given_name}
              onChange={(event) => setGivenname(event.target.value)}
              type="text"
            />
          </div>

          <div className="accountFormRow">
            <p>Sukunimi</p>
            <input
              value={family_name}
              onChange={(event) => setFamilyname(event.target.value)}
              type="text"
            />
          </div>

          <div className="invisibleDivider" />

          <div className="accountFormRow">
            <p>Sähköposti</p>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="text"
            />
          </div>

          <div className="invisibleDivider" />

          <div className="accountFormRow">
            <p>Salasana</p>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="on"
            />
          </div>

          <div className="accountFormRow">
            <p>Salasana uudelleen</p>
            <input
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              type="password"
              autoComplete="on"
            />
          </div>

          <div className="accountFormSubmitButton">
            <Button color="primary" text="Rekisteröidy" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegisterPage;
