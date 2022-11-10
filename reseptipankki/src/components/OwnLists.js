/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import axios from 'axios';

import ListCard from './ListCard.js';
import ListModal from './ListModal.js';
import { AnimatePresence } from 'framer-motion';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [userData, setUserData] = useState();
  const [openModal, setOpenModal] = useState();
  const [lists, setLists] = useState([]);

  // Funktio joka avaa listan lisäysmodaalin.
  const addList = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userData);
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
        /*
        Virheilmoitus tulostetaan vain jos virhe on muu kuin se, että
        listoja ei ole, eli 404.
        */
        if (error.response.status !== 404) {
          console.error('Error fetching lists: ', error);
        }
      });
  }, []);

  return (
    <div>
      <h1>Omat listat</h1>
      <button onClick={addList}>+ UUSI LISTA</button>
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

      {lists.map((item, index) => {
        return <ListCard key={index} list={item} />;
      })}
    </div>
  );
};

export default OwnLists;
