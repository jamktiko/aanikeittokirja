import React from 'react';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';

// Feikkidataa:
const fakeRecipes = require('./_FAKE_DATA.json');

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  const recipes = fakeRecipes.recipes;
  return (
    <div>
      <SearchBar />
      <h2>Reseptit</h2>
      {recipes.map((item, index) => {
        return <RecipeCard key={index} data={JSON.stringify(item)} />;
      })}
    </div>
  );
};

export default RecipeSearchPage;
