import React from 'react';
import { BiStar } from 'react-icons/bi';
import '../styles/RecipeActionMenuContent.css';

const RecipeActionMenuContent = () => {
  return (
    <div className="recipeActionMenuContent">
      <p>Arvostele resepti</p>

      <div className="starReviewContainer">
        <BiStar />
        <BiStar />
        <BiStar />
        <BiStar />
        <BiStar />
      </div>

      <div className="divider" />

      <p>Muokkaa</p>

      <div className="divider" />

      <p>Poista</p>

      <div className="divider" />

      <p>Lisää omiin resepteihin</p>

      <div className="divider" />

      <p>Lisää listalle</p>

      <div className="divider" />

      <p>Lisää ainekset ostoslistalle</p>

      <div className="divider" />

      <p>Jaa</p>

      <div className="divider" />

      <p>Ilmianna resepti</p>
    </div>
  );
};

export default RecipeActionMenuContent;
