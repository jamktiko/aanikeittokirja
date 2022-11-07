import { React, useEffect, useState } from 'react';
// import Button from './Button';
import '../styles/FrontPage.css';
import getUser from '../hooks/getUser';
import getRecentlyViewed from '../hooks/getRecentlyViewed';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    // Ladataan käyttäjän tiedot localStoragesta importatulla funktiolla:
    const user = getUser();
    const recentlyViewed = getRecentlyViewed();

    if (user) {
      console.log('käyttäjän tiedot: ', user);
      console.log('viimeksi katsotut: ', recentlyViewed);
      setUserData(user);
    }
  }, []);

  return (
    <div className="frontPageContainer">
      {userData ? (
        <h3>Hei {userData?.idToken.payload.given_name}!</h3>
      ) : (
        <p>Etusivu</p>
      )}

      {/*
        <div>
        <h2>Napit</h2>
        <Button color="primary" text="primary" />
        <br />
        <Button color="secondary" text="secondary" />
        <br />
        <Button color="warning" text="warning" />
      </div>
      */}
    </div>
  );
};

export default FrontPage;
