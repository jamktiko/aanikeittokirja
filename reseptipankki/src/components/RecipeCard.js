/* eslint-disable operator-linebreak */
import { React } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipeCard.css';

/*
RecipeCard on komponentti reseptien pienemmille näkymille, eli niille joita
on esimerkiksi hakusivulla ja omissa resepteissä. RecipeCard toimii myös
linkkinä kyseisen reseptin täydelle reseptisivulle.
*/
const RecipeCard = ({
  data,
  deletingMode,
  editRecipesToDelete,
  recipesToDelete,
}) => {
  const recipe = JSON.parse(data);
  const navigate = useNavigate();

  const selected = recipesToDelete.includes(recipe.r_id);

  const cardClicked = () => {
    if (!deletingMode) {
      navigate(`/reseptit/${recipe.r_id}`);
    } else {
      editRecipesToDelete(recipe.r_id);
    }
  };

  return (
    <div
      onClick={cardClicked}
      className={`backgroundSecondaryColor cardContainer ${
        selected ? 'cardSelected' : ''
      }`}
    >
      <div className="cardTexts">
        <h3>{recipe.nimi}</h3>
        <p>{recipe.valmistusaika}</p>
      </div>
      <div className="cardImageDiv">
        <img
          src={recipe.kuva ? recipe.kuva : require('../assets/placeholder.png')}
        />
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  data: PropTypes.any,
  deletingMode: PropTypes.bool,
  editRecipesToDelete: PropTypes.func,
  recipesToDelete: PropTypes.any,
};

export default RecipeCard;
