import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import '../styles/RecipeActionMenu.css';
import RecipeActionMenuContent from './RecipeActionMenuContent';

const RecipeActionMenu = ({ recipeId }) => {
  return (
    <div className="revipeActionMenuContainer">
      <motion.div
        key="recipeActionMenu"
        initial={{ y: 500 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto ja pehmennys
        exit={{ y: 500 }} // Sijainti johon näkymää menee kadotessaan.
        className="recipeActionMenu"
      >
        <RecipeActionMenuContent recipeId={recipeId} />
      </motion.div>
    </div>
  );
};

// parametrin tyypitys
RecipeActionMenu.propTypes = {
  recipeId: PropTypes.string,
};

export default RecipeActionMenu;
