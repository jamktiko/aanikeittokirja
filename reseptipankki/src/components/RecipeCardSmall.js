import React from 'react';
import PropTypes from 'prop-types';
import '../styles/RecipeCardSmall.css';

import { Link } from 'react-router-dom';

const RecipeCardSmall = ({ id, name, img }) => {
  return (
    <Link className="recipeCardSmallLink" to={`/reseptit/${id}`}>
      <div className="recipeCardSmall">
        <img
          src={img ? img : require('../assets/placeholder.png')}
          alt="Reseptin kuva"
        />
        <p className="recipeCardSmallName">{name}</p>
      </div>
    </Link>
  );
};

// Parametrien tyypitykset.
RecipeCardSmall.propTypes = {
  id: PropTypes.any,

  name: PropTypes.string,
  img: PropTypes.string
};

export default RecipeCardSmall;
