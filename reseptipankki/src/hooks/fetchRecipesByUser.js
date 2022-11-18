import { useEffect, useState } from 'react';
import getUserRefresh from './getUserRefresh';
import axios from 'axios';

const fetchRecipesByUser = () => {
  const [data, setData] = useState(null); // Hausta palautuva data.
  const [loading, setLoading] = useState(false); // Tieto, onko haku käynnissä.
  const [error, setError] = useState(null); // Haun mahdollinen virheviesti.

  const refresh = async () => {
    const aa = await getUserRefresh();
    return aa;
  };

  useEffect(() => {
    setLoading(true);
    // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
    const fetch = refresh();

    const parsedData = fetch.promiseResult;

    console.log('parsedData: ', parsedData);
    // Käyttäjän tietojen hakeminen RDS:stä.
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData.idToken.payload.sub}"`
      )
      .then((res) => {
        const user = res.data[0];

        console.log('user: ', user.k_id);

        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/resepti/user/${user.k_id}`
          )
          .then((res) => {
            console.log('res.data: ', res.data);
            setData(res.data);
          })
          .catch((error) => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
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

export default fetchRecipesByUser;
