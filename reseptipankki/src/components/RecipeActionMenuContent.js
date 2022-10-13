/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BiStar } from 'react-icons/bi';
import '../styles/RecipeActionMenuContent.css';

import axios from 'axios';

const RecipeActionMenuContent = ({ recipeId }) => {
  // Luodaan funktio, jolla voidaan navigoida eri sivuille.
  // Tässä tapauksessa hakuun reseptin poistamisen jälkeen.
  const navigate = useNavigate();

  // Tila siitä onko reseptin poistamisvalikko auki.
  const [deleteOptionOpen, toggleOpen] = useState(false);

  // Funktio joka poistaa reseptin.
  const deleteRecipe = () => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/${recipeId}`)
      .then((res) => {
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Muokkaa {deleteOptionOpen}</p>
      </button>

      <div className="divider" />

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

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää omiin resepteihin</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää listalle</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää ostoslistalle</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Jaa</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Ilmianna</p>
      </button>
    </div>
  );
};

// parametrin tyypitys
RecipeActionMenuContent.propTypes = {
  recipeId: PropTypes.string,
};

export default RecipeActionMenuContent;
