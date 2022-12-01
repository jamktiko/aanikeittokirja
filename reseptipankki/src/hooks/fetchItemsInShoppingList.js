import { useEffect, useState } from 'react';
import axios from 'axios';

/*
Hook joka hakee kaikki ostoslistalla (id) olevat itemit.
*/
const fetchRecipesinList = (id) => {
  const [data, setData] = useState(null); // Hausta palautuva data.
  const [loading, setLoading] = useState(false); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines/ostoslista/${id}`
      )
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

export default fetchRecipesinList;
