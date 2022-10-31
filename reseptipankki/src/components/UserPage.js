import { React, useEffect } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import '../styles/UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const parsedData = JSON.parse(userData);

  const logOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    /*
    Jos käyttäjän tiedot löytyivät localStoragesta, ne tulostetaan.
    Jos ei, siirrytään kirjautumissivulle.
    */
    if (parsedData) {
      console.log(parsedData);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="userPageContainer">
      <h1>Käyttäjä</h1>

      <div onClick={() => logOut()}>
        <Button color="primary" text="Kirjaudu ulos" type="button" />
      </div>
    </div>
  );
};

export default UserPage;
