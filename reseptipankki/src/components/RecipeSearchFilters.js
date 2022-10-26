/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../styles/RecipeSearchFilters.css';
import '../styles/RecipeAddForm.css';

const RecipeSearchFilters = ({ toggleFilterMenu }) => {
  // Suodattimessa valittavat kategoriat:
  const categoriesArray = [
    'alkuruoat',
    'pääruoat',
    'jälkiruoat',
    'välipalat',
    'makeat leivonnaiset',
    'suolaiset leivonnaiset',
    'keitot',
    'salaatit',
    'juomat',
    'lisukkeet',
  ];

  // Suodattimessa valittavat erikoisruokavaliot:
  const dietsArray = [
    'kasvis',
    'vegaaninen',
    'gluteeniton',
    'maidoton',
    'laktoositon',
    'kananmunaton',
  ];

  /*
  Objektit, joihin lisätään avain-arvo pari jokaiselle erikoisruokavaliolle
  ja kategorialle.
  */
  const dietsObj = {};
  const categoriesObj = {};

  /*
  Erikoisruokavalioiden ja kategorioiden lisääminen omiin äsken luotuihin
  objekteihinsa, oletusarvolla 0.
  */
  dietsArray.forEach((diet) => {
    dietsObj[diet] = 0;
  });
  categoriesArray.forEach((diet) => {
    categoriesObj[diet] = 0;
  });

  // Tilat, joissa on säilössä erikoisruokavaliot ja kategoriat.
  const [diets, setDiets] = useState(dietsObj);
  const [categories, setCategories] = useState(categoriesObj);

  // Funktio, joka vaihtaa tietyn ruokavalion (key) arvon vastakkaiseksi.
  const handleDietsChange = (key) => {
    const copy = { ...diets }; // Luodaan kopio objektista muokattavaksi
    // Jos nykyinen arvo on 0, laitetaan 1, muuten 0.
    copy[key] = copy[key] === 0 ? 1 : 0;
    setDiets(copy);
  };

  // Funktio, joka vaihtaa tietyn kategorian (key) arvon vastakkaiseksi.
  const handleCategoriesChange = (key) => {
    const copy = { ...categories }; // Luodaan kopio objektista muokattavaksi
    // Jos nykyinen arvo on 0, laitetaan 1, muuten 0.
    copy[key] = copy[key] === 0 ? 1 : 0;
    setCategories(copy);
  };

  // Funktio, joka suoritetaan lomaketta lähetettäessä.
  const submitFilters = () => {
    console.log('diets: ', diets);
    console.log('categories: ', categories);
    toggleFilterMenu();
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
        <h2>Haun suodattimet</h2>
        <form>
          <h3>Kategoriat</h3>

          <div className="checkboxGrid">
            {categoriesArray.map((item, index) => {
              return (
                <div key={index} className="checkbox">
                  <input
                    type="checkbox"
                    id={`catCheckbox${index}`}
                    onChange={() => handleCategoriesChange(item)}
                  />
                  <label htmlFor={`catCheckbox${index}`}>{item}</label>
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
                    onChange={() => handleDietsChange(item)}
                  />
                  <label htmlFor={`dietCheckbox${index}`}>{item}</label>
                </div>
              );
            })}
          </div>
        </form>

        <div onClick={() => submitFilters()}>
          <Button color="primary" text="Näytä reseptit" />
        </div>
      </div>
    </motion.div>
  );
};

// Parametrien tyypitykset.
RecipeSearchFilters.propTypes = {
  toggleFilterMenu: PropTypes.func,
};

export default RecipeSearchFilters;
