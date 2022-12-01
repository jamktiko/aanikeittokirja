import { React, UseState } from 'react';
import ListActionMenuContent from './ListActionMenuContent';
import ShoppingLists from './ShoppingLists';
import { Link } from 'react-router-dom';

const ShoppingCard = ({ shopList, shopLists, setShopLists }) => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  return (
    <Link>
      <div>
        <h4>{shopList.nimi}</h4>
        <p>{shopList.ainekset}</p>
      </div>
    </Link>
  );
};

// Parametrien tyypitykset.
ShoppingCard.propTypes = {
  ShopList: PropTypes.any,
  ShopLists: PropTypes.array,
  SetShopLists: PropTypes.func
};

export default ShoppingCard;
