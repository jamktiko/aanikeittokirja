import React from 'react';
import '../styles/ActionMenuContent.css';

const ListActionMenuContent = () => {
  return (
    <div className="actionMenuContent">
      <button className="buttonInvisible width100">
        <p className="actionMenuLink listMenuFirst">Muokkaa listaa</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p className="actionMenuLink">Poista lista</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p className="actionMenuLink listMenuLast">Jaa</p>
      </button>
    </div>
  );
};

export default ListActionMenuContent;
