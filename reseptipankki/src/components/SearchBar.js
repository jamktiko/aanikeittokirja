import React from 'react';
import '../styles/SearchBar.css';
import PropTypes from 'prop-types';

import { BiFilter } from 'react-icons/bi';

/*
SearchBar on sovelluksen hakusivuilla käytettävä komponentti,
joka luo tekstikentän, johon hakusana kirjoitetaan, sekä painikkeen,
josta voi valita suodattimia hakuun. setSearchWord on parametri,
johon laitetaan funktio sellaisesta useState-hookista, joka määrittää
hakusanan tilan.
*/
const SearchBar = ({ setSearchWord }) => {
  return (
    <div className="searchBarContainer">
      <input
        onChange={({ target }) => setSearchWord(target.value)}
        className="searchBar"
        type="text"
        placeholder="Hae reseptejä..."
      />
      <div className="filterButton">
        <BiFilter className="filterIcon" />
      </div>
    </div>
  );
};

// Parametrien tyypitykset.
SearchBar.propTypes = {
  setSearchWord: PropTypes.func,
};

export default SearchBar;
