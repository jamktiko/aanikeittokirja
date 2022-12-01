import React from 'react';
import '../styles/ShoppingLists.css';

/*
Näkymä käyttäjän ostoslistoille. Sisältää painikkee, josta uusi
ostoslista voidaan luoda, sekä kaikki käyttäjän ostoslistat.
*/
const ShoppingLists = () => {
  // Tieto, onko lisäysikkuna näkyvissä

  const addNew = () => {
    setOpenModal(true);
  };

  return (
    <div className="shoppingContainer">
      <div className="headLine">
        <div className="header">Ostoslistat</div>
        <div>
          <button onClick={addNew} className="buttonInvisible">
            + UUSI LISTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingLists;
