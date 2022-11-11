import { React, useState, useEffect } from 'react';
import Button from './Button';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import getUser from '../hooks/getUser';
import '../styles/UserPage.css';

const UserPage = () => {
  const [userData, setUserData] = useState();

  const navigate = useNavigate();

  // Valittavissa olevat erikoisruokavaliot:
  const dietsArray = [
    'kasvis',
    'vegaaninen',
    'gluteeniton',
    'maidoton',
    'laktoositon',
    'kananmunaton',
  ];

  // Objekti, johon lisätään avain-arvo pari jokaiselle erikoisruokavaliolle
  const dietsObj = {};

  // Erikoisruokavalioiden lisääminen äsken luotuun oletusarvolla 0.
  dietsArray.forEach((diet) => {
    dietsObj[diet] = 0;
  });

  // Funktio, joka kirjaa käyttäjän ulos.
  const logOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  /*
  Jos käyttäjän tiedot löytyivät localStoragesta, ne tulostetaan.
  Jos ei, siirrytään kirjautumissivulle.
  */
  useEffect(() => {
    const fetched = getUser();
    if (fetched) {
      console.log(fetched);
      setUserData(fetched?.idToken.payload);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="userPageContainer">
      <h1>Käyttäjän asetukset</h1>

      {userData ? (
        <div>
          <p>
            <span className="boldText">Etunimi</span>: {userData?.given_name}
          </p>

          <p>
            <span className="boldText">Sukunimi</span>: {userData?.family_name}
          </p>

          <div className="divider" />

          <h3>Erikoisruokavaliosi</h3>
          <p className="darkGreyText">
            Etusivun suositukset mukautetaan vastaamaan erikoisruokavalioitasi
          </p>

          <div className="checkboxGrid">
            {dietsArray.map((item, index) => {
              return (
                <div key={index} className="checkbox">
                  <input
                    type="checkbox"
                    id={`dietCheckbox${index}`}
                    onChange={() => console.log(item)}
                  />
                  <label htmlFor={`dietCheckbox${index}`}>{item}</label>
                </div>
              );
            })}
          </div>

          <div className="divider" />

          <div onClick={() => navigate('/uusi_salasana')}>
            <Button color="secondary" text="Vaihda salasana" type="button" />
          </div>

          <div onClick={() => logOut()}>
            <Button color="primary" text="Kirjaudu ulos" type="button" />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default UserPage;
