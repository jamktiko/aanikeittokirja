import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/ListRecipeAdd.css';
import DarkBG from './DarkBG';
import axios from 'axios';
import { motion } from 'framer-motion';
import getUserRefresh from '../hooks/getUserRefresh';

const ListRecipeAdd = ({ recipeId, toggleMenu }) => {
  const [lists, setLists] = useState([]);

  const addToList = async (id) => {
    // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit.
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;

    const listRecipeObject = {
      Lista_l_id: id,
      Resepti_r_id: recipeId,
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/lista_has_resepti/`,
        listRecipeObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            cognitoId: parsedData.idToken.payload.sub,
          },
        }
      )
      .then((res) => {
        toggleMenu(false);
      })
      .catch((error) => {
        console.error('Error adding recipe to list: ', error);
        // TO DO: Jos resepti on jo listalla, ilmoita siitä käyttäjälle!
      });
  };

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userData);
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
      })
      .catch((error) => {
        /*
        Virheilmoitus tulostetaan vain jos virhe on muu kuin se, että
        listoja ei ole, eli 404.
        */
        if (error.response?.status !== 404) {
          console.error('Error fetching lists: ', error);
        }
      });
  }, []);

  return (
    <div>
      <DarkBG toggleMenu={toggleMenu} z={94} />
      <motion.div
        key="listRecipeAddMenu"
        initial={{ y: 500 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto ja pehmennys
        exit={{ y: 500 }} // Sijainti johon näkymää menee kadotessaan.
        className="listRecipeAddContainer"
      >
        <h3>Lisää listalle:</h3>

        {lists.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => addToList(item.l_id)}
              className="buttonInvisible listRecipeAddButton"
            >
              <p>{item.nimi}</p>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

// ToggleMenun tyypittäminen funktioksi.
ListRecipeAdd.propTypes = {
  recipeId: PropTypes.any,
  toggleMenu: PropTypes.func,
};

export default ListRecipeAdd;
