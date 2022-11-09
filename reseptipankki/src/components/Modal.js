import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getUserRefresh from '../hooks/getUserRefresh';

function Modal({ setOpenModal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rdsAccount, setRdsAccount] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(name, description);

    const listObject = {
      nimi: name,
      kuvaus: description,
      Kayttaja_k_id: rdsAccount[0].k_id
    };

    // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit.
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;

    console.log(rdsAccount);

    // Pyyntö, joka lähettää reseptin tietokantaan:
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/lista`, listObject, {
        headers: {
          Authorization: `Bearer ${token}`,
          cognitoId: rdsAccount[0].cognito_id
        }
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error('Adding recipe failed: ', error);
      });
  };

  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);
    // ...josta saadaan cognito_id, millä voidaan hakea
    // käyttäjän ID rds-tietokannassa. Lähetetty resepti
    // kuuluu ID:tä vastaavalle käyttäjälle.

    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        setRdsAccount(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
}

Modal.propTypes = {
  setOpenModal: PropTypes.any
};

export default Modal;
