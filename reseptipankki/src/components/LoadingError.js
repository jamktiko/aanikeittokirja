import React from 'react';
import '../styles/Loading.css';

// Komponentti, joka näytetään kun hook palauttaa virheen.
const LoadingError = () => {
  return (
    <div className="loadingContainer">
      <h2>Virhe latauksessa.</h2>
    </div>
  );
};

export default LoadingError;
