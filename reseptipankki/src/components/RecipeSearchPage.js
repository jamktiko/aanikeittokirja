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
  const [searchWord, setSearchWord] = useState('');

  // Suodattimessa valittavat kategoriat:
  const categoriesArray = [
    'alkuruoat',
    'pääruoat',
    'jälkiruoat',
    'välipalat',
    'makeat_leivonnaiset',
    'suolaiset_leivonnaiset',
    'keitot',
    'salaatit',
    'juomat',
    'lisukkeet',
  ];

  // Suodattimessa valittavat erikoisruokavaliot:
  const dietsArray = [
    'kasvis',
    'vegaaninen',
    'gluteeniton',
    'maidoton',
    'laktoositon',
    'kananmunaton',
  ];

  /*
  Objektit, joihin lisätään avain-arvo pari jokaiselle erikoisruokavaliolle
  ja kategorialle.
  */
  const dietsObj = {};
  const categoriesObj = {};

  /*
  Erikoisruokavalioiden ja kategorioiden lisääminen omiin äsken luotuihin
  objekteihinsa, oletusarvolla 0.
  */
  dietsArray.forEach((diet) => {
    dietsObj[diet] = 0;
  });
  categoriesArray.forEach((diet) => {
    categoriesObj[diet] = 0;
  });

  // Erikoisruokavalioiden ja kategorioiden tilat:
  const [dietsState, setDiets] = useState(dietsObj);
  const [categoriesState, setCategories] = useState(categoriesObj);

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
    /*
    Koska päätimmekin, että truet erikoisruokavaliot ja kategoriat pitää
    saada backendiin taulukossa, tässä ne laitetaan taulukoihin:
    */
    let diets = [];
    for (const [key, value] of Object.entries(dietsState)) {
      if (value === 1) diets.push(key);
    }

    let categories = [];
    for (const [key, value] of Object.entries(categoriesState)) {
      if (value === 1) categories.push(key);
    }
    if (diets.length === 0) diets = null;
    if (categories.length === 0) categories = null;

    // Luodaan axios-pyyntöön liitettävä objekti:
    const filterObject = {
      hakusana: searchWord,
      erikoisruokavaliot: diets,
      kategoriat: categories,
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/resepti/search`,
        filterObject
      )
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
            <RecipeSearchFilters
              toggleFilterMenu={toggleFilterMenu}
              setCategories={setCategories}
              categoriesState={categoriesState}
              setDiets={setDiets}
              dietsState={dietsState}
              dietsArray={dietsArray}
              categoriesArray={categoriesArray}
              useFetch={useFetch}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <h2>Reseptit</h2>

      <SearchResults data={data} loading={loading} error={error} />
    </div>
  );
};

export default RecipeSearchPage;
