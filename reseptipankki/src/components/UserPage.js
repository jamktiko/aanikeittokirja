import { React, useEffect } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import '../styles/UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();

  // Ladataan käyttäjätiedot localStoragesta...
  const userData = localStorage.getItem('user');
  // ...ja muunnetaan ne takaisin objektiksi.
  const parsedData = JSON.parse(userData);

  // Funktio, joka kirjaa käyttäjän ulos.
  const logOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  /*
  Jos käyttäjän tiedot löytyivät localStoragesta, ne tulostetaan.
  Jos ei, siirrytään kirjautumissivulle.
  */
  useEffect(() => {
    if (parsedData) {
      console.log(parsedData);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="userPageContainer">
      <h1>Käyttäjä {parsedData?.idToken.payload.given_name}</h1>

      <div onClick={() => logOut()}>
        <Button color="primary" text="Kirjaudu ulos" type="button" />
      </div>
    </div>
  );
};

export default UserPage;
