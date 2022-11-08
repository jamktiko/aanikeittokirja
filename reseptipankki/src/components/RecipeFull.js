/* eslint-disable operator-linebreak */
import { React, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BiDotsVerticalRounded,
  BiPlusCircle,
  BiMinusCircle,
} from 'react-icons/bi';
import fetchRecipes from '../hooks/fetchRecipes';
import Loading from './Loading';
import LoadingError from './LoadingError';
import fetchIngredients from '../hooks/fetchIngredients';
import RecipeActionMenu from './RecipeActionMenu';
import DarkBG from './DarkBG';
import '../styles/RecipeFull.css';

// Reseptinäkymä, eli sivu jossa on yhden reseptin kaikki tiedot yms.
const RecipeFull = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);
  const [mealCount, setMealCount] = useState();
  const [ingredients, setIngredients] = useState([]);

  // Reseptin ID saadaan URL:n lopusta.
  const recipeId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  // Reseptien hakeminen hookilla. Vain ID:n mukainen resepti haetaan.
  const { data, loading, error } = fetchRecipes(recipeId);
  // ID:n reseptin ainesten hakeminen hookilla.
  const {
    ingredientsData,
    ingredientsLoading,
    ingredientsError,
  } = fetchIngredients(recipeId);

  const changeLocationInArray = (arr, from, to) => {
    const element = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, element);
  };

  /*
  Funktio, jossa katsottava resepti lisätään localStoragen taulukkoon,
  joka säilöö käyttäjän 10 viimeksi katsomaa reseptiä.
  */
  const addToRecentlyViewed = () => {
    // Ladataan localStoragessa oleva taulukko ja parsetaan se:
    const recentlyViewed = localStorage.getItem('recentlyViewed');
    let parsedData = JSON.parse(recentlyViewed);

    // Jos taulukkoa ei ole, luodaan tyhjä taulukko:
    if (parsedData == null) parsedData = [];

    // Katsotaan onko katsottu resepti jo valmiiksi taulukossa...
    const indexOfCurrent = parsedData.map((i) => i.r_id).indexOf(data.r_id);

    // ...jos on, laitetaan sen objekti taulukon alkioon 0.
    if (indexOfCurrent > -1) {
      changeLocationInArray(parsedData, indexOfCurrent, 0);
    } else {
      /*
       ...jos katsottua reseptiä ei ole taulukossa, lisätään se.
       Ensin poistetaan kuitenkin taulukon vanhin alkio jos taulukossa
       on jo kymmenen alkiota.
      */
      if (parsedData.length === 10) {
        parsedData.splice(9, 1);
      }

      const viewed = {
        r_id: data?.r_id,
        name: data?.nimi,
        img: data?.kuva,
      };

      // Lisätään katsotun reseptin objekti taulukkoon.
      if (viewed.r_id && viewed.name) {
        parsedData.unshift(viewed);
      }
    }

    /*
    Kun viimeksi katsottujen taulukkoon on tehty oikeat muokkaukset,
    se laitetaan takaisin localStorageen.
    */
    localStorage.setItem('recentlyViewed', JSON.stringify(parsedData));
  };

  // Lisätään mealCount-tila kun reseptin data on latautunut.
  useEffect(() => {
    if (data !== null) {
      setMealCount(data?.annosten_maara);
      addToRecentlyViewed();
    }
  }, [data]);

  // Lisätään ainekset omaan tilaansa kun ne on latautuneet.
  useEffect(() => {
    setIngredients(ingredientsData);
  }, [ingredientsData]);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading || ingredientsLoading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error || ingredientsError) {
    return <LoadingError subtext="Ehkä hakemaasi reseptiä ei enää ole?" />;
  }

  // Funktio joka avaa ja sulkee res.toim.valikon
  const toggleMenu = () => {
    toggleMenuOpen(!menuOpen);
  };

  const increaseMeals = () => {
    const copy = [...ingredients];

    copy.forEach((i) => {
      i.maara = (i.maara * (mealCount + 1)) / mealCount;
    });

    setMealCount(mealCount + 1);
    setIngredients(copy);
  };

  const decreaseMeals = () => {
    if (mealCount > 1) {
      const copy = [...ingredients];

      copy.forEach((i) => {
        i.maara = (i.maara * (mealCount - 1)) / mealCount;
      });

      setMealCount(mealCount - 1);
      setIngredients(copy);
    }
  };

  return (
    <div className="recipeFullContainer">
      <div className="recipeContainer">
        <div className="recipeImageContainer">
          <img
            className="recipeImage"
            src={data?.kuva ? data.kuva : require('../assets/placeholder.png')}
          />
        </div>

        <div className="recipeTitleContainer">
          <h2>
            {data?.nimi}
            <span className="greyText">{` (${data?.valmistusaika})`}</span>
          </h2>

          <button
            className="recipeActionMenuIcon buttonInvisible"
            onClick={() => toggleMenu()}
          >
            <BiDotsVerticalRounded />
          </button>
        </div>

        <div className="ingredientsContainer">
          <div className="ingredientsTitleContainer">
            <h3>
              Ainekset{' '}
              <span className="greyText">{`(${mealCount} annos${
                mealCount > 1 ? 'ta' : ''
              })`}</span>
            </h3>
            <div className="mealCountButtons">
              <div onClick={() => decreaseMeals()}>
                <BiMinusCircle />
              </div>
              <div onClick={() => increaseMeals()}>
                <BiPlusCircle />
              </div>
            </div>
          </div>

          <table className="ingredientsTable">
            <tbody>
              {ingredients?.map((item, index) => {
                return (
                  <tr key={index} className="ingredientsTableRow">
                    <td className="ingredientsTableFirstColumn">
                      {item.maara > 0 ? (
                        <p>
                          {Math.round(item.maara * 100) / 100} {item.yksikko}
                        </p>
                      ) : (
                        <div />
                      )}
                    </td>
                    <td className="ingredientsTableSecondColumn">
                      <p>{item.aines}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="directionsContainer">
          <h3>Ohjeet</h3>
          <p>{data?.ohjeet}</p>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <div>
            <DarkBG toggleMenu={toggleMenu} z={3} />
            <RecipeActionMenu
              recipeData={data}
              ingredientsData={ingredientsData}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default RecipeFull;
