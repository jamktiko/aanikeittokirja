/*
Tämä funktio palauttaa localStoragessa sillä hetkellä olevat
käyttäjän tiedot:
*/
const getUser = () => {
  // Ladataan käyttäjätiedot localStoragesta...
  const userData = localStorage.getItem('user');
  // ...ja muunnetaan ne takaisin objektiksi.
  const parsedData = JSON.parse(userData);
  return parsedData;
};

export default getUser;
