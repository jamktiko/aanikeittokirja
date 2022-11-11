import { React, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';
import DarkBG from './DarkBG';
import Button from './Button';
import { motion } from 'framer-motion';
import '../styles/ListModal.css';

/*
Komponentti, jossa on listojen lisäämisessä käytettävä ikkuna.
*/
const ListModal = ({ setOpenModal, parsedUserData, lists, setLists }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [validationError, setValidationError] = useState(false);

  const validate = () => {
    if (name.length === 0 || name.length > 20) return false;
    if (description.length > 100) return false;
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      // Haetaan käyttäjän tiedot RDS:stä.
      const rdsAccount = await axios
        .get(
          // eslint-disable-next-line max-len
          `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedUserData?.idToken.payload['cognito:username']}"`
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error(error);
        });

      const listObject = {
        nimi: name,
        kuvaus: description,
        cognito_id: rdsAccount[0].cognito_id,
        Kayttaja_k_id: rdsAccount[0].k_id,
      };

      // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
      // Funktio myös palauttaa käyttäjän tokenit.
      const parsedData = await getUserRefresh();
      const token = parsedData.accessToken.jwtToken;

      // Pyyntö, joka lähettää listan tietokantaan:
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/lista`, listObject, {
          headers: {
            Authorization: `Bearer ${token}`,
            cognitoId: rdsAccount[0].cognito_id,
          },
        })
        .then((res) => {
          /*
          Kun lista on luotu onnistuneesti, tehdään kopio OwnLists-komponentin
          lists-taulukosta, ja lisätään siihen objekti joka sisältää uuden
          listan tiedot sekä l_id:n, ja korvataan alkuperäinen taulukko
          kopiolla. Näin varmistetaan, että uusi lista saadaan näkyviin ilman
          refreshausta.
          */
          const listsCopy = [...lists];
          const newList = res.data;
          newList.l_id = res.data.id;
          newList.reseptit = 0;
          listsCopy.push(newList);
          setLists(listsCopy);
          setOpenModal(false);
        })
        .catch((error) => {
          console.error('Adding list failed: ', error);
        });
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
        <div></div>
        <form onSubmit={onSubmit}>
          <div className="listRecipeAddForm">
            <h2>Luo uusi lista</h2>

            <p className={validationError ? 'errorP' : null}>Nimi</p>
            <input
              onClick={() => setValidationError(false)}
              className={validationError ? 'errorInput textInput' : 'textInput'}
              type="text"
              value={name}
              maxLength="20"
              onChange={(event) => setName(event.target.value)}
            ></input>

            <p>Kuvaus</p>
            <input
              className="textInput"
              type="text"
              value={description}
              maxLength="100"
              onChange={(event) => setDescription(event.target.value)}
            ></input>
          </div>
          <Button color="primary" text="Lisää" type="submit" />
        </form>
      </motion.div>
    </div>
  );
};

ListModal.propTypes = {
  setOpenModal: PropTypes.any,
  parsedUserData: PropTypes.any,
  lists: PropTypes.array,
  setLists: PropTypes.func,
};

export default ListModal;
