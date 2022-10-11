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
  // Minimipituus pyyhkäisyn huomioimiseen.
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
    <div className="sideMenuContainer">
      {/* Komponentti joka pimentää näkymästä muun kuin sivuvalikon */}
      <DarkBG toggleMenu={toggleMenu} z={8} />

      {/* Diviin lisätään "motion", jonka avulla Framer-motionin animaatiot
        voidaan ottaa käyttöön. */}
      <motion.div
        key="sideMenu"
        initial={{ x: 500 }} // Näkymän sijainti ennen animaatiota
        animate={{ x: 1 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.2, ease: 'easeOut' }} // Kesto ja pehmennys
        exit={{ x: 500 }} // Sijainti johon näkymää menee kadotessaan.
        className="sideMenu"
      >
        <div className="sideMenuBackground">
          {/* Tämä div määrittää alueen jolla swaippaus toimii. */}
          <div
            className="swipeableZoneMenuOpen"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />

          {/* Sivuvalikon linkit löytyvät omasta komponentistaan */}
          <SideMenuContent toggleMenu={toggleMenu} />
        </div>
      </motion.div>
    </div>
  );
};

// ToggleMenun tyypittäminen funktioksi.
SideMenu.propTypes = {
  toggleMenu: PropTypes.func,
};

export default SideMenu;
