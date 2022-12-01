import { React, useState, useEffect } from 'react';
import '../styles/ShoppingLists.css';
import PropTypes from 'prop-types';
import ShopModal from './ShopModal.js';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ShoppingCard from './ShoppingCard';

/*
Näkymä käyttäjän ostoslistoille. Sisältää painikkee, josta uusi
ostoslista voidaan luoda, sekä kaikki käyttäjän ostoslistat.
*/
const ShoppingLists = ({}) => {
  // Tieto, onko lisäysikkuna näkyvissä
  const [openModal, setOpenModal] = useState(false);

  // Tila johon laitetaan näytettävät listat:
  const [shopLists, setShopLists] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ostoslista`)
      .then((res) => {
        setShopLists(res.data);
      })
      .catch((error) => {
        console.error('Fetching shopping lists failed: ', error.message);
      });
  }, []);

  return (
    <div className="shoppingContainer">
      <div className="headLine">
        <h2 className="header">Ostoslistat</h2>
        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="buttonInvisible"
          >
            + UUSI
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openModal && (
          <ShopModal
            setOpenModal={setOpenModal}
            shopLists={shopLists}
            setShopLists={setShopLists}
            editMode={false}
          />
        )}
      </AnimatePresence>

      {shopLists.map((item, index) => {
        return (
          <ShoppingCard
            key={index}
            shopList={item}
            shopLists={shopLists}
            setShopLists={setShopLists}
          />
        );
      })}
    </div>
  );
};

ShoppingLists.propTypes = {
  shoplist: PropTypes.any,
  setshoplist: PropTypes.any,
};

export default ShoppingLists;
