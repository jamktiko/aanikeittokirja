import React from 'react';
// import Button from './Button';
import '../styles/FrontPage.css';

/*
Etusivun komponentti. Sisältää tervehdyksen käyttäjälle,
vaakasuuntaisen viimeksi katsottujen reseptien listan sekä
suositeltujen reseptien listan.
*/
const FrontPage = () => {
  // Ladataan käyttäjätiedot localStoragesta...
  const userData = localStorage.getItem('user');
  // ...ja muunnetaan ne takaisin objektiksi.
  const parsedData = JSON.parse(userData);

  if (parsedData) console.log(parsedData);

  return (
    <div className="frontPageContainer">
      {parsedData ? (
        <h3>Hei {parsedData?.idToken.payload.given_name}!</h3>
      ) : (
        <p>Etusivu</p>
      )}

      {/*
        <div>
        <h2>Napit</h2>
        <Button color="primary" text="primary" />
        <br />
        <Button color="secondary" text="secondary" />
        <br />
        <Button color="warning" text="warning" />
      </div>
      */}
    </div>
  );
};

export default FrontPage;
