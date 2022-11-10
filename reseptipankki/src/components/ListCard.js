import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ListCard.css';
import { Link } from 'react-router-dom';

const ListCard = ({ list }) => {
  console.log('list: ', list);
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
