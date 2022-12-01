/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { React } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../styles/RecipeSearchFilters.css';
import '../styles/RecipeAddForm.css';

const RecipeSearchFilters = ({
  toggleFilterMenu,
  setCategories,
  categoriesState,
  setDiets,
  dietsState,
  categoriesArray,
  dietsArray,
  order,
  setOrder,
  useFetch,
  recipes,
  setRecipes,
}) => {
  // Funktio, joka vaihtaa tietyn ruokavalion (key) arvon vastakkaiseksi.
  const handleDietsChange = (key) => {
    const copy = { ...dietsState }; // Luodaan kopio objektista muokattavaksi
    // Jos nykyinen arvo on 0, laitetaan 1, muuten 0.
    copy[key] = copy[key] === 0 ? 1 : 0;
    setDiets(copy);
  };

  // Funktio, joka vaihtaa tietyn kategorian (key) arvon vastakkaiseksi.
  const handleCategoriesChange = (key) => {
    const copy = { ...categoriesState }; // Luodaan kopio muokattavaksi
    // Jos nykyinen arvo on 0, laitetaan 1, muuten 0.
    copy[key] = copy[key] === 0 ? 1 : 0;
    setCategories(copy);
  };

  const handleOrderChange = (value) => {
    setOrder(value);
  };

  return (
    <motion.div
      key="filterMenuContainer"
      initial={{ y: -1000 }} // Näkymän sijainti ennen animaatiota
      animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
      transition={{ duration: 0.5 }} // Kesto ja pehmennys
      exit={{ y: -1000 }} // Sijainti johon näkymää menee kadotessaan.
      className="filterMenuContainer"
    >
      <div className="filterMenuContentContainer">
        <div className="filterMenuHeaderContainer">
          <h2 className="filterMenuHeader">Haun suodattimet</h2>
          <button onClick={toggleFilterMenu} className="buttonInvisible">
            SULJE
          </button>
        </div>

        <h3>Kategoriat</h3>

        <div className="checkboxGrid">
          {categoriesArray.map((item, index) => {
            return (
              <div key={index} className="checkbox">
                <input
                  type="checkbox"
                  id={`catCheckbox${index}`}
                  checked={categoriesState[item] === 1}
                  onChange={() => handleCategoriesChange(item)}
                />
                <label htmlFor={`catCheckbox${index}`}>
                  {item.replace(/_/g, ' ')}
                </label>
              </div>
            );
          })}
        </div>

        <h3>Erikoisruokavaliot</h3>

        <div className="checkboxGrid">
          {dietsArray.map((item, index) => {
            return (
              <div key={index} className="checkbox">
                <input
                  type="checkbox"
                  id={`dietCheckbox${index}`}
                  checked={dietsState[item] === 1}
                  onChange={() => handleDietsChange(item)}
                />
                <label htmlFor={`dietCheckbox${index}`}>{item}</label>
              </div>
            );
          })}
        </div>

        <h3>Tulosten järjestys</h3>

        <div>
          <select
            className="selectOrder"
            onChange={(e) => handleOrderChange(e.target.value)}
            defaultValue={order}
          >
            <option value="r_id">Uusin ensin</option>

            <option value="keskiarvo">Parhaaksi arvosteltu ensin</option>
          </select>
        </div>

        <div onClick={() => toggleFilterMenu()}>
          <Button color="primary" text="Näytä reseptit" />
        </div>
      </div>
    </motion.div>
  );
};

// Parametrien tyypitykset.
RecipeSearchFilters.propTypes = {
  toggleFilterMenu: PropTypes.func,
  useFetch: PropTypes.func,
  setCategories: PropTypes.any,
  setDiets: PropTypes.any,
  categoriesState: PropTypes.any,
  dietsState: PropTypes.any,
  categoriesArray: PropTypes.any,
  dietsArray: PropTypes.any,
  recipes: PropTypes.array,
  setRecipes: PropTypes.func,
  order: PropTypes.string,
  setOrder: PropTypes.func,
};

export default RecipeSearchFilters;
