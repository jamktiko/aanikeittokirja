import { React } from 'react';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import Loading from './Loading';
import LoadingError from './LoadingError';
import '../styles/RecipeSearchPage.css';

import fetchRecipes from '../hooks/fetchRecipes';

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  /*
  Reseptien hakeminen hookilla. Id-parametrin tilalla
  on '', eli kaikki reseptit haetaan.
  */
  const { data, loading, error } = fetchRecipes('');

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) return <LoadingError />;

  return (
    <div className="recipeSearchContainer">
      <SearchBar />
      <h2>Reseptit</h2>
      {/*
      Data on haussa tullut taulukko, jossa on reseptit.
      Tässä käydään jokainen resepti läpi ja luodaan niille oma
      RecipeCard-komponentti.
      */}
      {data?.map((item, index) => {
        return <RecipeCard key={index} data={JSON.stringify(item)} />;
      })}
    </div>
  );
};

export default RecipeSearchPage;
