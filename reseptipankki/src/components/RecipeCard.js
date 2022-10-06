import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/RecipeCard.css';

/*
RecipeCard on komponentti reseptien pienemmille näkymille, eli niille joita
on esimerkiksi hakusivulla ja omissa resepteissä. RecipeCard toimii myös
linkkinä kyseisen reseptin täydelle reseptisivulle.
*/
const RecipeCard = ({ data }) => {
  const recipe = JSON.parse(data);

  return (
    <Link
      to={`/reseptit/${recipe.r_id}`}
      className="backgroundSecondaryColor cardContainer"
    >
      <div className="cardTexts">
        <h3>{recipe.nimi}</h3>
        <p>{recipe.valmistusaika}</p>
      </div>
      <div className="cardImageDiv">
        <img src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
      </div>
    </Link>
  );
};

RecipeCard.propTypes = {
  data: PropTypes.any,
};

export default RecipeCard;
