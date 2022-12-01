import { React, useState } from 'react';
import '../styles/ShoppingLists.css';
import PropTypes from 'prop-types';
import ShopModal from './ShopModal.js';

/*
Näkymä käyttäjän ostoslistoille. Sisältää painikkee, josta uusi
ostoslista voidaan luoda, sekä kaikki käyttäjän ostoslistat.
*/
const ShoppingLists = ({}) => {
  // Tieto, onko lisäysikkuna näkyvissä
  const [openModal, setOpenModal] = useState(false);

  const addNew = ({ shoplist, setshoplist }) => {
    setOpenModal(true);
  };

  return (
    <div className="shoppingContainer">
      <div className="headLine">
        <div className="header">Ostoslistat</div>
        <div>
          <button onClick={addNew} className="buttonInvisible">
            + UUSI LISTA
          </button>
        </div>
        {openModal && <ShopModal />}
      </div>
    </div>
  );
};

ShoppingLists.propTypes = {
  shoplist: PropTypes.any,
  setshoplist: PropTypes.any
};

export default ShoppingLists;
