import { React, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';
import DarkBG from './DarkBG';
import Button from './Button';
import { motion } from 'framer-motion';
import '../styles/ListModal.css';

/*
Komponentti, jossa on listojen lisäämisessä/muokkauksessa käytettävä ikkuna.
*/
const ListModal = ({
  setOpenModal,
  toggleMenu,
  parsedUserData,
  lists,
  setLists,
  editMode,
  editName,
  editDesc,
  listId,
  setFetchedData,
  fetchedData,
  openedFromListPage,
  setListName,
  setListDesc,
}) => {
  const [name, setName] = useState(editName ? editName : '');
  const [description, setDescription] = useState(editDesc ? editDesc : '');

  // Käyttäjälle näkyvä validointivirheilmoituksen tila:
  const [validationError, setValidationError] = useState(false);

  const validate = () => {
    if (name.length === 0 || name.length > 20) return false;
    if (description.length > 100) return false;
    return true;
  };

  const updateListsState = (resData) => {
    /*
    Kun lista on luotu onnistuneesti, tehdään kopio OwnLists-komponentin
    lists-taulukosta, ja lisätään siihen objekti joka sisältää uuden
    listan tiedot sekä l_id:n, ja korvataan alkuperäinen taulukko
    kopiolla. Näin varmistetaan, että uusi lista saadaan näkyviin ilman
    refreshausta.
    */
    const listsCopy = [...lists];
    const newList = resData;
    newList.l_id = resData.id;
    newList.reseptit = 0;
    listsCopy.push(newList);
    setLists([...listsCopy]);
    setOpenModal(false);
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

      if (editMode) {
        // Pyyntö, joka lähettää uuden päivitetyn tietokantaan:
        axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/api/lista/${listId}`,
            listObject,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                cognitoId: rdsAccount[0].cognito_id,
              },
            }
          )
          .then((res) => {
            if (openedFromListPage) {
              setListName(res.data.nimi);
              setListDesc(res.data.kuvaus);
              setOpenModal(false);
              toggleMenu(false);
            } else {
              const copy = [...lists];
              const index = copy.findIndex((i) => i.l_id === listId);
              copy[index].nimi = res.data.nimi;
              copy[index].kuvaus = res.data.kuvaus;
              setLists([...copy]);
              setOpenModal(false);
              toggleMenu(false);
            }
          })
          .catch((error) => {
            console.error('Adding list failed: ', error);
          });
      } else {
        // Pyyntö, joka lähettää uuden listan tietokantaan:
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/api/lista`, listObject, {
            headers: {
              Authorization: `Bearer ${token}`,
              cognitoId: rdsAccount[0].cognito_id,
            },
          })
          .then((res) => {
            updateListsState(res.data);
          })
          .catch((error) => {
            console.error('Adding list failed: ', error);
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
        <form onSubmit={onSubmit}>
          <div className="listRecipeAddForm">
            <h2>{editMode ? 'Muokkaa listaa' : 'Luo uusi lista'}</h2>

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
          <Button
            color="primary"
            text={editMode ? 'Tallenna muutokset' : 'Lisää'}
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

ListModal.propTypes = {
  setOpenModal: PropTypes.any,
  toggleMenu: PropTypes.func,
  parsedUserData: PropTypes.any,
  lists: PropTypes.array,
  setLists: PropTypes.func,
  editMode: PropTypes.bool,
  editName: PropTypes.string,
  editDesc: PropTypes.string,
  listId: PropTypes.any,
  fetchedData: PropTypes.any,
  setFetchedData: PropTypes.func,
  openedFromListPage: PropTypes.bool,
  setListName: PropTypes.func,
  setListDesc: PropTypes.func,
};

export default ListModal;
