/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import axios from 'axios';
import ListCard from './ListCard.js';
import ListModal from './ListModal.js';
import LoadingError from './LoadingError.js';
import Loading from './Loading.js';
import { AnimatePresence } from 'framer-motion';
import '../styles/OwnLists.css';

/*
Käyttäjän omien listojen sivun komponentti. Sisältää napin, josta
avautuu listanlisäysikkuna, sekä kaikki käyttäjän listat.
*/
const OwnLists = () => {
  // Tila johon käyttäjän tiedot laitetaan:
  const [userData, setUserData] = useState();
  // Tieto onko listanlisäysikkuna näkyvissä:
  const [openModal, setOpenModal] = useState(false);
  // Tila johon laitetaan näytettävät listat:
  const [lists, setLists] = useState();
  // Tila siitä onko virhettä tapahtunut:
  const [error, setError] = useState(null);
  // Tila siitä onko lataus vielä käynnissä:
  const [loading, setLoading] = useState(true);

  // Funktio joka avaa listan lisäysmodaalin.
  const addList = () => {
    setOpenModal(true);
  };

  // Kun sivu on latautunut, haetaan käyttäjän tiedot ja listat:
  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userDataLS = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userDataLS);
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
        setLoading(false);
      })
      .catch((error) => {
        // Näytetään käyttäjälle jos listojen hakeminen epäonnistui.
        console.error('Fetching lists failed: ', error.message);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="ownListsContainer">
      <div className="ownListsHeaderContainer">
        <h1>Omat listat</h1>
        <button className="buttonInvisible" onClick={addList}>
          + UUSI LISTA
        </button>
      </div>

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

      {/* Jos lataus on kesken, näytetään latausikonia */}
      {!loading ? (
        <div>
          {/*
          Kun lataus on valmis, katsotaan tuliko erroria.
          Jos tuli, se näytetään, jos ei näytetään listat
          */}
          {error ? (
            <LoadingError subtext="Yritä myöhemmin uudelleen." />
          ) : (
            <div>
              {lists.length > 0 ? (
                <div>
                  {lists.map((item, index) => {
                    return (
                      <ListCard
                        key={index}
                        list={item}
                        lists={lists}
                        setLists={setLists}
                      />
                    );
                  })}
                </div>
              ) : (
                <div>
                  <p className="greyText centerText">
                    Et ole lisännyt yhtään listaa.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default OwnLists;
