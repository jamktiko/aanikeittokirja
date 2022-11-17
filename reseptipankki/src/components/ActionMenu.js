import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../styles/ActionMenu.css';

const ActionMenu = ({ menuContent }) => {
  return (
    <div className="revipeActionMenuContainer">
      <motion.div
        key="recipeActionMenu"
        initial={{ y: 800 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.4 }} // Kesto ja pehmennys
        exit={{ y: 800 }} // Sijainti johon näkymää menee kadotessaan.
        className="recipeActionMenu"
      >
        {menuContent}
        {/*
          <RecipeActionMenuContent
          recipeData={recipeData}
          ingredientsData={ingredientsData}
          />
        */}
      </motion.div>
    </div>
  );
};

// parametrin tyypitys
ActionMenu.propTypes = {
  menuContent: PropTypes.any,
};

export default ActionMenu;
