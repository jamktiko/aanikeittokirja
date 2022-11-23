/* eslint-disable operator-linebreak */
import { React, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import '../styles/RecipeSearchPage.css';
import axios from 'axios';
import RecipeSearchFilters from './RecipeSearchFilters';
import DarkBG from './DarkBG';
import RecipeCardsList from './RecipeCardsList';

/*
Julkisten reseptien hakunäkymä. Sisältää hakukentän, johon voi kirjoittaa
hakusanoja tai lisätä suodattimia, ja sen alla lueteltuna kaikki löytyneet
reseptit.
*/
const RecipeSearchPage = () => {
  /*
  Hakusana säilötään sessionStorageen. Tässä hakusanan tilaan
  laitetaan joko storagessa oleva 'searchWord' tai tyhjä string
  jos storagessa ei ole mitään.
  */
  const [searchWord, setSearchWord] = useState(
    sessionStorage.getItem('searchWord')
      ? sessionStorage.getItem('searchWord')
      : ''
  );

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

  /*
  Erikoisruokavalioiden ja kategorioiden tilat. Kuten hakusana, myös
  ne on säilötty session storageen.
  */
  const [dietsState, setDiets] = useState(
    sessionStorage.getItem('dietsState') !== null
      ? JSON.parse(sessionStorage.getItem('dietsState'))
      : dietsObj
  );
  const [categoriesState, setCategories] = useState(
    sessionStorage.getItem('categoriesState') !== null
      ? JSON.parse(sessionStorage.getItem('categoriesState'))
      : categoriesObj
  );

  const [data, setData] = useState([]); // Hausta palautuva data.
  const [loading, setLoading] = useState(true); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  // Tila siitä onko suodatinvalikko auki:
  const [filterMenu, setFilterMenu] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  let offset = 0;

  // Vaihtaa suodatinvalikon tilan käänteiseksi.
  const toggleFilterMenu = () => {
    setFilterMenu(!filterMenu);
  };

  // Funktio, joka sisältää reseptidatan hakemisen.
  const useFetch = (startOver) => {
    if (offset === 0) setLoading(true);
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
      aloitus: offset,
    };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/resepti/search`,
        filterObject
      )
      .then((res) => {
        setError(null);

        if (startOver) {
          setData([...res.data]);
        } else {
          res.data.forEach((res) => {
            data.push(res);
          });

          setData([...data]);
        }
      })
      .catch((error) => {
        console.error('Error fetching recipes: ', error);
        setError(error);
      })
      .finally(() => {
        setInitialSearchDone(true);
        setLoading(false);
      });
  };

  // Funktio joka poistaa tietyn suodattimen (key);
  const removeFilter = async (key) => {
    setDiets({ ...dietsState, [key]: 0 });
    setCategories({ ...categoriesState, [key]: 0 });
    sessionStorage.setItem(
      'dietsState',
      JSON.stringify({ ...dietsState, [key]: 0 })
    );
    sessionStorage.setItem(
      'categoriesState',
      JSON.stringify({ ...categoriesState, [key]: 0 })
    );
  };

  const createListener = () => {
    window.addEventListener('scroll', handleScroll);
  };

  const deleteListener = () => {
    window.removeEventListener('scroll', handleScroll);
  };

  const resetEverything = () => {
    data.splice(0, data.length);
    setData(data);
    offset = 0;
  };

  useEffect(() => {
    sessionStorage.setItem('dietsState', JSON.stringify(dietsState));
    sessionStorage.setItem('categoriesState', JSON.stringify(categoriesState));

    resetEverything();

    createListener();

    if (initialSearchDone) {
      useFetch();
    }

    return () => {
      deleteListener();
    };
  }, [dietsState, categoriesState]);

  useEffect(() => {
    sessionStorage.setItem('searchWord', searchWord);

    resetEverything();

    createListener();

    const delaySearch = setTimeout(() => {
      useFetch();
    }, 500);
    return () => {
      clearTimeout(delaySearch);
      deleteListener();
    };
  }, [searchWord]);

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      offset += 10;
      useFetch(false);
    }
  };

  return (
    <div className="searchPageContainer">
      <SearchBar
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        toggleFilterMenu={toggleFilterMenu}
      />

      {/*
      Tässä laitetaan näkyviin kaikki categoriesState ja dietsState-
      objekteissa olevat avaimet, joiden arvo on 1, eli toisin sanoin
      päällä olevat suodattimet. Jokaiselle niistä luodaan p-elementti,
      jota klikkaamalla suodatin saadaan pois päältä.
      */}
      <div className="filterIndicators">
        {Object.keys({ ...categoriesState, ...dietsState }).map(
          (item, index) => {
            if (dietsState[item] === 1 || categoriesState[item] === 1) {
              return (
                <p
                  onClick={() => removeFilter(item)}
                  className="filterIndicator"
                  key={index}
                >
                  {item.replace(/_/g, ' ')} <span>✕</span>
                </p>
              );
            }
          }
        )}
      </div>

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
              recipes={data}
              setRecipes={setData}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <h2>Hae reseptejä</h2>

      <RecipeCardsList
        data={data}
        loading={loading}
        error={error}
        setRecipes={setData}
      />
    </div>
  );
};

export default RecipeSearchPage;
