import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import DarkBG from './DarkBG';
import Loading from './Loading';
import '../styles/AddModal.css';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';
import Message from './Message';

/*
Komponentti, joka sisältää modaalin, jossa käyttäjä valitsee
mihin ostoslistaan hän haluaa lisätä reseptin ainekset.
*/
const ShoppingListAddModal = ({
  setOpenModal,
  toggleMenuOpen,
  rdsAccount,
  ingredients,
}) => {
  // Taulukko johon valittavissa olevat ostoslistat laitetaan.
  const [shopLists, setShopLists] = useState([]);
  // Tieto siitä onko ostoslistojen lataus yhä kesken.
  const [loading, setLoading] = useState(true);
  // Tieto siitä kertoo näytetäänkö onnistumisesta kertova viesti.
  const [showMessage, toggleMessage] = useState(false);

  useEffect(() => {
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/ostoslista/kayttaja/${rdsAccount[0].k_id}`
      )
      .then((res) => {
        setShopLists(res.data);
      })
      .catch((error) => {
        console.error('Fetching shopping lists failed: ', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Funktio, jossa reseptin ainekset lähetetään ostoslistojen tietokantaan
  const addToShoppingList = async (id) => {
    // Objekti, joka lähetetään pyynnön mukana.
    const requestObject = {
      Ostoslista_o_id: id,
      ainekset: [],
    };

    /*
    Lisätään jokaiselle ainekselle oma objektinsa pyyntöön
    liitettävään objektiin.
    */
    ingredients.forEach((i) => {
      requestObject.ainekset.push({
        aines: i.aines,
        maara: i.maara,
        yksikko: i.yksikko,
        Ostoslista_o_id: id,
      });
    });

    // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit..
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;
    const cognitoId = parsedData.idToken.payload.sub;

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines`,
        requestObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            cognitoId: cognitoId,
          },
        }
      )
      .then((res) => {
        toggleMessage(true);
        setTimeout(() => {
          toggleMenuOpen(false);
        }, 1800);
      })
      .catch((error) => {
        console.error('Adding items to shopping list failed: ', error);
      });
  };

  return (
    <div>
      <DarkBG toggleMenu={setOpenModal} z={94} />

      <motion.div
        key="addModal"
        initial={{ y: 700 }} // Näkymän ennen animaatiota (läpinäkyvä)
        animate={{ y: 0 }} // Näkymän animaation jälkeen (näkyvä)
        transition={{ duration: 0.4 }} // Animaation kesto.
        exit={{ y: 700 }} // Tila johon näkymä animoituu sen kadotessa.
        className="addModalContainer"
      >
        <h3 className="shopListModalHeader">Lisää ainekset ostoslistalle:</h3>

        {!loading ? (
          <div className="addToListsContainer">
            {shopLists?.map((item, index) => {
              return (
                <div onClick={() => addToShoppingList(item.o_id)} key={index}>
                  <p className="shoppingListButton">{item.nimi}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Loading />
        )}
      </motion.div>

      {/* Lisäyksen jälkeen näkyviin laitetaan pieni ilmoitus: */}
      <AnimatePresence>
        {showMessage && (
          <Message
            text="Lisätty onnistuneesti!"
            toggle={toggleMessage}
            seconds={1.5}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

ShoppingListAddModal.propTypes = {
  setOpenModal: PropTypes.func,
  toggleMenuOpen: PropTypes.func,
  rdsAccount: PropTypes.any,
  ingredients: PropTypes.array,
};

export default ShoppingListAddModal;
