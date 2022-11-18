/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import RecipeCardsList from './RecipeCardsList';
import axios from 'axios';

/*
Käyttäjän itse lisäämät ja tallentamat reseptit näkyvät tässä
komponentissa. Sisältää myös hakukentän.
*/
const OwnRecipes = () => {
  const [recipes, setRecipes] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);

    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        const user = res.data[0];
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/resepti/user/${user.k_id}`
          )
          .then((res) => {
            console.log('omat reseptit: ', res.data);
            setRecipes(res.data);
          })
          .catch((error) => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Omat reseptisi</h1>

      <RecipeCardsList data={recipes} loading={loading} error={error} />
    </div>
  );
};

export default OwnRecipes;
