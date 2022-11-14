import { React, useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import '../styles/ActionMenuContent.css';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';

/*
Listatoiminnallisuusvalikon sisältö. Saa listan tiedot parametreinä.
*/
const ListActionMenuContent = ({
  id,
  name,
  desc,
  toggleMenu,
  deletingMode,
  toggleDeletingMode,
  openedFromListPage,
  lists,
  setLists,
}) => {
  // Tila siitä onko reseptin poistamisvalikko auki.
  const [deleteOptionOpen, toggleOpen] = useState(false);

  const navigate = useNavigate();

  // Funktio joka poistaa listan.
  const deleteRecipe = async () => {
    // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit..
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;
    const cognitoId = parsedData.idToken.payload.sub;

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/lista/
        ${id}`,
        {
          headers: { Authorization: `Bearer ${token}`, cognitoId: cognitoId },
        }
      )
      .then((res) => {
        if (openedFromListPage) {
          navigate('/listat');
        } else {
          /*
          Jotta lista häviäisi näkyvistä ilman refreshaustakin, listan objekti
          pitää poistaa lists-tilasta, joka tulee parametrina.
          */
          console.log('lists: ', lists);
          const listsCopy = [...lists];
          console.log('listCopy: ', lists);

          setLists(
            listsCopy.filter((l) => {
              return l.l_id !== id;
            })
          );

          toggleMenu(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="actionMenuContent">
      <button className="buttonInvisible width100">
        <p className="actionMenuLink listMenuFirst">Muokkaa listaa</p>
      </button>

      <div className="divider" />

      {deleteOptionOpen ? (
        <div>
          <p>Haluatko varmasti poistaa listan?</p>
          <div className="twoButtonsDiv">
            <div onClick={() => toggleOpen(!deleteOptionOpen)}>
              <Button color={'secondary'} text={'Peruuta'} />
            </div>

            <div onClick={() => deleteRecipe()}>
              <Button color={'warning'} text={'Poista'} />
            </div>
          </div>
        </div>
      ) : (
        <button
          className="buttonInvisible width100"
          onClick={() => toggleOpen(!deleteOptionOpen)}
        >
          <p>Poista lista</p>
        </button>
      )}

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => {
          toggleDeletingMode(!deletingMode);
          toggleMenu(false);
        }}
      >
        <p className="actionMenuLink blackText">Poista reseptejä</p>
      </button>

      <div className="divider" />

      <button className="buttonInvisible width100">
        <p className="actionMenuLink blackText listMenuLast">Jaa</p>
      </button>
    </div>
  );
};

// Parametrien tyypitykset.
ListActionMenuContent.propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  desc: PropTypes.string,
  toggleMenu: PropTypes.func,
  deletingMode: PropTypes.bool,
  toggleDeletingMode: PropTypes.func,
  openedFromListPage: PropTypes.bool,
  lists: PropTypes.any,
  setLists: PropTypes.func,
};

export default ListActionMenuContent;
