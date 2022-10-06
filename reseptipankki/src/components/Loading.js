import React from 'react';
import '../styles/Loading.css';

// Komponentti, jota näytetään kun hookin suorittama lataus on kesken.
const Loading = () => {
  return (
    <div className="loadingContainer">
      <h2>Ladataan...</h2>
    </div>
  );
};

export default Loading;
