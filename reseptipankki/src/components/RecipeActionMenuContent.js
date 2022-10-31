/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { BiStar } from 'react-icons/bi';
import '../styles/RecipeActionMenuContent.css';

import axios from 'axios';

const RecipeActionMenuContent = ({ recipeData, ingredientsData }) => {
  // Luodaan funktio, jolla voidaan navigoida eri sivuille.
  // Tässä tapauksessa hakuun reseptin poistamisen jälkeen.
  const navigate = useNavigate();

  // Tila siitä onko reseptin poistamisvalikko auki.
  const [deleteOptionOpen, toggleOpen] = useState(false);

  // Käyttäjän RDS-tietokannasta saatavat tiedot laitetaan tähän tilaan:
  const [rdsAccount, setRdsAccount] = useState();

  // Funktio joka poistaa reseptin.
  const deleteRecipe = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/resepti/
      ${recipeData.r_id}`
      )
      .then((res) => {
        navigate(-1, { state: { editMode: false } });
      })
      .catch((error) => {
        console.error(error);
      });
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

  return (
    <div className="recipeActionMenuContent">
      <p>Arvostele resepti</p>

      <div className="starReviewContainer">
        <BiStar />
        <BiStar />
        <BiStar />
        <BiStar />
        <BiStar />
      </div>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <Link
          className="actionMenuLink"
          to={'/muokkaa'}
          state={{
            recipeData: recipeData,
            ingredientsData: ingredientsData,
            editMode: true,
          }}
        >
          <p>Muokkaa</p>
        </Link>
      </button>

      <div className="divider" />

      {/*
      - Jos reseptin lisännyt käyttäjä on sama kuin joka on kirjautunut
      sovellukseen, näytetään reseptin poistamisnappi.
      - Jos resepti ei ole kirjautuneen käyttäjän lisäämä, näytetään sen
      paikalla "Lisää omiin resepteihin" -nappi. Sitä ei tarvitse näyttää
      käyttäjän omissa resepteissä, sillä käyttäjän itse lisäämät reseptit
      löytyvät aina hänen Omista Resepteistään.
      */}
      {rdsAccount && rdsAccount[0].k_id === recipeData?.Kayttaja_k_id ? (
        <div>
          {deleteOptionOpen ? (
            <div>
              <p>Haluatko varmasti poistaa reseptin?</p>
              <div className="twoButtonsDiv">
                <div onClick={() => toggleOpen(!deleteOptionOpen)}>
                  <Button color={'secondary'} text={'Peruuta'} />
                </div>

                <div onClick={() => deleteRecipe()}>
                  <Button color={'warning'} text={'Poista'} />
                </div>
              </div>
            </div>
          ) : (
            <button
              className="buttonInvisible width100"
              onClick={() => toggleOpen(!deleteOptionOpen)}
            >
              <p>Poista</p>
            </button>
          )}

          <div className="divider" />
        </div>
      ) : (
        <div>
          <button className="buttonInvisible width100">
            <p>Lisää omiin resepteihin</p>
          </button>

          <div className="divider" />
        </div>
      )}

      <button className="buttonInvisible width100">
        <p>Lisää listalle</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p>Lisää ostoslistalle</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p>Jaa</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p>Ilmianna</p>
      </button>
    </div>
  );
};

// parametrin tyypitys
RecipeActionMenuContent.propTypes = {
  recipeData: PropTypes.object,
  ingredientsData: PropTypes.array,
};

export default RecipeActionMenuContent;
