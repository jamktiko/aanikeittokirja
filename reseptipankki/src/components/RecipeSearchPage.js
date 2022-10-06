import { React, useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import '../styles/RecipeSearchPage.css';

// Feikkidataa:
// const fakeRecipes = require('./_FAKE_DATA.json');

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resepti`)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
      });
  }, []);

  const recipes = data;
  return (
    <div className="recipeSearchContainer">
      <SearchBar />
      <h2>Reseptit</h2>
      {recipes.map((item, index) => {
        return <RecipeCard key={index} data={JSON.stringify(item)} />;
      })}
    </div>
  );
};

export default RecipeSearchPage;
