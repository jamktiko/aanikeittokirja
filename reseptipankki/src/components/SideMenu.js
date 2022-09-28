import { React, useState } from 'react';
import PropTypes from 'prop-types';
import SideMenuContent from './SideMenuContent';
import { motion } from 'framer-motion';
import DarkBG from './DarkBG';
import '../styles/SideMenu.css';

/*
Tässä komponentissa on määritelty sivuvalikko, joka avataan NavBarissa olevasta
ikonista. Sivuvalikossa on sovelluksen navigaatio, sekä käyttäjätunnus.
*/
const SideMenu = ({ toggleMenu }) => {
  // Näillä lasketaan kosketuksia swaippausta varten.
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 100;

  // Nämä kolme funktiota hoitavat swaippausten kosketuksiin liityvät laskennat.
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance < minSwipeDistance;
    if (isLeftSwipe) {
      toggleMenu();
    }
  };

  return (
    <div>
      <DarkBG toggleMenu={toggleMenu} />

      <motion.div
        key="sideMenu"
        initial={{ x: 500 }}
        animate={{ x: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        exit={{ x: 500 }}
        className="sideMenu"
      >
        {/* Tämä div määrittää alueen jolla swaippaus toimii. */}
        <div
          className="swipeableZoneMenuOpen"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />

        <SideMenuContent toggleMenu={toggleMenu} />
      </motion.div>
    </div>
  );
};

SideMenu.propTypes = {
  toggleMenu: PropTypes.func,
};

export default SideMenu;
