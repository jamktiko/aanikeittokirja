import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  BiHome,
  BiBookmarks,
  BiHeart,
  BiSearchAlt2,
  BiPencil,
  BiCamera,
  BiCloudDownload,
  BiCalendarWeek,
  BiShoppingBag,
} from 'react-icons/bi';
import '../styles/SideMenuContent.css';

const SideMenuContent = ({ toggleMenu }) => {
  return (
    <div className="sideMenuContent">
      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/">
          <BiHome /> Etusivu
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/reseptit">
          <BiHeart /> Omat reseptit
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/listat">
          <BiBookmarks /> Omat listat
        </Link>
      </div>

      <div className="sideMenuDivider" />

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/haku">
          <BiSearchAlt2 /> Hae reseptejä
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/uusi">
          <BiPencil /> Kirjoita resepti
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/kuvaa">
          <BiCamera /> Kuvaa resepti
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/lataa">
          <BiCloudDownload /> Lataa resepti
        </Link>
      </div>

      <div className="sideMenuDivider" />

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/ateriat">
          <BiCalendarWeek /> Ateriasuunnittelu
        </Link>
      </div>

      <div className="sideMenuLink" onClick={() => toggleMenu()}>
        <Link to="/ostoslistat">
          <BiShoppingBag /> Ostoslistat
        </Link>
      </div>
    </div>
  );
};

SideMenuContent.propTypes = {
  toggleMenu: PropTypes.func,
};

export default SideMenuContent;
