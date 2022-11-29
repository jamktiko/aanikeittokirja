/* eslint-disable indent */
import React from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import LoadingNoResults from './LoadingNoResults';
import RecipeCard from './RecipeCard';
import PropTypes from 'prop-types';

/*
Tämä on komponentti, jossa luodaan luettelo reseptikortteja
data-parametrinä tulevan taulukon resepteistä. Käytetään
sekä hakutulosten että suositeltujen reseptien näyttämiseen.
*/
const RecipeCardsList = (props) => {
  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (!props || props.loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (props.error) {
    return <LoadingError subtext="Yritä hetken kuluttua uudelleen." />;
  }

  return (
    <div className="recipeSearchContainer">
      {/*
      Data on haussa tullut taulukko, jossa on reseptit.
      Tässä käydään jokainen resepti läpi ja luodaan niille oma
      RecipeCard-komponentti.
      */}
      {!props.loading && props.data ? (
        <div>
          {props.data && props.data?.length > 0 ? (
            <div>
              {props.data?.map((item, index) => {
                if (item.nimi === null) return;
                return (
                  <RecipeCard
                    key={index}
                    deletingMode={props.deletingMode}
                    toggleDeletingMode={props.toggleDeletingMode}
                    editRecipesToDelete={props.editRecipesToDelete}
                    recipesToDelete={props.recipesToDelete}
                    data={JSON.stringify(item)}
                    recipes={props.data ? props.data : props.recipes}
                    setRecipes={props.setRecipes}
                    mealPlannerDate={props.mealPlannerDate}
                    mealPlannerKId={props.mealPlannerKId}
                  />
                );
              })}
            </div>
          ) : (
            <LoadingNoResults subtext={props.customSubtext} />
          )}
        </div>
      ) : null}
    </div>
  );
};

// Parametrien tyypitykset.
RecipeCardsList.propTypes = {
  data: PropTypes.any,
  loading: PropTypes.any,
  error: PropTypes.any,
  deletingMode: PropTypes.bool,
  toggleDeletingMode: PropTypes.func,
  editRecipesToDelete: PropTypes.func,
  recipesToDelete: PropTypes.any,
  recipes: PropTypes.any,
  setRecipes: PropTypes.func,
  mealPlannerDate: PropTypes.any,
  mealPlannerKId: PropTypes.number,
  customSubtext: PropTypes.string,
};

export default RecipeCardsList;
