import React from 'react';
import '../styles/Loading.css';
import { BiLoaderAlt } from 'react-icons/bi';

// Komponentti, jota näytetään kun hookin suorittama lataus on kesken.
const Loading = () => {
  return (
    <div className="loadingContainer">
      <h2>Ladataan...</h2>
      <BiLoaderAlt className="loadingIcon" />
    </div>
  );
};

export default Loading;
