import React from 'react';
import Button from './Button';
import '../styles/MealPlanner.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/*
Ateriasuunnittelijan komponentti. Tässä käyttäjä pystyy
lisäämään reseptejä haluamalleen päivälle viikottaisessa
kalenterinäkymässä.
*/
const MealPlanner = () => {
  return (
    <div className="plannerContainer">
      <div>Ateriasuunnittelija</div>
      <div className="weekDisplay">
        <div className="leftArrow">
          <Link>
            <FiChevronLeft />
          </Link>
        </div>
        <div>
          <h1>Viikko</h1>
        </div>
        <div className="rightArrow">
          <Link>
            <FiChevronRight />
          </Link>
        </div>
      </div>
      <hr></hr>
      <div className="dayDisplay">
        <p>Päivä</p>
        <div>
          <Button type="button" text="Lisää" />
        </div>
      </div>
      <hr></hr>
    </div>
  );
};

export default MealPlanner;
