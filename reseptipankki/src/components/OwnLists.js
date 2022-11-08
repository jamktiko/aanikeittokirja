import { React, useState } from 'react';
import Modal from './Modal.js';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  const [openModal, setOpenModal] = useState(false);

  /* setOpenModal tila on oletuksena false, tämä funktio aktivoituu
  napin painalluksella ja muuttaa tilaan true, jolloin modal ikkuna
  muuttuu näkyväksi */

  const addList = () => {
    setOpenModal(true);
  };

  return (
    <div>
      <h1>Omat listat</h1>
      <button onClick={addList}>+ UUSI LISTA</button>
      {openModal && <Modal closeModal={setOpenModal} />}
    </div>
  );
};

export default OwnLists;
