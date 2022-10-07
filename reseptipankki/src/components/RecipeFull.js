import React from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';

import fetchRecipes from '../hooks/fetchRecipes';

/*
Reseptinäkymä, eli sivu jossa on yhden reseptin kaikki tiedot yms.
*/
const RecipeFull = () => {
  // Reseptin ID saadaan URL:n lopusta.
  const recipeId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );

  // Reseptien hakeminen hookilla. Vain ID:n mukainen resepti haetaan.
  const { data, loading, error } = fetchRecipes(recipeId);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) return <LoadingError />;

  return (
    <div>
      <h2>Reseptinäkymä</h2>
      <p>Nimi: {data?.nimi}</p>
    </div>
  );
};

export default RecipeFull;
