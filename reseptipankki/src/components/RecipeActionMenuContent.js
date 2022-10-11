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

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Muokkaa</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Poista</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää omiin resepteihin</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää listalle</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Lisää ostoslistalle</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Jaa</p>
      </button>

      <div className="divider" />

      <button
        className="buttonInvisible width100"
        onClick={() => console.log('*click*')}
      >
        <p>Ilmianna</p>
      </button>
    </div>
  );
};

export default RecipeActionMenuContent;
