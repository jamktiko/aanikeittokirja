import { React, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import Loading from './Loading';
import LoadingError from './LoadingError';
import '../styles/RecipeSearchPage.css';
import axios from 'axios';
import RecipeSearchFilters from './RecipeSearchFilters';
import DarkBG from './DarkBG';

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
  const [searchWord, setSearchWord] = useState(''); // Hakusanan tila.
  const [data, setData] = useState(null); // Hausta palautuva data.
  const [loading, setLoading] = useState(false); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  // Tila siitä onko suodatinvalikko auki:
  const [filterMenu, setFilterMenu] = useState(false);

  // Vaihtaa suodatinvalikon tilan käänteiseksi.
  const toggleFilterMenu = () => {
    setFilterMenu(!filterMenu);
  };

  // Funktio, joka sisältää reseptidatan hakemisen.
  const useFetch = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/search`, {
        hakusana: searchWord,
        erikoisruokavaliot: null,
      })
      .then((res) => {
        setError(null);
        setData(res.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // UseEffectin ansiosta sivulla näkyvä data päivittyy kun hakusana vaihtuu.
  useEffect(() => {
    if (!searchWord) {
      useFetch();
      return;
    }

    setLoading(true);
    const delaySearch = setTimeout(() => {
      useFetch();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchWord]);

  return (
    <div className="searchPageContainer">
      <SearchBar
        setSearchWord={setSearchWord}
        toggleFilterMenu={toggleFilterMenu}
      />

      {/* AnimatePresence tarvitaan valikon animaatioihin */}
      <AnimatePresence>
        {filterMenu ? (
          <div>
            <DarkBG toggleMenu={toggleFilterMenu} />
            <RecipeSearchFilters toggleFilterMenu={toggleFilterMenu} />
          </div>
        ) : null}
      </AnimatePresence>

      <h2>Reseptit</h2>

      <SearchResults data={data} loading={loading} error={error} />
    </div>
  );
};

export default RecipeSearchPage;
