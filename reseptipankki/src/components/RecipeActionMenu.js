import React from 'react';
import { motion } from 'framer-motion';

import '../styles/RecipeActionMenu.css';
import RecipeActionMenuContent from './RecipeActionMenuContent';

const RecipeActionMenu = () => {
  return (
    <motion.div
      key="recipeActionMenu"
      initial={{ y: 500 }} // Näkymän sijainti ennen animaatiota
      animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
      transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto ja pehmennys
      exit={{ y: 500 }} // Sijainti johon näkymää menee kadotessaan.
      className="recipeActionMenu"
    >
      <RecipeActionMenuContent />
    </motion.div>
  );
};

export default RecipeActionMenu;
