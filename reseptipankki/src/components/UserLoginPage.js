import { React, useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import Button from './Button';
import '../styles/UserRegisterLoginPage.css';

/* Aws cognitosta löytyvät avaimet userPoolid ja ClientId liitetään
 muuttujaan poolData. */
const poolData = {
  UserPoolId: 'eu-west-1_oa2A5XgI9',
  ClientId: '2cboqa7m7hiuihabauuoca2stt',
};

const UserLoginPage = () => {
  const UserPool = new CognitoUserPool(poolData);

  // Funktio joka lähettää lomakkeen käyttäjätiedot.
  // event.preventDefault() estää sivun uudelleenlatautumisen.
  const onSubmit = (event) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    /* attribuutit joilla käyttäjä kirjautuu selaimesta. Syötteitä verrataan
    cognitosta löytyviin käyttäjätietoihin */
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log('onSuccess:', data);
      },

      onFailure: (err) => {
        console.error('onFailure:', err);
      },

      newPasswordRequired: (data) => {
        console.log('newPasswordRequired:', data);
      },
    });
  };

  /*
  importoitu funktio usestate otetaan käyttöön jokaisessa muuttujassa
  joita käytetään tietojen syöttöön. Set -alkuista funktiota
  käytetään tiedon syöttämiseen. Alkuarvot ovat oletuksena tyhjiä.
  */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="accountFormContainer">
      <div>
        <h1 className="formHeader">Kirjautuminen</h1>
      </div>

      <div>
        <form onSubmit={onSubmit}>
          <div className="accountFormRow">
            <p>Sähköposti</p>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="text"
            />
          </div>

          <div className="accountFormRow">
            <p>Salasana</p>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="on"
            />
          </div>

          <div className="accountFormSubmitButton">
            <Button color="primary" text="Kirjaudu sisään" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginPage;
