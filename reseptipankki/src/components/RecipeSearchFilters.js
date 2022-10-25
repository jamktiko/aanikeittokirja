/* eslint-disable no-unused-vars */
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../styles/RecipeSearchFilters.css';

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
        <p>Lorem ipsum</p>

        <div onClick={toggleFilterMenu}>
          <Button color="secondary" text="Peruuta" />
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
