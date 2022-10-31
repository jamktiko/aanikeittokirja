import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

/*
PrivateRoute on komponentti, jota käytetään varmistamaan, että
tiettyjä muita komponentteja ei näytetä käyttäjille, jotka eivät
ole kirjautuneet sisään.

PrivateRoute tarkistaa, löytyvätkö käyttäjän tiedot localStoragesta.
Jos löytyvät, ohjataan käyttäjä siihen komponenttiin, joka tähän on
upotettu App.js-tiedostossa. Jos ei löydy, käyttäjä ohjataan
kirjautumissivulle.
*/
const PrivateRoute = ({ children }) => {
  // Haetaan käyttäjätiedot localStoragesta.
  const userData = localStorage.getItem('user');

  if (userData) {
    return <>{children}</>;
  } else {
    return <Navigate replace={true} to="/kirjaudu" />;
  }
};

// Parametrien tyypitykset.
PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export default PrivateRoute;
