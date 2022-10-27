import { React, useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-west-1_oa2A5XgI9',
  ClientId: '2cboqa7m7hiuihabauuoca2stt'
};

const UserLoginPage = () => {
  const UserPool = new CognitoUserPool(poolData);

  /* onSubmit -funktio estää selaimen oletusarvoisen toiminnan, eli sivuston
   uudelleen latautumisen. Funktiota kutsutaan form -elementistä. */

  const onSubmit = (event) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
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
      }
    });
  };

  /* importoitu funktio usestate otetaan käyttöön jokaisessa muuttujassa
joita käytetään tietojen syöttöön. Set -alkuista muuttujaa
käytetään tiedon syöttämiseen. Alkuarvot ovat oletuksena tyhjiä. */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <div>
        <h1>Kirjautuminen</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          {'Sähköposti: '}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
          />
          {'Salasana: '}
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </div>
        <div>
          <button type="submit">Kirjaudu</button>
        </div>
      </form>
    </div>
  );
};

export default UserLoginPage;
