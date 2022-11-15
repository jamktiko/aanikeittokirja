import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import ListModal from './ListModal';
import { useNavigate } from 'react-router-dom';
import '../styles/ActionMenuContent.css';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

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
  setRecipesToDelete,
  lists,
  setLists,
  setListName,
  setListDesc,
}) => {
  // Tila siitä onko reseptin poistamisvalikko auki.
  const [deleteOptionOpen, toggleDeleteMenuOpen] = useState(false);
  const [editModalOpen, toggleEditModalOpen] = useState(false);

  // Tila johon käyttäjän tiedot laitetaan:
  const [userData, setUserData] = useState();

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
          const listsCopy = [...lists];
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

  // Kun sivu on latautunut, haetaan käyttäjän tiedot ja listat:
  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userDataLS = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedUserData = JSON.parse(userDataLS);
    setUserData(parsedUserData);
  }, []);

  return (
    <div className="actionMenuContent">
      <button
        onClick={() => toggleEditModalOpen(true)}
        className="buttonInvisible width100"
      >
        <p className="actionMenuLink listMenuFirst">Muokkaa listaa</p>
      </button>

      <AnimatePresence>
        {editModalOpen ? (
          <ListModal
            setOpenModal={toggleEditModalOpen}
            toggleMenu={toggleMenu}
            parsedUserData={userData}
            lists={lists}
            setLists={setLists}
            editMode={true}
            editName={name}
            editDesc={desc}
            listId={id}
            setListDesc={setListDesc}
            setListName={setListName}
            openedFromListPage={openedFromListPage}
            listName={name}
            listDesc={desc}
          />
        ) : null}
      </AnimatePresence>

      <div className="divider" />

      {deleteOptionOpen ? (
        <div>
          <p>Haluatko varmasti poistaa listan?</p>
          <div className="twoButtonsDiv">
            <div onClick={() => toggleDeleteMenuOpen(!deleteOptionOpen)}>
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
          onClick={() => toggleDeleteMenuOpen(!deleteOptionOpen)}
        >
          <p>Poista lista</p>
        </button>
      )}

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => {
          // Jos valikko avattiin listasivulta, togglataan poistomoodi:
          if (openedFromListPage) {
            setRecipesToDelete([]);
            toggleDeletingMode(!deletingMode);
            toggleMenu(false);
          } else {
            navigate(`/listat/${id}`, { state: { startWithDeleteMode: true } });
          }
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
  setRecipesToDelete: PropTypes.func,
  lists: PropTypes.any,
  setLists: PropTypes.func,
  setListName: PropTypes.func,
  setListDesc: PropTypes.func,
};

export default ListActionMenuContent;
