import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/*
Tämä komponentti pimentää koko näkymää hieman. Laita näkyviin
esim. sivuvalikon tai ikkunoiden tullessa näkyviin.
*/
const DarkBG = ({ toggleMenu }) => {
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      exit={{ opacity: 0 }}
      onClick={() => toggleMenu()}
      className="overlay"
    ></motion.div>
  );
};

DarkBG.propTypes = {
  toggleMenu: PropTypes.func,
};

export default DarkBG;
