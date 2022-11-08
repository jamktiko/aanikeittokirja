import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Loading.css';

// Komponentti, joka näytetään kun hook palauttaa virheen.
const LoadingError = ({ subtext }) => {
  return (
    <div className="loadingContainer">
      <h2>Virhe latauksessa.</h2>
      <p>{subtext}</p>
    </div>
  );
};

// Parametrien tyypitykset.
LoadingError.propTypes = {
  subtext: PropTypes.string,
};

export default LoadingError;
