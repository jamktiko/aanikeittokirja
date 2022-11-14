import { React, useState, useEffect } from 'react';
import fetchRecipesinList from '../hooks/fetchRecipesinList';
import Loading from './Loading';
import LoadingError from './LoadingError';
import RecipeCardsList from './RecipeCardsList';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import ActionMenu from './ActionMenu';
import DarkBG from './DarkBG';
import Button from './Button';
import ListActionMenuContent from './ListActionMenuContent';
import axios from 'axios';
import '../styles/OwnList.css';

const OwnList = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);
  const [deletingMode, toggleDeletingMode] = useState(false);
  const [recipesToDelete, setRecipesToDelete] = useState([]);

  // Käyttäjän RDS-tietokannasta saatavat tiedot laitetaan tähän tilaan:
  const [rdsAccount, setRdsAccount] = useState();

  const editRecipesToDelete = (recipeId) => {
    let copy = [...recipesToDelete];
    if (!recipesToDelete.includes(recipeId)) {
      copy.push(recipeId);

      setRecipesToDelete([...copy]);
    } else {
      copy = copy.filter((i) => {
        return i !== recipeId;
      });

      setRecipesToDelete([...copy]);
    }
  };

  // UseEffectissä ladataan käyttäjän k_id, jotta voidaan
  // tarkistaa onko resepti käyttäjän oma vai jonkun muun.
  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);
    // ...josta saadaan cognito_id, millä voidaan hakea
    // käyttäjän ID rds-tietokannassa.
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        setRdsAccount(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Reseptin ID saadaan URL:n lopusta.
  const listId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  // Reseptien hakeminen hookilla. Vain ID:n mukainen resepti haetaan.
  const { data, loading, error } = fetchRecipesinList(listId);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) {
    return <LoadingError subtext="Listan reseptien hakeminen epäonnistui." />;
  }

  return (
    <div>
      {data ? (
        <div className="ownListContainer">
          <div className="listInfoContainer">
            <div className="listInfoText">
              <h2>{data[0].listan_nimi}</h2>

              <p>{data[0].kuvaus ? data[0].kuvaus : null}</p>
            </div>

            {rdsAccount[0]?.k_id === data[0].Kayttaja_k_id ? (
              <BiDotsVerticalRounded
                onClick={() => toggleMenuOpen(!menuOpen)}
              />
            ) : null}
          </div>

          <AnimatePresence>
            {deletingMode ? (
              <motion.div
                key="deleteRecipesFromList"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                exit={{ opacity: 0 }}
              >
                <h4>Valitse poistettavat reseptit:</h4>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {data && data.length !== 0 && data[0].r_id !== null ? (
            <RecipeCardsList
              deletingMode={deletingMode}
              data={data}
              editRecipesToDelete={editRecipesToDelete}
              recipesToDelete={recipesToDelete}
            />
          ) : (
            <h4 className="darkGreyText centerText">
              Listalla ei ole reseptejä.
            </h4>
          )}

          <AnimatePresence>
            {menuOpen ? (
              <div>
                <DarkBG toggleMenu={toggleMenuOpen} z={3} />
                <ActionMenu
                  menuContent={
                    <ListActionMenuContent
                      toggleMenu={toggleMenuOpen}
                      deletingMode={deletingMode}
                      toggleDeletingMode={toggleDeletingMode}
                      id={listId}
                      openedFromListPage={true}
                      name={data[0].listan_nimi}
                      desc={data[0].kuvaus}
                    />
                  }
                />
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      <AnimatePresence>
        {deletingMode ? (
          <motion.div
            key="deleteRecipesFromList"
            initial={{ y: 500 }} // Näkymän sijainti ennen animaatiota
            animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
            transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto, pehmennys
            exit={{ y: 500 }} // Sijainti johon näkymää menee kadotessaan.
            className="deleteRecipesFromListContainer"
          >
            <div className="deleteRecipesFromList">
              <h4>Reseptejä valittu: {recipesToDelete.length} kpl</h4>
              <div onClick={() => console.log(recipesToDelete)}>
                <Button color="warning" text="Poista" type="button" />
              </div>

              <div
                onClick={() => {
                  setRecipesToDelete([]);
                  toggleDeletingMode(false);
                }}
              >
                <Button color="secondary" text="Peruuta" type="button" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default OwnList;
