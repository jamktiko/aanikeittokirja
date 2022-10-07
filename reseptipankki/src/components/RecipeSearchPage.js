import { React, useState } from 'react';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import Loading from './Loading';
import LoadingError from './LoadingError';
import '../styles/RecipeSearchPage.css';

import fetchRecipes from '../hooks/fetchRecipes';

/*
SearchResults on tämän tiedoston varsinaisen komponentin,
RecipeSearchPagen, lapsikomponentti, jossa näytetään haun
tulokset.
*/
const SearchResults = (data) => {
  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (data.loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (data.error) return <LoadingError />;

  return (
    <div className="recipeSearchContainer">
      {/*
      Data on haussa tullut taulukko, jossa on reseptit.
      Tässä käydään jokainen resepti läpi ja luodaan niille oma
      RecipeCard-komponentti.
      */}
      {data.data?.map((item, index) => {
        return <RecipeCard key={index} data={JSON.stringify(item)} />;
      })}
    </div>
  );
};

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  // Hakusanan tila.
  const [searchWord, setSearchWord] = useState('');

  /*
  Tarkistetaan, onko hakukenttään kirjoitettu jotain.
  Jos on, haetaan reseptit, jotka täyttävät hakusanan.
  Jos ei, haetaan kaikki julkiset reseptit.
  */
  if (searchWord !== null && searchWord.length > 0) {
    console.log('Hakusana: ', searchWord);
    const { data, loading, error } = fetchRecipes('search');

    console.log(data);

    return (
      <div>
        <SearchBar setSearchWord={setSearchWord} />
        <h2>Reseptit {searchWord}</h2>
        <SearchResults data={data} loading={loading} error={error} />
      </div>
    );
  } else {
    const { data, loading, error } = fetchRecipes('search');

    return (
      <div>
        <SearchBar setSearchWord={setSearchWord} />
        <h2>Reseptit</h2>
        <SearchResults data={data} loading={loading} error={error} />
      </div>
    );
  }
};

export default RecipeSearchPage;
