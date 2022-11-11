import React from 'react';
import fetchRecipesinList from '../hooks/fetchRecipesinList';
import Loading from './Loading';
import LoadingError from './LoadingError';
import RecipeCardsList from './RecipeCardsList';
import { BiDotsVerticalRounded } from 'react-icons/bi';

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
    return <LoadingError subtext="Listan reseptien hakeminen epäonnistui." />;
  }

  if (data) console.log('recipes: ', data);

  return (
    <div>
      {data ? (
        <div>
          <h2>{data[0].listan_nimi}</h2>

          <BiDotsVerticalRounded />

          <p>{data[0].kuvaus ? data[0].kuvaus : null}</p>

          {data && <RecipeCardsList data={data} />}
        </div>
      ) : null}
    </div>
  );
};

export default OwnList;
