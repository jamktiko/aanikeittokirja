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
import ShoppingItem from './ShoppingItem';
import Button from './Button';

/*
Käyttäjän tietyn ostoslistan näyttävä komponentti.
*/
const ShoppingList = () => {
  // Näytettävän ostoslistan tiedot:
  const [shopList, setShopList] = useState('');
  // Onko valikko auki:
  const [menuOpen, toggleMenu] = useState(false);
  // Listan itemit:
  const [shopListItems, setShopListItems] = useState([]);
  // Käyttäjän tiedot rds:ssä:
  const [rdsAccount, setRdsAccount] = useState();
  // Numeerinen tila, jota käytetään uusien rivien tilapäisissä id:issä.
  const [idGen, setIdGen] = useState(0);
  // Tila siitä, onko jonkin listan aineksen poistopyyntö kesken:
  const [deleting, setDeleting] = useState(false);

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
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);

    // Haetaan käyttäjän tiedot tietokannasta.
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        setRdsAccount(res.data[0]);

        // Haetaan ostoslistalla olevat ainekset:
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (data) {
      setShopListItems(data);
    }
  }, [data]);

  const addEmptyItem = async () => {
    const newItem = {
      aines: '',
      maara: '',
      yksikko: '',
      Ostoslista_o_id: shopListId,
      oa_id: `new_${idGen}`,
    };

    setShopListItems([...shopListItems, newItem]);
    setIdGen(idGen + 1);
  };

  // Kun hookin lataus on kesken, näytetään latausikonia.
  if (loading) return <Loading />;

  // Jos hook palauttaa virheen, näytetään LoadingError-komponentti.
  if (error) {
    return <LoadingError subtext="Ostoslistan hakeminen epäonnistui." />;
  }

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

          <div>
            {shopListItems?.length > 0 ? (
              <div>
                {shopListItems?.map((item) => {
                  return (
                    <ShoppingItem
                      key={item.oa_id}
                      item={item}
                      shopListItems={shopListItems}
                      setShopListItems={setShopListItems}
                      rdsAccount={rdsAccount}
                      deleting={deleting}
                      setDeleting={setDeleting}
                      listId={shopListId}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="greyText centerText">
                Ostoslistalla ei ole mitään.
              </p>
            )}
          </div>

          <div
            className="addShoppingListItemButton"
            onClick={() => addEmptyItem()}
          >
            <Button text="Lisää aines" color="secondary" type="button" />
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
