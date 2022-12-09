/* eslint-disable operator-linebreak */
import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';
import '../styles/ShoppingItem.css';

const ShoppingItem = ({
  listId,
  item,
  shopListItems,
  setShopListItems,
  rdsAccount,
  deleting,
  setDeleting,
}) => {
  // Aineksen nimen laittaminen sen tekstikenttään:
  const [itemName, setItemName] = useState(item.aines);

  /*
  Aineksen määrän laittaminen sen tekstikenttään. Se laitetaan
  vain jos se on olemassa ja se ei ole nolla.
  */
  const [itemAmount, setItemAmount] = useState(
    (item.maara || item.yksikko) &&
      item.maara !== 0 &&
      item.maara.trim() !== '0'
      ? `${item.maara} ${item.yksikko}`
      : ''
  );
  // Tieto siitä, onko item yliviivattu.
  const [itemChecked, toggleItemChecked] = useState(false);
  // Tieto siitä, onko itemiä muokattu.
  const [itemEdited, toggleItemEdited] = useState(false);

  // Funktio, jossa hoidetaan aineksen poistaminen ostoslistalta
  const removeItem = async () => {
    // Tarkistetaan, onko jonkin aineksen poistaminen vielä kesken
    if (!deleting) {
      // Määritetään poistaminen alkaneeksi
      setDeleting(true);

      // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
      // Funktio myös palauttaa käyttäjän tokenit..
      const parsedData = await getUserRefresh();
      const token = parsedData.accessToken.jwtToken;
      const cognitoId = parsedData.idToken.payload.sub;

      if (typeof item.oa_id === 'number') {
        axios
          .delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines/
          ${item.oa_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                cognitoId: cognitoId,
              },
              data: {
                Kayttaja_k_id: rdsAccount.k_id,
              },
            }
          )
          .then((res) => {
            // Poistetaan tietokannasta poistettu item myös näkyvyistä:
            const copy = [...shopListItems];
            const copyFiltered = copy.filter((i) => {
              return i.oa_id !== item.oa_id;
            });

            setShopListItems([...copyFiltered]);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            // Poisto on valmis, joten uusi poistaminen voidaan aloittaa.
            setDeleting(false);
          });
      } else {
        const copy = [...shopListItems];

        const copyFiltered = copy.filter((i) => {
          return i.oa_id !== item.oa_id;
        });

        setShopListItems([...copyFiltered]);
        setDeleting(false);
      }
    }
  };

  // Funktio joka päivittää ostoslistaitemin tietokannassa.
  const updateItem = async () => {
    // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit..
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;
    const cognitoId = parsedData.idToken.payload.sub;

    if (typeof item.oa_id === 'number') {
      // Objekti, joka lähetetään pyynnön mukana.
      const requestObject = {
        Ostoslista_o_id: listId,
        aines: itemName,
        maara: itemAmount,
        yksikko: '',
      };

      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines/${item.oa_id}`,
          requestObject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              cognitoId: cognitoId,
            },
          }
        )
        .then((res) => {
          console.log('res: ', res);
        })
        .catch((error) => {
          console.error('Updating shopping list item failed: ', error);
        });
    } else {
      // Objekti, joka lähetetään pyynnön mukana.
      const requestObject = {
        Ostoslista_o_id: listId,
        ainekset: [
          {
            Ostoslista_o_id: listId,
            aines: itemName,
            maara: itemAmount,
            yksikko: '',
          },
        ],
      };

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines`,
          requestObject,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              cognitoId: cognitoId,
            },
          }
        )
        .catch((error) => {
          console.error('Adding items to shopping list failed: ', error);
        });
    }
  };

  // UseEffect joka seuraa itemin nimen muutoksia.
  useEffect(() => {
    // Jos itemiä ei ole muokattu, ei tehdä mitään.
    // Näin estetään turhien pyyntöjen tapahtuminen kun komponentti ladataan
    if (!itemEdited) return;

    /*
    Päivitys tehdään puolen sekunnin viiveellä, jottei niitä
    tehdä turhaan jos käyttäjä kirjoittaa yhä.
    */
    const delayRequest = setTimeout(() => {
      updateItem();
    }, 1000);

    // Nollataan timeout.
    return () => {
      clearTimeout(delayRequest);
    };
  }, [itemName]);

  // UseEffect joka seuraa itemin määrän muutoksia.
  useEffect(() => {
    // Jos itemiä ei ole muokattu, ei tehdä mitään.
    // Näin estetään turhien pyyntöjen tapahtuminen kun komponentti ladataan
    if (!itemEdited) return;

    /*
    Päivitys tehdään puolen sekunnin viiveellä, jottei niitä
    tehdä turhaan jos käyttäjä kirjoittaa yhä.
    */
    const delayRequest = setTimeout(() => {
      updateItem();
    }, 1000);

    // Nollataan timeout.
    return () => {
      clearTimeout(delayRequest);
    };
  }, [itemAmount]);

  return (
    <div className="shoppingItemContainer">
      <p onClick={() => removeItem()} className="shoppingItemX">
        ✕
      </p>

      <input
        className={`shoppingItemContainerInput itemInputFirst ${
          itemChecked ? 'inputOverline' : ''
        }`}
        type="text"
        value={itemName}
        onChange={(event) => {
          setItemName(event.target.value);
          toggleItemEdited(true);
        }}
      />

      <input
        className={`shoppingItemContainerInput ${
          itemChecked ? 'inputOverline' : ''
        }`}
        type="text"
        value={itemAmount}
        onChange={(event) => {
          setItemAmount(event.target.value);
          toggleItemEdited(true);
        }}
      />

      <input
        className="shoppingItemCheckbox"
        type="checkbox"
        value={itemChecked}
        onClick={() => toggleItemChecked(!itemChecked)}
      />
    </div>
  );
};

// Parametrien tyypitykset.
ShoppingItem.propTypes = {
  listId: PropTypes.any,
  item: PropTypes.any,
  shopListItems: PropTypes.array,
  setShopListItems: PropTypes.func,
  rdsAccount: PropTypes.any,
  deleting: PropTypes.bool,
  setDeleting: PropTypes.func,
};

export default ShoppingItem;
