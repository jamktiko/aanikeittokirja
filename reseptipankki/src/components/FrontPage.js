import { React, useEffect, useState } from 'react';
import RecipeCardSmall from './RecipeCardSmall';
import getUser from '../hooks/getUser';
import getRecentlyViewed from '../hooks/getRecentlyViewed';
import fetchRecipes from '../hooks/fetchRecipes';
import RecipeCardsList from './RecipeCardsList';

import '../styles/FrontPage.css';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  const [userData, setUserData] = useState();
  const [recentlyViewedData, setRecentlyViewedData] = useState();

  const hour = new Date().getHours();
  // Funktio joka palauttaa kellonaikaan sopivan tervehdyksen.
  const timelyGreeting = () => {
    if (hour < 5) return 'Hyvää yötä';
    if (hour < 10) return 'Hyvää huomenta';
    if (hour < 12) return 'Hyvää aamupäivää';
    if (hour < 16) return 'Hyvää päivää';
    if (hour < 19) return 'Hyvää iltapäivää';
    if (hour < 24) return 'Hyvää iltaa';
  };

  // Ladataan suositellut reseptit hookin avulla.
  const { data, loading, error } = fetchRecipes('recommended');

  useEffect(() => {
    // Ladataan käyttäjän tiedot localStoragesta importatulla funktiolla:
    const user = getUser();
    const recentlyViewed = getRecentlyViewed();

    // Laitetaan onnistuneesti haetut datat tiloihinsa:
    if (user) setUserData(user.idToken.payload);
    if (recentlyViewed) setRecentlyViewedData(recentlyViewed);
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

      {/*
      Jos suositeltujen reseptien lataus on valmis (loading === false),
      ne näytetään etusivulla RecipeCardsList-komponentin kautta
      */}
      {loading ? (
        <p>Ladataan</p>
      ) : (
        <div>
          {!error ? (
            <RecipeCardsList data={data} />
          ) : (
            <p>Reseptien lataaminen epäonnistui</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FrontPage;
