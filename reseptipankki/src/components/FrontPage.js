import { React, useEffect, useState } from 'react';
import RecipeCardSmall from './RecipeCardSmall';
import LoadingError from './LoadingError';
import getUser from '../hooks/getUser';
import getRecentlyViewed from '../hooks/getRecentlyViewed';
import fetchRecipes from '../hooks/fetchRecipes';
import RecipeCardsList from './RecipeCardsList';
import axios from 'axios';
import '../styles/FrontPage.css';
import Loading from './Loading';
import { useNavigate } from 'react-router';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  // Tila johon käyttäjän tiedot (RDS) laitetaan
  const [userData, setUserData] = useState();
  // Tila, johon käyttäjän kaikki true-arvoiset erikoisruokavaliot laitetaan
  const [diets, setDiets] = useState();
  const [recentlyViewedData, setRecentlyViewedData] = useState();
  const [recommendedRecipes, setRecommendedRecipes] = useState();

  const navigate = useNavigate();

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
  löytyvät vähintään kaikki käyttäjän asettamat erikoisruokavaliot.
  */
  const filterRecipesByDiets = (recipes, userDiets) => {
    /*
    Funktio suoritetaan vain jos käyttäjä on lisännyt itselleen vähintään
    yhden erikoisruokavalion.
    */
    if (Object.keys(userDiets).length > 0) {
      // Taulukko johon jäljelle jäävät reseptit laitetaan.
      const filteredRecipes = [];

      // Käydään läpi jokainen resepti.
      recipes.forEach((recipe) => {
        // Otetaan reseptin erikoisruokavaliot vakioon.
        const parsedRecipeDiets = JSON.parse(recipe.erikoisruokavaliot);

        // Käydään läpi jokainen reseptin erikoisruokavalioista.
        for (const d of Object.keys(parsedRecipeDiets)) {
          /*
          Jos mikään seuraavista ehdoista ei täyty, palautetaan tyhjää, jolloin
          recipes.forEach-kierros lakkaa ennen kuin resepti lisätään taulukkoon.
          */
          if (
            !(
              (userDiets[d] && parsedRecipeDiets[d]) ||
              (userDiets[d] !== true && parsedRecipeDiets[d]) ||
              (userDiets[d] !== true && parsedRecipeDiets[d] !== true)
            )
          ) {
            return;
          }
        }
        filteredRecipes.push(recipe);
      });

      // Laitetaan näkyviin suodatuksen läpi käyneet reseptit.
      setRecommendedRecipes(filteredRecipes);
    } else {
      // Jos käyttäjällä ei ole erikoisruokavalioita, kaikki reseptit näytetään.
      setRecommendedRecipes(recipes);
    }
  };

  useEffect(() => {
    // Ladataan käyttäjän tiedot localStoragesta importatulla funktiolla:
    const user = getUser();
    const recentlyViewed = getRecentlyViewed();

    // Laitetaan onnistuneesti viimeksi katsotut tilaan:
    if (recentlyViewed) setRecentlyViewedData(recentlyViewed);

    if (data) {
      try {
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
      } catch {
        setRecommendedRecipes(data);
        setUserData('not-found');
      }
    } else {
      setDiets([]);
      setRecommendedRecipes(data);
    }
  }, [data]);

  return (
    <div className="frontPageContainer">
      {userData && userData !== 'not-found' ? (
        <div>
          <p>
            {timelyGreeting()}, {userData.enimi}!
          </p>
        </div>
      ) : (
        <div>
          {userData === 'not-found' && (
            <div className="welcomeMessage">
              <h3>Tervetuloa Britaan!</h3>
              <p>
                Saadaksesi kaikki sovelluksen ominaisuudet käyttöösi,{' '}
                <span onClick={() => navigate('/kirjaudu')}>
                  kirjaudu sisään
                </span>{' '}
                tai{' '}
                <span onClick={() => navigate('/rekisteroidy')}>
                  rekisteröidy
                </span>
                !
              </p>
            </div>
          )}
        </div>
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
        <Loading />
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
