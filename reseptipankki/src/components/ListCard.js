import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ListCard.css';
import { Link } from 'react-router-dom';

/*
Tämä komponentti luo "listakortin", eli pienen listanäkymän,
joita laitetaan peräkkäin Omat listat-sivulla.
*/
const ListCard = ({ list }) => {
  return (
    <div className="listCardContainer">
      <Link to={`/listat/${list.l_id}`}>
        <p>{list.nimi}</p>
      </Link>
    </div>
  );
};

// Parametrien tyypitykset.
ListCard.propTypes = {
  list: PropTypes.any,
};

export default ListCard;
