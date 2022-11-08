import { React, useState, useEffect } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import getUser from '../hooks/getUser';
import '../styles/UserPage.css';

const UserPage = () => {
  const [userData, setUserData] = useState();

  const navigate = useNavigate();

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
    const fetched = getUser();
    if (fetched) {
      console.log(fetched);
      setUserData(fetched);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="userPageContainer">
      <h1>Käyttäjä {userData?.idToken.payload.given_name}</h1>

      <div onClick={() => logOut()}>
        <Button color="primary" text="Kirjaudu ulos" type="button" />
      </div>
    </div>
  );
};

export default UserPage;
