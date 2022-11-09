import { React, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';

const ListModal = ({ setOpenModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(name, description);

    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userData);

    // Haetaan käyttäjän tiedot RDS:stä.
    const rdsAccount = await axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedUserData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
      });

    const listObject = {
      nimi: name,
      kuvaus: description,
      Kayttaja_k_id: rdsAccount[0].k_id,
    };

    // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit.
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;

    // Pyyntö, joka lähettää listan tietokantaan:
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/lista`, listObject, {
        headers: {
          Authorization: `Bearer ${token}`,
          cognitoId: rdsAccount[0].cognito_id,
        },
      })
      .then((res) => {
        console.log(res);
        setOpenModal(false);
      })
      .catch((error) => {
        console.error('Adding list failed: ', error);
      });
  };

  return (
    <div>
      <div className="modalBackground">
        <div className="modalContainer"></div>
        <form onSubmit={onSubmit}>
          <div>
            <p>Nimi</p>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            ></input>
            <p>Kuvaus</p>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></input>

            <button>Lisää</button>
          </div>
        </form>
        <button
          onClick={() => {
            setOpenModal(false);
          }}
        >
          Peruuta
        </button>
      </div>
    </div>
  );
};

ListModal.propTypes = {
  setOpenModal: PropTypes.any,
};

export default ListModal;
