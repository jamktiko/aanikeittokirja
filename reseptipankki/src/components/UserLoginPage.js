import { React, useState } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import '../styles/UserRegisterLoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

/*
Aws cognitosta löytyvät avaimet userPoolid ja ClientId liitetään
muuttujaan poolData.
*/
const poolData = {
  UserPoolId: 'eu-west-1_oa2A5XgI9',
  ClientId: '2cboqa7m7hiuihabauuoca2stt',
};

const UserLoginPage = () => {
  const navigate = useNavigate();

  const UserPool = new CognitoUserPool(poolData);

  /*
  importoitu funktio usestate otetaan käyttöön jokaisessa muuttujassa
  joita käytetään tietojen syöttöön. Set -alkuista funktiota
  käytetään tiedon syöttämiseen. Alkuarvot ovat oletuksena tyhjiä.
  */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [errorMessage, setErrorMessage] = useState('');

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

    console.log('auth: ', authDetails);

    user.authenticateUser(authDetails, {
      onSuccess: (cognData) => {
        console.log('data: ', cognData);

        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/email/"${email}"`
          )
          .then((rdsData) => {
            console.log('rdsData: ', rdsData);
            if (rdsData.data.uusi === 1) {
              console.log('AAAA');
              /*
              Jos käyttäjän lisääminen Cognitoon onnistuu, päivitetään RDS:ään
              luotu käyttäjä, eli lisätään sille cogniton ID:
              */
              axios.put(
                // eslint-disable-next-line max-len
                `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/${rdsData.data.k_id}`,
                {
                  ...rdsData.data,
                  cognito_id: cognData.accessToken.payload.sub,
                  uusi: 0,
                },
                {
                  headers: {
                    Authorization: `Bearer ${cognData.accessToken.jwtToken}`,
                  },
                }
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });

        // Laitetaan kirjautumistiedot localStorageen:
        localStorage.setItem('user', JSON.stringify(cognData));

        // Onnistuneesti kirjautunut käyttäjä ohjataan etusivulle:
        navigate('/');
      },

      onFailure: (err) => {
        console.log('err: ', err);
        // Jos kirjautuminen epäonnistuu, näytetään tämä virheilmoitus:
        setErrorMessage('Sähköpostiosoite tai salasana on virheellinen!');

        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      },

      newPasswordRequired: (data) => {
        console.log('newPasswordRequired:', data);
      },
    });
  };

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

          <div className="loginPageLinkContainer">
            <Link className="loginPageLink" to="/rekisteroidy">
              Tee uusi käyttäjätunnus
            </Link>
          </div>

          <div className="loginPageLinkContainer">
            <Link className="loginPageLink" to="/uusi_salasana">
              Unohditko salasanasi?
            </Link>
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
    </div>
  );
};

export default UserLoginPage;
