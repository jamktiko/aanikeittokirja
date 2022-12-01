/* eslint-disable operator-linebreak */
import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipeCard.css';
import useLongPress from '../hooks/useLongPress';
import { AnimatePresence } from 'framer-motion';
import DarkBG from './DarkBG';
import ActionMenu from './ActionMenu';
import RecipeActionMenuContent from './RecipeActionMenuContent';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';

/*
RecipeCard on komponentti reseptien pienemmille näkymille, eli niille joita
on esimerkiksi hakusivulla ja omissa resepteissä. RecipeCard toimii myös
linkkinä kyseisen reseptin täydelle reseptisivulle.
*/
const RecipeCard = ({
  data,
  deletingMode,
  toggleDeletingMode,
  editRecipesToDelete,
  recipesToDelete,
  recipes,
  setRecipes,
  mealPlannerDate,
  mealPlannerKId,
  plannerId,
}) => {
  const recipe = JSON.parse(data);
  // Pohjassa painamisen mahdollistavan hookin käyttöönotto:
  const onLongPress = useLongPress();
  // Navigointifunktion käyttöönotto:
  const navigate = useNavigate();

  const [actionMenuOpen, toggleActionMenuOpen] = useState(false);

  /*
  Tieto siitä, onko kortin resepti listaltapoistamistaulukolla.
  Jos on, selected on true, ja sitä käytetään lisäämään kortille
  punainen reuna.
  */
  const selected = recipesToDelete?.includes(
    plannerId ? plannerId : recipe.r_id
  );

  /*
  Funktio, joka ajetaan kun reseptikorttia painetaan pohjassa.
  Tarkistaa ensin, ollaanko listanäkymässä (eli tuleeko
  deletingMode parametrina), sitten tarkistetaan, onko deletingMode
  jo päällä. Jos ei ole, laitetaan se päälle ja lisätään painettu
  resepti poistettaviin.
  */
  const longPressCard = () => {
    if (deletingMode !== undefined) {
      // Poistomoodi ei ole päällä.
      if (deletingMode === false) {
        // Laitetaan poistomoodi päälle:
        toggleDeletingMode(true);
        editRecipesToDelete(plannerId ? plannerId : recipe.r_id);
      }
    } else {
      if (!mealPlannerDate) {
        /*
        Jos deletingModea ei ole importattu, reseptikortti ei ole
        listanäkymässä, joten käytetään longPressiä avaamaan
        reseptitoiminnallisuusvalikko.
        */
        toggleActionMenuOpen(true);
      }
    }
  };

  // Kortin klikkauksen käsittelevä funktio.
  const cardClicked = async () => {
    if (deletingMode) {
      /*
      Jos on käynnissä deleing-moodi, eli listanäkymässä oleva
      tila, jossa voidaan poistaa reseptejä listalta, kutsutaan
      parametrina saatua funktiota jossa käsitellään taulukkoa
      joka sisältää poistettavat listat.
      */
      editRecipesToDelete(plannerId ? plannerId : recipe.r_id);
    } else {
      /*
      Jos mealPlannerDate on olemassa, ollaan lisäämässä reseptiä
      ateriasuunnittelijaan. Tehdään axios-pyyntö, joka tekee sen.
      */
      if (mealPlannerDate) {
        const calendarObject = {
          pvm: mealPlannerDate,
          Kayttaja_k_id: mealPlannerKId,
          Resepti_r_id: recipe.r_id,
        };

        // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
        // Funktio myös palauttaa käyttäjän tokenit.
        const parsedData = await getUserRefresh();
        const token = parsedData.accessToken.jwtToken;

        // Pyyntö joka lisää reseptin ateriasuunnittelijatauluun.
        axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/api/kalenteri_item`,
            calendarObject,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                cognitoId: parsedData.idToken.payload.sub,
              },
            }
          )
          .then((res) => {
            navigate('/ateriat', { state: { startDate: mealPlannerDate } });
          })
          .catch((error) => {
            console.error('Adding to Meal Planner failed: ', error);
          });
      } else {
        /*
        Jos poistomoodi ei ole päällä, listakorttia käytetään
        reseptisivulle navigointiin.
        */
        navigate(`/reseptit/${recipe.r_id}`);
      }
    }
  };

  return (
    <div>
      <div
        onClick={cardClicked}
        {...onLongPress(() => longPressCard())}
        className={`backgroundSecondaryColor cardContainer ${
          selected ? 'cardSelected' : ''
        }`}
      >
        <div className="cardTexts">
          <h3>{recipe.nimi}</h3>
          <p>
            {recipe.valmistusaika}
            {recipe.keskiarvo
              ? ` | ${(Math.round(recipe.keskiarvo * 10) / 10).toFixed(1)} ☆`
              : ''}
          </p>
        </div>
        <div className="cardImageDiv">
          <img
            src={
              recipe.kuva ? recipe.kuva : require('../assets/placeholder.png')
            }
          />
        </div>
      </div>

      {/*
      Reseptitoiminnallisuusvalikko avautuu, kun reseptikorttia painaa
      pohjassa hetken, eli kun actionMenuOpen on true.
      */}
      <AnimatePresence>
        {actionMenuOpen ? (
          <div>
            <DarkBG toggleMenu={toggleActionMenuOpen} z={90} />
            <ActionMenu
              menuContent={
                /* recipes ja setRecipes laitetaan valikon sisältöön propseina,
                koska niiden avulla valikon kautta poistettu resepti saadaan
                poistettua myös näkyvistä listanäkymissä. */
                <RecipeActionMenuContent
                  recipeData={recipe}
                  toggleMenuOpen={toggleActionMenuOpen}
                  openedFromCard={true}
                  recipes={recipes}
                  setRecipes={setRecipes}
                />
              }
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

RecipeCard.propTypes = {
  data: PropTypes.any,
  deletingMode: PropTypes.bool,
  toggleDeletingMode: PropTypes.func,
  editRecipesToDelete: PropTypes.func,
  recipesToDelete: PropTypes.any,
  recipes: PropTypes.any,
  setRecipes: PropTypes.func,
  mealPlannerDate: PropTypes.any,
  mealPlannerKId: PropTypes.any,
  plannerId: PropTypes.any,
};

export default RecipeCard;
