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
  if (props.loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (props.error || props.data?.errno) {
    return <LoadingError subtext="Yritä hetken kuluttua uudelleen." />;
  }

  console.log('poisto: ', props.deletingMode);

  return (
    <div className="recipeSearchContainer">
      {/*
      Data on haussa tullut taulukko, jossa on reseptit.
      Tässä käydään jokainen resepti läpi ja luodaan niille oma
      RecipeCard-komponentti.
      */}
      {props.data !== undefined && props.data?.length !== 0 ? (
        props.data?.map((item, index) => {
          if (item.nimi === null) return;
          return <RecipeCard key={index} data={JSON.stringify(item)} />;
        })
      ) : (
        <LoadingNoResults />
      )}
    </div>
  );
};

// Parametrien tyypitykset.
RecipeCardsList.propTypes = {
  data: PropTypes.any,
  loading: PropTypes.any,
  error: PropTypes.any,
  deletingMode: PropTypes.bool,
};

export default RecipeCardsList;
