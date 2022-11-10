/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import axios from 'axios';

import ListCard from './ListCard.js';
import ListModal from './ListModal.js';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [userData, setUserData] = useState();
  const [openModal, setOpenModal] = useState();
  const [lists, setLists] = useState([]);

  const addList = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userData);
    setUserData(parsedUserData);

    const cognitoId = parsedUserData.idToken.payload.sub;

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/lista/kayttaja/${cognitoId}`
      )
      .then((res) => {
        setLists(res.data);
      })
      .catch((error) => {
        console.error('Error fetching lists: ', error);
      });
  }, []);

  return (
    <div>
      <h1>Omat listat</h1>
      <button onClick={addList}>+ UUSI LISTA</button>
      {openModal && (
        <ListModal setOpenModal={setOpenModal} parsedUserData={userData} />
      )}
      {lists.map((item, index) => {
        return <ListCard key={index} list={item} />;
      })}
    </div>
  );
};

export default OwnLists;
