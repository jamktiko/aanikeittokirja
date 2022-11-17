import { React, useState, useEffect } from 'react';
import Button from './Button';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import getUser from '../hooks/getUser';
import '../styles/UserPage.css';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';

const UserPage = () => {
  // Tila johon käyttäjän tiedot laitetaan:
  const [userData, setUserData] = useState();
  // Tila johon laitetaan käyttäjän erikoisruokavaliot:
  const [diets, setDiets] = useState({
    kasvis: false,
    vegaaninen: false,
    gluteeniton: false,
    maidoton: false,
    laktoositon: false,
    kananmunaton: false,
  });
  // Tila siitä, onko käyttäjä muokannut erikoisruokavalioitaan.
  const [dietsEdited, setDietsEdited] = useState(false);

  const navigate = useNavigate();

  // Valittavissa olevat erikoisruokavaliot:
  const dietsArray = [
    'kasvis',
    'vegaaninen',
    'gluteeniton',
    'maidoton',
    'laktoositon',
    'kananmunaton',
  ];

  // Objekti, johon lisätään avain-arvo pari jokaiselle erikoisruokavaliolle
  const dietsObj = {};

  // Erikoisruokavalioiden lisääminen äsken luotuun oletusarvolla 0.
  dietsArray.forEach((diet) => {
    dietsObj[diet] = 0;
  });

  // Vaihtaa tietyn erikoisruokavalion (diet) tilan vastakkaiseksi.
  const changeUserDiets = (diet) => {
    setDietsEdited(true);
    const copy = { ...diets };
    copy[diet] = !copy[diet];
    setDiets({ ...copy });
  };

  // Funktio joka lähettää käyttäjän erikoisruokavalioihin tekemänsä muutokset.
  const submitUserDiets = async () => {
    if (dietsEdited) {
      // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
      // Funktio myös palauttaa käyttäjän tokenit.
      const parsedData = await getUserRefresh();
      const token = parsedData.accessToken.jwtToken;

      // Objekti joka liitetään axios-pyyntöön.
      const userObject = {
        enimi: userData.enimi,
        snimi: userData.snimi,
        email: userData.email,
        cognito_id: userData.cognito_id,
        erikoisruokavaliot: JSON.stringify(diets),
        uusi: 0,
      };

      // Pyyntö, joka lähettää päivityksen tietokantaan:
      axios
        .put(
          // eslint-disable-next-line max-len
          `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/${userData.k_id}`,
          userObject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              cognitoId: userData.sub,
            },
          }
        )
        .then((res) => {
          console.log('RES: ', res);
        })
        .catch((error) => {
          console.error('Updating user failed: ', error);
        });
    }
  };

  // Funktio, joka kirjaa käyttäjän ulos.
  const logOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  /*
  Jos käyttäjän tiedot löytyivät localStoragesta, ne tulostetaan.
  Jos ei, siirrytään kirjautumissivulle.
  */
  useEffect(() => {
    // Käyttäjän tietojen hakeminen localStoragesta.
    const savedUser = getUser();

    if (savedUser) {
      // Käyttäjän tietojen hakeminen RDS:stä.
      axios
        .get(
          // eslint-disable-next-line max-len
          `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${savedUser.idToken.payload.sub}"`
        )
        .then((res) => {
          // Laitetaan saatu data käyttäjän tilaan:
          setUserData(res.data[0]);

          /*
          Laitetaan käyttäjän erikoisruokavaliot diets-tilaan, jotta
          ne saadaan näkyviin oikeissa checkboxeissa.
          */
          const usersDiets = res.data[0].erikoisruokavaliot;
          if (usersDiets) {
            const userDietsParsed = JSON.parse(usersDiets);
            const dietsCopy = { ...diets };
            Object.keys(userDietsParsed).forEach((d) => {
              dietsCopy[d] = userDietsParsed[d];
            });
            setDiets({ ...dietsCopy });
          }
        })
        .catch((error) => {
          console.error('Fetching user data failed: ', error);
        });
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="userPageContainer">
      <h1>Käyttäjän asetukset</h1>

      {userData ? (
        <div>
          <p>
            <span className="boldText">Etunimi</span>: {userData?.enimi}
          </p>

          <p>
            <span className="boldText">Sukunimi</span>: {userData?.snimi}
          </p>

          <div className="divider" />

          <h3>Erikoisruokavaliosi</h3>
          <p className="darkGreyText">
            Etusivun suositukset mukautetaan vastaamaan erikoisruokavalioitasi
          </p>

          <div className="checkboxGrid">
            {dietsArray.map((item, index) => {
              return (
                <div key={index} className="checkbox">
                  <input
                    type="checkbox"
                    id={`dietCheckbox${index}`}
                    checked={diets[item]}
                    onChange={() => changeUserDiets(item)}
                  />
                  <label htmlFor={`dietCheckbox${index}`}>{item}</label>
                </div>
              );
            })}
          </div>

          <div onClick={() => submitUserDiets()}>
            <Button color="primary" text="Tallenna muutokset" type="button" />
          </div>

          <div className="divider" />

          <div onClick={() => navigate('/uusi_salasana')}>
            <Button color="secondary" text="Vaihda salasana" type="button" />
          </div>

          <div onClick={() => logOut()}>
            <Button color="primary" text="Kirjaudu ulos" type="button" />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default UserPage;
