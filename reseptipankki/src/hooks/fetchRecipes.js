import { useEffect, useState } from 'react';
import axios from 'axios';

/*
Hook joka hakee reseptejä backendistä. recipeId on valinnainen
parametri. Jos sen lisää, haetaan vain kyseisen ID:n mukainen resepti.
*/
const fetchRecipes = (recipeId) => {
  const [data, setData] = useState(null); // Hausta palautuva data.
  const [loading, setLoading] = useState(false); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/${recipeId}`)
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

export default fetchRecipes;
