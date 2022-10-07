import React from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import '../styles/RecipeFull.css';

import { BiDotsVerticalRounded } from 'react-icons/bi';
import fetchRecipes from '../hooks/fetchRecipes';

// Reseptinäkymä, eli sivu jossa on yhden reseptin kaikki tiedot yms.
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

  console.log(data);

  return (
    <div>
      <div className="recipeContainer">
        <div className="recipeImageContainer">
          <img className="recipeImage" src={data?.kuva} />
        </div>

        <div className="recipeTitleContainer">
          <h2>
            {data?.nimi}{' '}
            <span className="recipeTime">{`(${data?.valmistusaika})`}</span>
          </h2>

          <BiDotsVerticalRounded />
        </div>

        <div className="ingredientsContainer">
          <h3>
            Ainekset <span>{`(${data?.annosten_maara} annosta)`}</span>
          </h3>
          {/* Tähän ainekset kun ne saadaan backendistä */}
          <p>...</p>
        </div>

        <div className="directionsContainer">
          <h3>Ohjeet</h3>
          <p>{data?.ohjeet}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeFull;
