/*
Tämä funktio palauttaa localStoragessa sillä hetkellä olevat
viimeksi katsotut reseptit:
*/
const getRecentlyViewed = () => {
  // Ladataan reseptitiedot localStoragesta...
  const userData = localStorage.getItem('recentlyViewed');
  // ...ja parsetaan ne takaisin objektiksi.
  const parsedData = JSON.parse(userData);
  return parsedData;
};

export default getRecentlyViewed;
