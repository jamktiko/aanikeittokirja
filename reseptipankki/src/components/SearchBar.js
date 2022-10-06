import React from 'react';
import '../styles/SearchBar.css';
import { BiFilter } from 'react-icons/bi';

const SearchBar = () => {
  return (
    <div className="searchBarContainer">
      <input className="searchBar" type="text" placeholder="Hae reseptejä..." />
      <div className="filterButton">
        <BiFilter className="filterIcon" />
      </div>
    </div>
  );
};

export default SearchBar;
