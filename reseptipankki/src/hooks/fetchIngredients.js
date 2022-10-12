import { useEffect, useState } from 'react';
import axios from 'axios';

/*
Hook joka hakee tietyn reseptin aineosat id:n perusteella.
*/
const fetchIngredients = (recipeId) => {
  // Hausta palautuva data.
  const [ingredientsData, setData] = useState(null);
  // Tieto, onko haku käynnissä.
  const [ingredientsLoading, setLoading] = useState(false);
  // Haun mahdollinen virheviesti.
  const [ingredientsError, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/aines/resepti/${recipeId}`)
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

  return { ingredientsData, ingredientsLoading, ingredientsError };
};

export default fetchIngredients;
