import { React } from 'react';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import '../styles/RecipeSearchPage.css';

import fetchRecipes from '../hooks/fetchRecipes';

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  const { data, loading, error } = fetchRecipes('');

  // Väliaikainen latausnäkymä
  if (loading) return <h1>Loading...</h1>;

  // Väliaikainen virhenäkymä
  if (error) return <h1>error</h1>;

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
