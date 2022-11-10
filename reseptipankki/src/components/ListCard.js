import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ListCard.css';
import { Link } from 'react-router-dom';
import { BiDotsVerticalRounded } from 'react-icons/bi';

/*
Tämä komponentti luo "listakortin", eli pienen listanäkymän,
joita laitetaan peräkkäin Omat listat-sivulla.
*/
const ListCard = ({ list }) => {
  return (
    <div className="listCardContainer">
      <Link to={`/listat/${list.l_id}`}>
        <div className="listCardFlex">
          <div>
            <h4>{list.nimi}</h4>
            <p>{list.reseptit} reseptiä</p>
          </div>
          <div className="listCardIcon">
            <BiDotsVerticalRounded />
          </div>
        </div>
      </Link>
    </div>
  );
};

// Parametrien tyypitykset.
ListCard.propTypes = {
  list: PropTypes.any,
};

export default ListCard;
