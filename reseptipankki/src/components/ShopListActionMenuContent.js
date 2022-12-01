import { React, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ActionMenuContent.css';
import Button from './Button';
import ShopModal from './ShopModal.js';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

const ShopListActionMenuContent = ({
  shopList,
  toggleMenu,
  openedFromShopListPage,
  shopLists,
  setShopLists,
}) => {
  const [deleteOptionOpen, toggleDeleteMenuOpen] = useState(false);
  const [editModalOpen, toggleEditModalOpen] = useState(false);

  // Funktio, joka poistaa ostoslistan
  const deleteShopList = async () => {
    // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit..
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;
    const cognitoId = parsedData.idToken.payload.sub;

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/ostoslista/
        ${shopList.o_id}`,
        {
          headers: { Authorization: `Bearer ${token}`, cognitoId: cognitoId },
        }
      )
      .then((res) => {
        if (openedFromShopListPage) {
          navigate('/ostoslistat');
        } else {
          /*
          Jotta ostoslista häviäisi näkyvistä ilman refreshaustakin, listan
          objekti pitää poistaa shopLists-tilasta, joka tulee parametrina.
          */
          const copy = [...shopLists];
          setShopLists(
            copy.filter((o) => {
              return o.o_id !== shopList.o_id;
            })
          );

          toggleMenu(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toggleMenu(false);
      });
  };

  return (
    <div className="actionMenuContent">
      <button
        onClick={() => toggleEditModalOpen(true)}
        className="buttonInvisible width100 listMenuFirst"
      >
        <p className="actionMenuLink blackText">Muokkaa nimeä</p>
      </button>

      <AnimatePresence>
        {editModalOpen && (
          <ShopModal
            setOpenModal={toggleMenu}
            shopLists={shopLists}
            setShopLists={setShopLists}
            editMode={true}
            editShopList={shopList}
          />
        )}
      </AnimatePresence>

      <div className="divider" />

      {deleteOptionOpen ? (
        <div>
          <p>Haluatko varmasti poistaa ostoslistan?</p>

          <div className="twoButtonsDiv">
            <div onClick={() => toggleDeleteMenuOpen(false)}>
              <Button color={'secondary'} text={'Peruuta'} />
            </div>

            <div onClick={() => deleteShopList()}>
              <Button color={'warning'} text={'Poista'} />
            </div>
          </div>
        </div>
      ) : (
        <button
          className="buttonInvisible width100"
          onClick={() => toggleDeleteMenuOpen(true)}
        >
          <p className="actionMenuLink blackText">Poista ostoslista</p>
        </button>
      )}

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p className="actionMenuLink blackText listMenuLast">Jaa</p>
      </button>
    </div>
  );
};

// Parametrien tyypitykset.
ShopListActionMenuContent.propTypes = {
  shopList: PropTypes.any,
  toggleMenu: PropTypes.func,
  openedFromShopListPage: PropTypes.bool,
  shopLists: PropTypes.array,
  setShopLists: PropTypes.func,
};

export default ShopListActionMenuContent;
