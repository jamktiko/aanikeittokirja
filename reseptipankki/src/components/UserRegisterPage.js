/* eslint-disable camelcase */
import { React, useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import '../styles/UserRegisterPage.css';

/* importoitu funktio usestate otetaan käyttöön jokaisessa muuttujassa
joita käytetään tietojen syöttöön. Set -alkuista muuttujaa
käytetään tiedon syöttämiseen. Alkuarvot ovat oletuksena tyhjiä. */

const UserRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [given_name, setGivenname] = useState('');
  const [family_name, setFamilyname] = useState('');

  /* Aws cognitosta löytyvät tiedot userPoolid ja ClientId */
  const poolData = {
    UserPoolId: 'eu-west-1_oa2A5XgI9',
    ClientId: '2cboqa7m7hiuihabauuoca2stt'
  };

  const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
  console.log(AmazonCognitoIdentity);

  const attributelist = [];

  const UserPool = new CognitoUserPool(poolData);

  /* funktio onSubmit estää selaimen oletusarvoisen toiminnan eli
   lomakkeen uudelleen latautumisen */

  const onSubmit = (event) => {
    event.preventDefault();

    const dataName = {
      Name: 'given_name',
      Value: given_name
    };

    const dataFamily = {
      Name: 'family_name',
      Value: family_name
    };

    const attributeGivenname = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataName
    );
    const attributeFamilyname = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataFamily
    );

    attributelist.push(attributeGivenname);
    attributelist.push(attributeFamilyname);

    UserPool.signUp(email, password, attributelist, null, (err, data) => {
      if (err) console.error(err);
      console.log(data);
    });
  };

  return (
    <div className="registerContainer">
      <div>
        <h1>Rekisteröidy </h1>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          {'Sähköposti: '}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
          />
        </div>
        <div>
          {'Salasana: '}
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </div>
        <div>
          {'Etunimi: '}
          <input
            value={given_name}
            onChange={(event) => setGivenname(event.target.value)}
            type="text"
          />
        </div>
        <div>
          {'Sukunimi: '}
          <input
            value={family_name}
            onChange={(event) => setFamilyname(event.target.value)}
            type="text"
          />
        </div>
        <button type="submit"> Rekisteröidy</button>
      </form>
    </div>
  );
};

export default UserRegisterPage;
