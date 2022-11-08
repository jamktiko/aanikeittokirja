import { React, useEffect, useState } from 'react';
import RecipeCardSmall from './RecipeCardSmall';
import getUser from '../hooks/getUser';
import getRecentlyViewed from '../hooks/getRecentlyViewed';

import '../styles/FrontPage.css';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  const [userData, setUserData] = useState();
  const [recentlyViewedData, setRecentlyViewedData] = useState();

  const date = new Date();
  const hour = date.getHours();

  const timelyGreeting = () => {
    if (hour < 5) return 'Hyvää yötä';
    if (hour < 10) return 'Hyvää huomenta';
    if (hour < 12) return 'Hyvää aamupäivää';
    if (hour < 16) return 'Hyvää päivää';
    if (hour < 19) return 'Hyvää iltapäivää';
    if (hour < 24) return 'Hyvää iltaa';
  };

  useEffect(() => {
    // Ladataan käyttäjän tiedot localStoragesta importatulla funktiolla:
    const user = getUser();
    const recentlyViewed = getRecentlyViewed();

    if (user) {
      console.log('käyttäjän tiedot: ', user);
      console.log('viimeksi katsotut: ', recentlyViewed);
      setUserData(user.idToken.payload);
      setRecentlyViewedData(recentlyViewed);
    }
  }, []);

  return (
    <div className="frontPageContainer">
      {userData ? (
        <div>
          <p>
            {timelyGreeting()}, {userData.given_name}!
          </p>
        </div>
      ) : (
        <p>Hei!</p>
      )}

      {recentlyViewedData ? (
        <div>
          <h3>Viimeksi katsomasi</h3>

          <div className="recentlyViewedContainer">
            {recentlyViewedData.map((item, index) => {
              return (
                <RecipeCardSmall
                  key={index}
                  id={item.r_id}
                  name={item.name}
                  img={item.img}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <h3>Suosittelemme</h3>
    </div>
  );
};

export default FrontPage;
