import React, { useState } from 'react';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import Button from './Button';
import '../styles/UserForgotPasswordPage.css';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/*
Aws cognitosta löytyvät avaimet userPoolid ja ClientId liitetään
muuttujaan poolData.
*/
const poolData = {
  UserPoolId: 'eu-west-1_oa2A5XgI9',
  ClientId: '2cboqa7m7hiuihabauuoca2stt',
};

const UserForgotPassword = () => {
  /*
  stage-muuttuja pitää kirjaa siitä, missä vaiheessa prosessia mennään:
  1 = käyttäjä syöttää sähköpostiosoitteen,
  2 = käyttäjä syöttää vahvistuskoodin ja uuden salasanan
  3 = käyttäjä on vaihtanut salasanan onnistuneesti
  */
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const UserPool = new CognitoUserPool(poolData);

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [errorMessage, setErrorMessage] = useState('');

  const getUser = () => {
    return new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
  };

  // Lähettää vahvistuskoodin sähköpostiin ja siirtyy stage 2:n
  const sendCode = (event) => {
    event.preventDefault();

    getUser().forgotPassword({
      onSuccess: (data) => {
        console.log('onSuccess:', data);
      },
      onFailure: (err) => {
        console.error('onFailure:', err);
        // Jos sähköpostikenttä on tyhjä, näytetään virheilmoitus
        setErrorMessage('Syötä sähköpostiosoite!');

        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      },
      inputVerificationCode: (data) => {
        console.log('Input code:', data);
        setStage(2);
      },
    });
  };

  // Asettaa uuden salasanan käyttäjälle
  const resetPassword = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.error('Passwords are not the same');
      // Jos salasanat eivät täsmää, näytetään virheilmoitus
      setErrorMessage('Salasanat eivät täsmää!');

      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return;
    }

    // Lähettää vahvistukoodin ja uuden salasanan Cognitoon, siirtyy stage 3:n
    getUser().confirmPassword(code, password, {
      onSuccess: (data) => {
        console.log('onSuccess:', data);
        setStage(3);
      },
      onFailure: (err) => {
        console.error('onFailure:', err);
        // Jos vahvistukoodi on väärä, näytetään virheilmoitus
        setErrorMessage('Vahvistuskoodi on väärä!');

        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      },
    });
  };

  // Aloittaa prosessin alusta, jos käyttäjä ei saa vahvistuskoodia
  const startOver = () => {
    setStage(1);
  };

  return (
    <div className="accountFormContainer">
      <div>
        <h2 className="formHeader">Unohtunut salasana</h2>
      </div>

      {stage === 1 && (
        <form onSubmit={sendCode}>
          <div className="accountFormRow">
            <p>Sähköposti</p>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="accountFormSubmitButton">
            <Button
              color="primary"
              text="Lähetä vahvistuskoodi"
              type="submit"
            />
          </div>
        </form>
      )}

      {stage === 2 && (
        <form onSubmit={resetPassword}>
          <div className="accountFormRow">
            <p>Vahvistuskoodi</p>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
          <div className="accountFormRow">
            <p>Uusi salasana</p>
            <input
              value={password}
              type="password"
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="accountFormRow">
            <p>Salasana uudelleen</p>
            <input
              value={confirmPassword}
              type="password"
              autoComplete="new-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <div className="accountFormSubmitButton">
            <Button color="primary" text="Vaihda salasana" type="submit" />
          </div>
          <div>
            <p>Eikö vahvistuskoodia tullut?</p>
            <div>
              <button className="startOverButton" onClick={startOver}>
                Kokeile uudestaan
              </button>
            </div>
          </div>
        </form>
      )}

      {stage === 3 && (
        <div>
          <p>Salasana vaihdettu onnistuneesti!</p>
          <div className="loginPageLinkContainer">
            <Link className="loginPageLink" to="/kirjaudu">
              Kirjaudu sisään
            </Link>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default UserForgotPassword;
