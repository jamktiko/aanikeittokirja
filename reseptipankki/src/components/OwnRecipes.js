import { React, useState, useEffect } from 'react';
import RecipeCardsList from './RecipeCardsList';
import '../styles/OwnRecipes.css';
import axios from 'axios';

/*
Käyttäjän itse lisäämät ja tallentamat reseptit näkyvät tässä
komponentissa.
*/
const OwnRecipes = () => {
  const [recipes, setRecipes] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);

    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);

    // Pyyntö joka hakee käyttäjän tiedot localStoragesta.
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        // Jos käyttäjän tietojen haku onnistui, haetaan hänen reseptinsä.
        const user = res.data[0];
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/resepti/user/${user.k_id}`
          )
          .then((res) => {
            // Laitetaan palautuneet reseptit recipes-tilaan:
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
    <div className="ownRecipesContainer">
      <h1>Omat reseptisi</h1>

      <RecipeCardsList
        data={recipes}
        loading={loading}
        error={error}
        recipes={recipes}
        setRecipes={setRecipes}
      />
    </div>
  );
};

export default OwnRecipes;
