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

toggleFilterMenu on funktio, joka avaa suodatinvalikon (oma komponenttinsa)
*/
const SearchBar = ({ setSearchWord, toggleFilterMenu }) => {
  return (
    <div className="searchBarContainer">
      <input
        onChange={({ target }) => setSearchWord(target.value)}
        className="searchBar"
        type="text"
        placeholder="Hae reseptejä..."
      />
      <div className="filterButton" onClick={toggleFilterMenu}>
        <BiFilter className="filterIcon" />
      </div>
    </div>
  );
};

// Parametrien tyypitykset.
SearchBar.propTypes = {
  setSearchWord: PropTypes.func,
  toggleFilterMenu: PropTypes.func,
};

export default SearchBar;
