import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import DarkBG from './DarkBG';
import '../styles/SideMenu.css';

/*
Tässä komponentissa on määritelty sivuvalikko, joka avataan NavBarissa olevasta
ikonista. Sivuvalikossa on sovelluksen navigaatio, sekä käyttäjätunnus.
*/
const SideMenu = ({ toggleMenu }) => {
  return (
    <div>
      <DarkBG toggle={toggleMenu} />

      <motion.div
        key="sideMenu"
        initial={{ x: 500 }}
        animate={{ x: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        exit={{ x: 500 }}
        className="sideMenu"
      >
        <Link onClick={() => toggleMenu()} to="/">
          Etusivu
        </Link>
        <Link onClick={() => toggleMenu()} to="/test">
          Testi
        </Link>
      </motion.div>
    </div>
  );
};

SideMenu.propTypes = {
  toggleMenu: PropTypes.func,
};

export default SideMenu;
