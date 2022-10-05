import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = () => {
  return (
    <div className="searchBarContainer">
      <input className="searchBar" type="text" placeholder="Hae reseptejä..." />
      <div className="filterButton">...</div>
    </div>
  );
};

export default SearchBar;
