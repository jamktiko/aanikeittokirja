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
const SearchBar = ({ searchWord, setSearchWord, toggleFilterMenu }) => {
  return (
    <div className="searchBarContainer">
      <input
        onChange={({ target }) => setSearchWord(target.value)}
        className="searchBar"
        value={searchWord}
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
  searchWord: PropTypes.string,
  setSearchWord: PropTypes.func,
  toggleFilterMenu: PropTypes.func,
};

export default SearchBar;
