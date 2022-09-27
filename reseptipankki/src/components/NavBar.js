import { React, useState } from 'react';
import SideMenu from './SideMenu';
import { AnimatePresence } from 'framer-motion';
import '../styles/NavBar.css';

/*
Tässä komponentissa on määritelty sovelluksessa aina ylimpänä näkyvä palkki,
sekä siinä oleva sivuvalikon avaava ikoni.
*/
const NavBar = () => {
  // Sivuvalikon tila: false = suljettu, true = avattu.
  const [sideMenuOpen, toggleSideMenu] = useState(false);

  // Vaihtaa sivuvalikon tilaa.
  const toggleMenu = () => {
    toggleSideMenu(!sideMenuOpen);
  };

  return (
    <div>
      <div className="navigationBar backgroundMainColor">
        <h1 className="navBarTitle">Reseptipankki</h1>

        <button aria-label="Avaa sivuvalikko" className="buttonInvisible">
          <img
            onClick={() => toggleMenu()}
            className="menuIcon"
            src={require('../assets/menu.png')}
          />
        </button>
      </div>

      <AnimatePresence>
        {sideMenuOpen ? <SideMenu toggleMenu={toggleMenu} /> : null}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;
