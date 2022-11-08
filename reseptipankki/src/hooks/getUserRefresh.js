/*
Tämä funktio päivittää kirjautuneen käyttäjän jwt-tokenin.
Funktio voidaan importoida komponentteihin, ja suorittaa
aina ennen kuin tehdään jokin toimenpide, jossa tokenia
tarvitaan.
*/
const getUserRefresh = async () => {
  e.preventDefault();
  // Ladataan käyttäjätiedot localStoragesta...
  const userData = localStorage.getItem('user');
  // ...ja muunnetaan ne takaisin objektiksi.
  const parsedData = JSON.parse(userData);

  // Tehdään pyyntö joka palauttaa uudet tokenit.
  const res = await fetch(
    `${process.env.REACT_APP_COGNITO_LOGIN_URL}/oauth2/token`,
    {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded',
      }),
      body: Object.entries({
        grant_type: 'refresh_token',
        client_id: parsedData.accessToken.payload.client_id,
        redirect_uri: window.location.origin,
        refresh_token: parsedData.refreshToken.token,
      })
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
    }
  );
  if (!res.ok) {
    throw new Error(await res.json());
  }
  const newTokens = await res.json();

  // Laitetaan parsedData-objektiin uusi access_token.
  parsedData.accessToken.jwtToken = newTokens.access_token;

  // Laitetaan päivitetty data taas localStorageen.
  localStorage.setItem('user', JSON.stringify(parsedData));

  // Palautetaan muutettu data niin sitä ei tarvitse enää hakea uudestaan:
  return parsedData;
};

export default getUserRefresh;
