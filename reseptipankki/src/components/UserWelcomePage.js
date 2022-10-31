import React from 'react';
import Button from './Button';
import '../styles/UserWelcomePage.css';
import { useNavigate } from 'react-router-dom';

/*
WelcomingPage komponentti, joka laitetaan näkyviin kun käyttäjä
on onnistuneesti luonut uuden käyttäjätunnuksen.
*/
const UserWelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcomePageContainer">
      <div className="welcomePageTextContainer">
        <h2>Käyttäjätunnus luotu onnistuneesti</h2>

        <p>Tervetuloa käyttämään reseptisovellus Britaa!</p>

        <p>
          Viimeistelläksesi käyttäjätunnuksesi luomisen käy avaamassa
          syöttämääsi sähköpostiosoitteeseen lähetetty linkki.
        </p>

        <p>
          Kun olet tehnyt sen, olet valmis käyttämään kaikkia sovelluksen
          ominaisuuksia.
        </p>

        <div onClick={() => navigate('/')}>
          <Button text="Etusivulle" color="primary" type="button" />
        </div>
      </div>
    </div>
  );
};

export default UserWelcomePage;
