/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import axios from 'axios';
import ListCard from './ListCard.js';
import ListModal from './ListModal.js';
import LoadingError from './LoadingError.js';
import { AnimatePresence } from 'framer-motion';
import '../styles/OwnLists.css';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [userData, setUserData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [lists, setLists] = useState([]);

  // Tila siitä onko virhettä tapahtunut
  const [error, setError] = useState(false);

  // Funktio joka avaa listan lisäysmodaalin.
  const addList = () => {
    setOpenModal(true);
  };

  // Kun lists-päivittyy, virheilmoitus otetaan pois:
  useEffect(() => {
    setError(false);
  }, [lists]);

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userDataLS = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userDataLS);
    setUserData(parsedUserData);
    // Otetaan käyttäjän cognito_id talteen.
    const cognitoId = parsedUserData.idToken.payload.sub;

    // Pyyntö, joka hakee käyttäjän listat cognito id:n perusteella.
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/lista/kayttaja/${cognitoId}`
      )
      .then((res) => {
        // Palautuneet listat laitetaan lists-tilaan:
        setLists(res.data);
      })
      .catch((error) => {
        // Näytetään käyttäjälle jos listojen hakeminen epäonnistui.
        console.error('Fetching lists failed: ', error.message);
        setError(true);
      });
  }, []);

  return (
    <div className="ownListsContainer">
      <div className="ownListsHeaderContainer">
        <h1>Omat listat</h1>
        <button className="buttonInvisible" onClick={addList}>
          + UUSI LISTA
        </button>
      </div>

      <AnimatePresence>
        {openModal && (
          <ListModal
            setOpenModal={setOpenModal}
            parsedUserData={userData}
            lists={lists}
            setLists={setLists}
          />
        )}
      </AnimatePresence>

      {error ? (
        <LoadingError subtext="Yritä myöhemmin uudelleen." />
      ) : (
        <div>
          {lists.length > 0 ? (
            <div>
              {lists.map((item, index) => {
                return (
                  <ListCard
                    key={index}
                    list={item}
                    lists={lists}
                    setLists={setLists}
                  />
                );
              })}
            </div>
          ) : (
            <p className="greyText centerText">
              Et ole lisännyt yhtään listaa.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnLists;
