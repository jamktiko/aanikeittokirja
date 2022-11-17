import React from 'react';
import '../styles/Loading.css';

// Komponentti, jota näytetään kun hookin suorittama lataus on kesken.
const LoadingNoResults = () => {
  return (
    <div className="loadingContainer">
      <h2>Reseptejä ei löytynyt</h2>
      <p>Kokeile muuttaa valitsemiasi suodattimia.</p>
    </div>
  );
};

export default LoadingNoResults;
