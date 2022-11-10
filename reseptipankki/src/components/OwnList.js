import React from 'react';
import fetchRecipesinList from '../hooks/fetchRecipesinList';
import Loading from './Loading';
import LoadingError from './LoadingError';

const OwnList = () => {
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
    return <LoadingError subtext="Listan reseptin hakeminen epäonnistui" />;
  }

  console.log(data);

  return (
    <div>
      <div>
        <p>Lista</p>
      </div>
      <div></div>
    </div>
  );
};

export default OwnList;
