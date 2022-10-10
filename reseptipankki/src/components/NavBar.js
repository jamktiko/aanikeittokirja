/* eslint-disable no-unused-vars */
import SideMenu from './SideMenu';
import { AnimatePresence } from 'framer-motion';
import '../styles/NavBar.css';
import { React, useState } from 'react';

/*
NavBar on sovelluksen jokaisessa näkymässä ylimpänä näkyvä palkki,
jossa on sovelluksen nimi/logo vasemmassa laidassa, ja sivuvalikon
avaava ikoni oikeassa laidassa.
*/
const NavBar = () => {
  // Sivuvalikon tila: false = suljettu, true = avattu.
  const [sideMenuOpen, toggleSideMenu] = useState();

  // Näillä lasketaan kosketuksia swaippausta varten.
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

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
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      toggleSideMenu(true);
    }
  };

  // Vaihtaa sivuvalikon tilaa.
  const toggleMenu = () => {
    toggleSideMenu(!sideMenuOpen);
  };

  return (
    <div className="navBarContainer">
      <div className="navigationBar backgroundMainColor">
        <h1 className="navBarTitle">Reseptipankki</h1>

        {/* Sivuvalikon avaava nappi */}
        <button aria-label="Avaa sivuvalikko" className="buttonInvisible">
          <img
            onClick={() => toggleMenu()}
            className="menuIcon"
            src={require('../assets/menu.png')}
          />
        </button>
      </div>

      {/* Tämä div määrittää alueen jolla swaippaus toimii. */}
      <div
        className="swipeableZoneMenuClosed"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* AnimatePresence tarvitaan sivuvalikon animaatioihin */}
      <AnimatePresence>
        {sideMenuOpen ? <SideMenu toggleMenu={toggleMenu} /> : null}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
