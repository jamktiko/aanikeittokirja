/* eslint-disable operator-linebreak */
import { React, useState } from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import '../styles/RecipeFull.css';
import { AnimatePresence } from 'framer-motion';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import fetchRecipes from '../hooks/fetchRecipes';
import fetchIngredients from '../hooks/fetchIngredients';
import RecipeActionMenu from './RecipeActionMenu';
import DarkBG from './DarkBG';

// Reseptinäkymä, eli sivu jossa on yhden reseptin kaikki tiedot yms.
const RecipeFull = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  // Reseptin ID saadaan URL:n lopusta.
  const recipeId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  // Reseptien hakeminen hookilla. Vain ID:n mukainen resepti haetaan.
  const { data, loading, error } = fetchRecipes(recipeId);
  const {
    ingredientsData,
    ingredientsLoading,
    ingredientsError,
  } = fetchIngredients(recipeId);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading || ingredientsLoading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error || ingredientsError) return <LoadingError />;

  console.log('Ainekset: ', ingredientsData);

  const toggleMenu = () => {
    toggleMenuOpen(!menuOpen);
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
          <h3>
            Ainekset{' '}
            <span className="greyText">{`(${data?.annosten_maara} annos${
              data?.annosten_maara > 1 ? 'ta' : ''
            })`}</span>
          </h3>

          <table className="ingredientsTable">
            <tbody>
              {ingredientsData?.map((item, index) => {
                return (
                  <tr key={index} className="ingredientsTableRow">
                    <td className="ingredientsTableFirstColumn">
                      {item.maara > 0 ? (
                        <p>
                          {item.maara} {item.yksikko}
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
            <RecipeActionMenu recipeId={recipeId} />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default RecipeFull;
