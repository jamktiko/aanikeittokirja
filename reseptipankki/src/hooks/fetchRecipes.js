import { useEffect, useState } from 'react';
import axios from 'axios';

/*
Hook joka hakee kaikki reseptejä backendistä. Parametrillä
voidaan tarkentaa hakua:
- id: hook hakee vain kyseisen id:n reseptin.
- public: hook hakee vain julkiset reseptit.
*/
const fetchRecipes = (param) => {
  const [data, setData] = useState(null); // Hausta palautuva data.
  const [loading, setLoading] = useState(false); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/resepti/${param}`)
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
