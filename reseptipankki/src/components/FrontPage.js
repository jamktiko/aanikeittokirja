import { React, useEffect, useState } from 'react';
import RecipeCardSmall from './RecipeCardSmall';
import LoadingError from './LoadingError';
import getUser from '../hooks/getUser';
import getRecentlyViewed from '../hooks/getRecentlyViewed';
import fetchRecipes from '../hooks/fetchRecipes';
import RecipeCardsList from './RecipeCardsList';
import axios from 'axios';

import '../styles/FrontPage.css';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  const [userData, setUserData] = useState();
  // Tila, johon käyttäjän kaikki true-arvoiset erikoisruokavaliot laitetaan
  const [diets, setDiets] = useState();
  const [recentlyViewedData, setRecentlyViewedData] = useState();
  const [recommendedRecipes, setRecommendedRecipes] = useState();

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

  /*
  Funktio, jossa suoritetaan reseptien suodattaminen käyttäjän asettamien
  erikoisruokavalioiden perusteella. Recipes-parametri on suodatettavat
  reseptit, userDiets on objekti, jossa on avain-arvo pareina kaikki
  käyttäjän erikoisruokavaliot.

  Funktio jättää jäljelle vain ne reseptit, joiden erikoisruokvalioista
  löytyvät kaikki käyttäjän asettamat erikoisruokavaliot. Jäljelle jäävillä
  resepteillä voi olla enemmän erikoisruokavalioita merkattuna kuin käyttäjällä.
  */
  const filterRecipesByDiets = (recipes, userDiets) => {
    /*
    Poistetaan käyttäjän erikoisruokavaliot, joiden arvo ei ole true
    eli joita käyttäjä ei ole merkannut.
    */
    Object.keys(userDiets).forEach((d) => {
      if (userDiets[d] === true) {
        userDiets[d] = 1;
      } else {
        delete userDiets[d];
      }
    });

    if (userDiets) {
      // Taulukko johon jäljelle jäävät reseptit laitetaan.
      const recommendedRecipes = [];

      // Käydään läpi jokainen resepti.
      recipes.forEach((recipe) => {
        // Otetaan reseptin erikoisruokavaliot vakioon.
        const parsedRecipeDiets = JSON.parse(recipe.erikoisruokavaliot);

        /*
        Poistetaan kaikki reseptin erikoisruokavaliot, joiden arvo ei ole true,
        tai joita käyttäjä ei ole merkannut omiin erikoisruokavalioihinsa.
        */
        Object.keys(parsedRecipeDiets).forEach((d) => {
          if (parsedRecipeDiets[d] !== 1 || userDiets[d] !== 1) {
            delete parsedRecipeDiets[d];
          }
        });

        /*
        Kaikkien edellisten toimenpiteiden jälkeen jäljellä olevat
        erikoisruokavalio-objektit laitetaan vertailuun merkkijonoiksi
        muutettuina. Jos ne ovat sama, resepti sopii käyttäjän
        erikoisruokavalioihin, ja lisätään taulukkoon.
        */
        if (JSON.stringify(userDiets) === JSON.stringify(parsedRecipeDiets)) {
          console.log('matching recipe: ', recipe.nimi);
          recommendedRecipes.push(recipe);
        }
      });

      setRecommendedRecipes(recommendedRecipes);
    } else {
      setRecommendedRecipes(recipes);
    }
  };

  useEffect(() => {
    // Ladataan käyttäjän tiedot localStoragesta importatulla funktiolla:
    const user = getUser();
    const recentlyViewed = getRecentlyViewed();

    // Laitetaan onnistuneesti viimeksi katsotut tilaan:
    if (recentlyViewed) setRecentlyViewedData(recentlyViewed);

    if (user && data) {
      // Käyttäjän tietojen hakeminen RDS:stä.
      axios
        .get(
          // eslint-disable-next-line max-len
          `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${user.idToken.payload.sub}"`
        )
        .then((res) => {
          // Laitetaan saatu data käyttäjän tilaan:
          setUserData(res.data[0]);

          filterRecipesByDiets(
            data,
            JSON.parse(res.data[0].erikoisruokavaliot)
          );
        })
        .catch((error) => {
          console.error('Fetching user data failed: ', error);
        });
    } else {
      setDiets([]);
      setRecommendedRecipes(data);
    }
  }, [data]);

  return (
    <div className="frontPageContainer">
      {userData ? (
        <div>
          <p>
            {timelyGreeting()}, {userData.enimi}!
          </p>
        </div>
      ) : (
        <p>Tervetuloa Britaan!</p>
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
      {loading || !diets ? (
        <p>Ladataan...</p>
      ) : (
        <div>
          {!error ? (
            <RecipeCardsList data={recommendedRecipes} />
          ) : (
            <LoadingError subtext="Reseptien lataaminen epäonnistui." />
          )}
        </div>
      )}
    </div>
  );
};

export default FrontPage;
