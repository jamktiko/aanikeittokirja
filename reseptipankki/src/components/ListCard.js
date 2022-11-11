import { React, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ListCard.css';
import { Link } from 'react-router-dom';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { AnimatePresence } from 'framer-motion';
import ActionMenu from './ActionMenu';
import DarkBG from './DarkBG';
import ListActionMenuContent from './ListActionMenuContent';

/*
Tämä komponentti luo "listakortin", eli pienen listanäkymän,
joita laitetaan peräkkäin Omat listat-sivulla.
*/
const ListCard = ({ list }) => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  return (
    <div className="listCardContainer">
      <div className="listCardFlex">
        <div className="listCardText">
          <Link to={`/listat/${list.l_id}`}>
            <h4>{list.nimi}</h4>
            <p>{list.reseptit} reseptiä</p>
          </Link>
        </div>

        <div className="listCardIcon">
          <BiDotsVerticalRounded onClick={() => toggleMenuOpen(!menuOpen)} />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <div>
            <DarkBG toggleMenu={toggleMenuOpen} z={3} />
            <ActionMenu menuContent={<ListActionMenuContent />} />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

// Parametrien tyypitykset.
ListCard.propTypes = {
  list: PropTypes.any,
};

export default ListCard;
