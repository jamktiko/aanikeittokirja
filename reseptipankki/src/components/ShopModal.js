import { React, useState } from 'react';
import DarkBG from './DarkBG';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Button from './Button';
import '../styles/ListModal.css';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';

const ShopModal = ({
  setOpenModal,
  shopLists,
  setShopLists,
  editMode,
  editShopList,
  openedFromCard,
  shopList,
  setShopList
}) => {
  const [name, setName] = useState(editShopList ? editShopList.nimi : '');

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [validationError, setValidationError] = useState(false);

  // Funktio, joka päivittää näkyvissä olevien ostoslistojen taulukon
  const updateShopLists = (resData) => {
    const copy = [...shopLists];
    const newList = resData;
    copy.push({ ...newList, o_id: resData.id });
    setShopLists([...copy]);
    // Lopuksi suljetaan modaali
    setOpenModal(false);
  };

  const submit = async (event) => {
    event.preventDefault();

    // Varmistetaan että jonkinlainen nimi on syötetty.
    if (name.length > 0) {
      // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
      // Funktio myös palauttaa käyttäjän tokenit.
      const parsedData = await getUserRefresh();
      const token = parsedData.accessToken.jwtToken;

      // Haetaan käyttäjän tiedot RDS:stä.
      const rdsAccount = await axios
        .get(
          // eslint-disable-next-line max-len
          `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
        });

      const listObject = {
        nimi: name,
        Kayttaja_k_id: rdsAccount[0].k_id
      };

      // Tarkistetaan, ollaanko ostoslistaa lisäämässä vai muokkaamassa:
      if (editMode) {
        // Pyyntö, joka lähettää päivitetyn ostoslistan tietokantaan:
        axios
          .put(
            // eslint-disable-next-line max-len
            `${process.env.REACT_APP_BACKEND_URL}/api/ostoslista/${editShopList.o_id}`,
            listObject,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                cognitoId: rdsAccount[0].cognito_id
              }
            }
          )
          .then((res) => {
            if (openedFromCard) {
              // Päivitetään näkyvissä olevat ostoslistat
              const copy = [...shopLists];
              const index = copy.findIndex((i) => i.o_id === editShopList.o_id);
              copy[index].nimi = res.data.nimi;
              setShopLists([...copy]);
              setOpenModal(false);
            } else {
              setShopList({ ...shopList, nimi: name });
              setOpenModal(false);
            }
          })
          .catch((error) => {
            console.error('Editing list failed: ', error);
            setOpenModal(false);
          });
      } else {
        // Pyyntö, joka lähettää uuden ostoslistan tietokantaan:
        axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/api/ostoslista`,
            listObject,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                cognitoId: rdsAccount[0].cognito_id
              }
            }
          )
          .then((res) => {
            // Päivitetään näkyvissä olevat ostoslistat
            updateShopLists(res.data);
          })
          .catch((error) => {
            console.error('Adding list failed: ', error);
            setOpenModal(false);
          });
      }
    } else {
      setValidationError(true);
    }
  };

  return (
    <div>
      <DarkBG toggleMenu={setOpenModal} z={94} />

      <motion.div
        key="listAddingModal"
        initial={{ y: 700 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: -80 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto ja pehmennys
        exit={{ y: 700 }} // Sijainti johon näkymää menee kadotessaan.
        className="listRecipeAddContainer"
      >
        <form onSubmit={submit}>
          <div className="listRecipeAddForm">
            <h2>{editMode ? 'Muokkaa nimeä' : 'Uusi ostoslista'}</h2>

            <p className={validationError ? 'errorP' : null}>Nimi</p>
            <input
              onClick={() => setValidationError(false)}
              className={validationError ? 'errorInput textInput' : 'textInput'}
              type="text"
              value={name}
              maxLength="20"
              onChange={(event) => setName(event.target.value)}
            ></input>
          </div>

          <Button
            color="primary"
            text={editMode ? 'Tallenna' : 'Lisää'}
            type="submit"
          />
        </form>

        <div onClick={() => setOpenModal(false)}>
          <Button color="secondary" text="Peruuta" type="button" />
        </div>
      </motion.div>
    </div>
  );
};

// Parametrien tyypitykset.
ShopModal.propTypes = {
  setOpenModal: PropTypes.func,
  shopLists: PropTypes.array,
  setShopLists: PropTypes.func,
  editMode: PropTypes.bool,
  editShopList: PropTypes.object,
  openedFromCard: PropTypes.bool,
  shopList: PropTypes.any,
  setShopList: PropTypes.func
};

export default ShopModal;
