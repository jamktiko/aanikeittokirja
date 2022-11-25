/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import Button from './Button';
import '../styles/MealPlanner.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/*
Ateriasuunnittelijan komponentti. Tässä käyttäjä pystyy
lisäämään reseptejä haluamalleen päivälle viikottaisessa
kalenterinäkymässä.
*/
const MealPlanner = () => {
  // Tila, jossa säilötään näytettävän viikon päivämäärä.
  const [shownDate, setShownDate] = useState(new Date());
  // Tila, jossa säilötään näytettävän viikon päivät.
  const [weekDays, setWeeksDays] = useState([]);

  // Funktio, joka palauttaa tietyn päivämäärän (d) viikkonumeron.
  const getWeek = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  // Funktio, joka palauttaa tietyn päivämäärän (date) viikon maanantain.
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  /*
  Funktio, joka palauttaa tietyn päivän (base) jälkeisen päivän, joka on
  count-luvun verran päiviä edessäpäin.
  */
  const offsetDate = (base, count) => {
    const date = new Date(base);
    date.setDate(base.getDate() + count);
    return date;
  };

  // Funktio, joka palauttaa tietyn päivämäärän (date) viikon kaikki päivät.
  const getDatesOfWeek = (date) => {
    const weekArray = []; // Taulukko johon päivät lisätään.
    const monday = getMonday(date); // Haetaan viikon maanantai.
    weekArray.push(monday);

    // Haetaan kaikki viikon muut päivät offsetDate-funktion avulla.
    for (let i = 1; i < 7; i++) {
      const date = offsetDate(monday, i);
      weekArray.push(date);
    }

    return weekArray; // Palautetaan viikon kaikki päivät sisältävä taulukko.
  };

  // Funktio, joka muuttaa näytettävää viikkoa.
  const changeWeek = (forward) => {
    const today = shownDate;

    // Jos forward = true, näytetään seuraava viikko, muuten edellinen
    if (forward) {
      setShownDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setShownDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  // Muuttaa getDayn antamat numerot viikonpäivien lyhenteiksi.
  const getWeekday = (day) => {
    switch (day) {
      case 1:
        return 'Ma';
      case 2:
        return 'Ti';
      case 3:
        return 'Ke';
      case 4:
        return 'To';
      case 5:
        return 'Pe';
      case 6:
        return 'La';
      case 0:
        return 'Su';
      default:
        return;
    }
  };

  /*
  useEffect, joka seuraa shownDaten muutoksia ja päivittää näytettävän
  viikon päiviä.
  */
  useEffect(() => {
    setWeeksDays(getDatesOfWeek(shownDate));
  }, [shownDate]);

  return (
    <div className="plannerContainer">
      <div className="weekDisplay">
        <div onClick={() => changeWeek(false)} className="leftArrow">
          <FiChevronLeft />
        </div>
        <div>
          <h1>Viikko {getWeek(shownDate)}</h1>
        </div>
        <div onClick={() => changeWeek(true)} className="rightArrow">
          <FiChevronRight />
        </div>
      </div>

      {weekDays.map((item, index) => {
        return (
          <div key={index}>
            <div className="dayDisplay">
              <p>
                {getWeekday(item.getDay())} {item.getUTCDate()}.
                {item.getMonth() + 1}.
              </p>
              <div>
                <Button type="button" text="Lisää" />
              </div>
            </div>

            {index !== 6 && <div className="divider" />}
          </div>
        );
      })}
    </div>
  );
};

export default MealPlanner;
