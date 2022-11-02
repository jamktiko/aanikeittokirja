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

  // Lisätään mealCount-tila kun reseptin data on latautunut.
  useEffect(() => {
    setMealCount(data?.annosten_maara);
  }, [data]);

  // Lisätään ainekset omaan tilaansa kun ne on latautuneet.
  useEffect(() => {
    setIngredients(ingredientsData);
  }, [ingredientsData]);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading || ingredientsLoading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error || ingredientsError) return <LoadingError />;

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
