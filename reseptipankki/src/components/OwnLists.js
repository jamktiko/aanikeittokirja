import { React, useState } from 'react';
import Modal from './ListModal.js';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [openModal, setOpenModal] = useState(false);

  const addList = () => {
    setOpenModal(true);
  };

  return (
    <div>
      <h1>Omat listat</h1>
      <button onClick={addList}>+ UUSI LISTA</button>
      {openModal && <Modal setOpenModal={setOpenModal} />}
    </div>
  );
};

export default OwnLists;
