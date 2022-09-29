import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Button.css';

/*
Kaikki sovelluksen napit luodaan tällä komponentilla, jotta niistä
tulee yhtenmukaiset. Color määritää napin värit (vaihtoehdot ovat
primary, secondary ja warning), text määrittää mitä napissa lukee.
*/
const Button = ({ color, text }) => {
  // Koska napilla on kaksi css-luokkaa, ne syötetään siihen näin.
  const classes = `buttonClass textColorSecondary ${color}`;

  return <button className={classes}>{text}</button>;
};

// Parametrien tyypitykset.
Button.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'warning']),
  text: PropTypes.any,
};

export default Button;
