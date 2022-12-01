import { React, useEffect, useState } from 'react';
import Loading from './Loading';
import LoadingError from './LoadingError';
import fetchItemsInShoppingList from '../hooks/fetchItemsInShoppingList';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import getUser from '../hooks/getUser';
import axios from 'axios';
import '../styles/ShoppingList.css';
import { AnimatePresence } from 'framer-motion';
import DarkBG from './DarkBG';
import ActionMenu from './ActionMenu';
import ShopListActionMenuContent from './ShopListActionMenuContent';

/*
Käyttäjän tietyn ostoslistan näyttävä komponentti.
*/
const ShoppingList = () => {
  // Näytettävän ostoslistan tiedot:
  const [shopList, setShopList] = useState('');
  // Onko valikko auki:
  const [menuOpen, toggleMenu] = useState(false);

  /*
  Haetaan kirjautuneen käyttäjän tiedot. Näin katsotaan,
  onko katsottu ostoslista kyseisen käyttäjän, eli voiko
  hän nähdä valikkonappulan.
  */
  const user = getUser();

  // Reseptin ID saadaan URL:n lopusta.
  const shopListId = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );
  // Itemien hakeminen hookilla.
  const { data, loading, error } = fetchItemsInShoppingList(shopListId);

  useEffect(() => {
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/ostoslista/${shopListId}`
      )
      .then((res) => {
        setShopList(res.data);
      })
      .catch((error) => {
        console.error(error);
        setShopList('not found');
      });
  }, []);

  // Kun hookin lataus on kesken, näytetään latausikonia.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) {
    return <LoadingError subtext="Ostoslistan hakeminen epäonnistui." />;
  }

  // Ostoslistalla olevat ainekset ovat tässä data-vakiossa:
  if (data) console.log(data);

  return (
    <div className="shoppingListContainer">
      {shopList !== 'not found' ? (
        <div>
          <div className="shopListHeaderContainer">
            <h2>{shopList.nimi}</h2>

            {user && (
              <button
                className="recipeActionMenuIcon buttonInvisible"
                onClick={() => toggleMenu(true)}
              >
                <BiDotsVerticalRounded />
              </button>
            )}
          </div>

          {/* Ostoslistatoiminnallisuusvalikko */}
          <AnimatePresence>
            {menuOpen ? (
              <div>
                <DarkBG toggleMenu={toggleMenu} z={91} />

                <ActionMenu
                  menuContent={
                    <ShopListActionMenuContent
                      toggleMenu={toggleMenu}
                      shopList={shopList}
                      openedFromShopListPage={true}
                      setShopList={setShopList}
                    />
                  }
                />
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : (
        <LoadingError subtext="Ehkä hakemaasi ostoslistaa ei enää ole?" />
      )}
    </div>
  );
};

export default ShoppingList;
