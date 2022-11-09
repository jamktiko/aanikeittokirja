import React from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import LoadingNoResults from './LoadingNoResults';
import RecipeCard from './RecipeCard';

/*
Tämä on komponentti, jossa luodaan luettelo reseptikortteja
data-parametrinä tulevan taulukon resepteistä. Käytetään
sekä hakutulosten että suositeltujen reseptien näyttämiseen.
*/
const RecipeCardsList = (data) => {
  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (data.loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (data.error || data.data?.errno) return <LoadingError />;

  console.log('data: ', data);

  return (
    <div className="recipeSearchContainer">
      {/*
      Data on haussa tullut taulukko, jossa on reseptit.
      Tässä käydään jokainen resepti läpi ja luodaan niille oma
      RecipeCard-komponentti.
      */}
      {data.data !== undefined && data.data?.length !== 0 ? (
        data.data?.map((item, index) => {
          return <RecipeCard key={index} data={JSON.stringify(item)} />;
        })
      ) : (
        <LoadingNoResults />
      )}
    </div>
  );
};

export default RecipeCardsList;
