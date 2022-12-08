import { React, useState } from 'react';
import PropTypes from 'prop-types';
import getUserRefresh from '../hooks/getUserRefresh';
import axios from 'axios';
import '../styles/ShoppingItem.css';

const ShoppingItem = ({
  item,
  shopListItems,
  setShopListItems,
  rdsAccount,
}) => {
  console.log('item: ', item);
  const [itemName, setItemName] = useState(item.aines);
  const [itemAmount, setItemAmount] = useState(`${item.maara} ${item.yksikko}`);
  const [itemChecked, toggleItemChecked] = useState(false);

  const removeItem = async () => {
    // Uudisteaan käyttäjän token tällä importoidulla funktiolla.
    // Funktio myös palauttaa käyttäjän tokenit..
    const parsedData = await getUserRefresh();
    const token = parsedData.accessToken.jwtToken;
    const cognitoId = parsedData.idToken.payload.sub;

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/ostos_aines/
      ${item.oa_id}`,
        {
          headers: { Authorization: `Bearer ${token}`, cognitoId: cognitoId },
          data: {
            Kayttaja_k_id: rdsAccount.k_id,
          },
        }
      )
      .then((res) => {
        const copy = [...shopListItems];
        setShopListItems(
          copy.filter((i) => {
            return i.oa_id !== item.oa_id;
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        onChange={(event) => setItemName(event.target.value)}
      />

      <input
        className={`shoppingItemContainerInput itemInputFirst ${
          itemChecked ? 'inputOverline' : ''
        }`}
        type="text"
        value={itemAmount}
        onChange={(event) => setItemAmount(event.target.value)}
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
  item: PropTypes.any,
  shopListItems: PropTypes.array,
  setShopListItems: PropTypes.func,
  rdsAccount: PropTypes.any,
};

export default ShoppingItem;
