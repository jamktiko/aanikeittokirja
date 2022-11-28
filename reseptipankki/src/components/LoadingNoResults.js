import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Loading.css';

// Komponentti, jota näytetään kun hookin suorittama lataus on kesken.
const LoadingNoResults = ({ subtext }) => {
  console.log('');
  return (
    <div className="loadingContainer">
      <h2>Reseptejä ei löytynyt</h2>
      <p>{subtext}</p>
    </div>
  );
};

// Parametrien tyypitykset.
LoadingNoResults.propTypes = {
  subtext: PropTypes.string,
};

export default LoadingNoResults;
