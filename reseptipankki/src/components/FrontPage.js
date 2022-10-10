import React from 'react';
import Button from './Button';
import '../styles/FrontPage.css';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  return (
    <div className="frontPageContainer">
      Etusivu
      <div>
        <h2>Napit</h2>
        <Button color="primary" text="primary" />
        <br />
        <Button color="secondary" text="secondary" />
        <br />
        <Button color="warning" text="warning" />
      </div>
    </div>
  );
};

export default FrontPage;
