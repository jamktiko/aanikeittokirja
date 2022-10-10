import { useEffect } from 'react';
import axios from 'axios';

/*
Hook joka hakee reseptejä hakusanan ja erikoisruokavalioiden perusteella.
- searchWord-parametri on hakusana.
- diets-parametri on objekti, joka sisältää erikoisruokavaliot, esim:
 {
  kasvissyoja: 1,
  maidoton: 1,
 }
*/
const fetchRecipesSearch = (
  searchWord,
  diets,
  setData,
  setLoading,
  setError
) => {
  useEffect(() => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/search`, {
        hakusana: searchWord,
        erikoisruokavaliot: diets,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default fetchRecipesSearch;
