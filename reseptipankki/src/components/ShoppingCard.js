import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import '../styles/ListCard.css';
import { AnimatePresence } from 'framer-motion';
import DarkBG from './DarkBG';
import ActionMenu from './ActionMenu';
import ShopListActionMenuContent from './ShopListActionMenuContent';

const ShoppingCard = ({ shopList, shopLists, setShopLists }) => {
  const [menuOpen, toggleMenuOpen] = useState(false);

  return (
    <div className="listCardContainer">
      <div className="listCardFlex">
        <div className="listCardText">
          <Link to={`/ostoslistat/${shopList.o_id}`}>
            <h4>{shopList.nimi}</h4>
          </Link>
        </div>

        <div onClick={() => toggleMenuOpen(true)} className="listCardIcon">
          <BiDotsVerticalRounded />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <div>
            <DarkBG toggleMenu={toggleMenuOpen} z={91} />
            <ActionMenu
              menuContent={
                <ShopListActionMenuContent
                  shopList={shopList}
                  toggleMenu={toggleMenuOpen}
                  openedFromShopListPage={false}
                  shopLists={shopLists}
                  setShopLists={setShopLists}
                  openedFromCard={true}
                />
              }
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

// Parametrien tyypitykset.
ShoppingCard.propTypes = {
  shopList: PropTypes.any,
  shopLists: PropTypes.array,
  setShopLists: PropTypes.func
};

export default ShoppingCard;
