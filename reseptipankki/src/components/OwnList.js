import { React, useState } from 'react';
import fetchRecipesinList from '../hooks/fetchRecipesinList';
import Loading from './Loading';
import LoadingError from './LoadingError';
import RecipeCardsList from './RecipeCardsList';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { AnimatePresence } from 'framer-motion';
import ActionMenu from './ActionMenu';
import DarkBG from './DarkBG';
import ListActionMenuContent from './ListActionMenuContent';
import '../styles/OwnList.css';

const OwnList = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  // Reseptin ID saadaan URL:n lopusta.
  const listId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  // Reseptien hakeminen hookilla. Vain ID:n mukainen resepti haetaan.
  const { data, loading, error } = fetchRecipesinList(listId);

  // Kun hookin lataus on kesken, näytetään Loading-komponentti.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) {
    return <LoadingError subtext="Listan reseptien hakeminen epäonnistui." />;
  }

  console.log('data: ', data);

  // TO DO tähän: hae käyttäjän tiedot ja vertaa, onko lista käyttäjän vai ei.

  return (
    <div>
      {data ? (
        <div className="ownListContainer">
          <div className="listInfoContainer">
            <div className="listInfoText">
              <h2>{data[0].listan_nimi}</h2>

              <p>{data[0].kuvaus ? data[0].kuvaus : null}</p>
            </div>

            <BiDotsVerticalRounded onClick={() => toggleMenuOpen(!menuOpen)} />
          </div>

          {data && data.length !== 0 && data[0].r_id !== null ? (
            <RecipeCardsList data={data} />
          ) : (
            <h4 className="darkGreyText centerText">
              Listalla ei ole reseptejä.
            </h4>
          )}

          <AnimatePresence>
            {menuOpen ? (
              <div>
                <DarkBG toggleMenu={toggleMenuOpen} z={3} />
                <ActionMenu
                  menuContent={
                    <ListActionMenuContent
                      toggleMenu={toggleMenuOpen}
                      id={listId}
                      openedFromListPage={true}
                      name={data[0].listan_nimi}
                      desc={data[0].kuvaus}
                    />
                  }
                />
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
};

export default OwnList;
