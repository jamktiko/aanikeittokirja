import { useEffect, useState } from 'react';
import axios from 'axios';

/*
Hook joka hakee käyttäjän tiedot cognito_id:n perusteella.
Param on kyseinen cognito_id.
*/
const fetchAccount = (param) => {
  const [data, setData] = useState(null); // Hausta palautuva data.

  if (!param) console.error('cognito_ID not found');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${param}"`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return data;
};

export default fetchAccount;
