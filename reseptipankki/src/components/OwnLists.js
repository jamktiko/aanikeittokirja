import { React, useEffect, useState } from 'react';
import ListModal from './ListModal.js';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [userData, setUserData] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const addList = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userData);
    setUserData(parsedUserData);
  }, []);

  return (
    <div>
      <h1>Omat listat</h1>
      <button onClick={addList}>+ UUSI LISTA</button>
      {openModal && (
        <ListModal setOpenModal={setOpenModal} parsedUserData={userData} />
      )}
    </div>
  );
};

export default OwnLists;
