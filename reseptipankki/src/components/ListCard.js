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
const ListCard = ({ list, lists, setLists }) => {
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
            <ActionMenu
              menuContent={
                <ListActionMenuContent
                  toggleMenu={toggleMenuOpen}
                  id={list.l_id}
                  openedFromListPage={false}
                  name={list.nimi}
                  desc={list.kuvaus}
                  lists={lists}
                  setLists={setLists}
                />
              }
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

// Parametrien tyypitykset.
ListCard.propTypes = {
  list: PropTypes.any,
  lists: PropTypes.array,
  setLists: PropTypes.func,
};

export default ListCard;
