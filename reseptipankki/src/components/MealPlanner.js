/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react';
import Button from './Button';
import '../styles/MealPlanner.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MealPlannerAddModal from './MealPlannerAddModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import Loading from './Loading';
import getUserRefresh from '../hooks/getUserRefresh';

/*
Ateriasuunnittelijan komponentti. Tässä käyttäjä pystyy
lisäämään reseptejä haluamalleen päivälle viikottaisessa
kalenterinäkymässä.
*/
const MealPlanner = () => {
  const startDate = useLocation().state?.startDate || new Date();
  // Tila, jossa säilötään näytettävän viikon päivämäärä.
  const [shownDate, setShownDate] = useState(startDate);
  // Tila, jossa säilötään näytettävän viikon päivät.
  const [weekDays, setWeeksDays] = useState([]);
  // Onko reseptinlisäysmodaali auki:
  const [addModalOpen, toggleAddModalOpen] = useState(false);
  // Lisäysmodaaliin lähetettävä päivämäärä:
  const [addModalDate, setAddModalDate] = useState();
  // Käyttäjän RDS-tietokannasta saatavat tiedot laitetaan tähän tilaan:
  const [rdsAccount, setRdsAccount] = useState();
  // Käyttäjän ateriasuunnittelijaan lisäämät reseptit laitetaan tähän:
  const [mealPlannerItems, setMealPlannerItems] = useState();
  // Tieto siitä onko päällä moodi, jossa reseptejä voidaan poistaa
  const [deletingMode, toggleDeletingMode] = useState(false);
  // Taulukko, johon kerätään suunnittelijasta poistettavien reseptien id:t.
  const [recipesToDelete, setRecipesToDelete] = useState([]);

  // Funktio, jossa käsitellään recipesToDeleten muutokset.
  const editRecipesToDelete = (recipeId) => {
    let copy = [...recipesToDelete];
    // Jos recipeId:tä ei löyty taulukosta, se lisätään.
    if (!recipesToDelete.includes(recipeId)) {
      copy.push(recipeId);

      setRecipesToDelete([...copy]);
    } else {
      // Jos recipeId löytyy jo taulukosta, se poistetaan.
      copy = copy.filter((i) => {
        return i !== recipeId;
      });
      setRecipesToDelete([...copy]);
    }
  };

  // Funktio joka poistaa valitut reseptit listalta.
  const deleteRecipesFromList = async () => {
    if (recipesToDelete.length > 0) {
      // Uudistetaan käyttäjän token tällä importoidulla funktiolla.
      // Funktio myös palauttaa käyttäjän tokenit.
      const parsedData = await getUserRefresh();
      const token = parsedData.accessToken.jwtToken;

      const toBeDeleted = [];
      recipesToDelete.forEach((rtd) => {
        toBeDeleted.push({
          ka_id: rtd,
          Kayttaja_k_id: rdsAccount.k_id,
        });
      });

      axios
        .delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/kalenteri_item/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              cognitoId: parsedData.idToken.payload.sub,
            },
            data: {
              toBeDeleted: toBeDeleted,
            },
          }
        )
        .then((res) => {
          let copy = [...mealPlannerItems];
          toBeDeleted.forEach((tbd) => {
            copy = copy.filter((i) => {
              return i.ka_id !== tbd.ka_id;
            });
          });

          setMealPlannerItems([...copy]);

          setRecipesToDelete([]);
          toggleDeletingMode(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

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
        return 'Maanantai';
      case 2:
        return 'Tiistai';
      case 3:
        return 'Keskiviikko';
      case 4:
        return 'Torstai';
      case 5:
        return 'Perjantai';
      case 6:
        return 'Lauantai';
      case 0:
        return 'Sunnuntai';
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

  const removeTimeFromDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  /*
  Sivun latauduttua ladataan käyttäjän tiedot RDS:stä tässä useEffectissä.
  */
  useEffect(() => {
    // Ladataan käyttäjätiedot localStoragesta...
    const userData = localStorage.getItem('user');
    // ...ja muunnetaan ne takaisin objektiksi...
    const parsedData = JSON.parse(userData);
    // ...josta saadaan cognito_id, millä voidaan hakea
    // käyttäjän ID rds-tietokannassa.
    axios
      .get(
        // eslint-disable-next-line max-len
        `${process.env.REACT_APP_BACKEND_URL}/api/kayttaja/cid/"${parsedData?.idToken.payload['cognito:username']}"`
      )
      .then((res) => {
        setRdsAccount(res.data[0]);

        /*
        Kun käyttäjän tiedot on haettu, haetaan hänen Ateriasuunnittelijansa
        reseptit hänen käyttäjä ID:nsä perusteella.
        */
        axios
          .get(
            // eslint-disable-next-line max-len
            `${process.env.REACT_APP_BACKEND_URL}/api/kalenteri_item/user/${res.data[0].k_id}`
          )

          /*
          Poistetaan jokaisesta Ateriasuunnittelijan itemin päivämäärästä
          kellonaika, jotta niiden asettaminen oikeisiin päiviin onnistuu.
          */
          .then((res) => {
            res.data.forEach((item) => {
              // Poistetaan dateista kellonaika:
              item.pvm = removeTimeFromDate(item.pvm);
              // Muunnetaan datet muotoon vuosi.kuukausi.päivä:
              item.pvm =
                item.pvm.getFullYear() +
                '.' +
                (item.pvm.getMonth() + 1) +
                '.' +
                item.pvm.getDate();
            });

            // Laitetaan itemit omaan tilaansa:
            setMealPlannerItems(res.data);
          })
          .catch((error) => {
            console.error('Error fetching Meal Planner items: ', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching account data: ', error);
      });
  }, []);

  return (
    <div className="plannerContainer">
      <div className="weekDisplay">
        <div onClick={() => changeWeek(false)} className="leftArrow">
          <FiChevronLeft />
        </div>
        <div>
          <h1 className="mealPlannerHeader">Viikko {getWeek(shownDate)}</h1>
        </div>
        <div onClick={() => changeWeek(true)} className="rightArrow">
          <FiChevronRight />
        </div>
      </div>

      {/* Näytetään viikkonäkymä vasta kun itemit on ladattu */}
      {mealPlannerItems ? (
        <div>
          {/* Käydään läpi jokainen näytettävän viion päivä */}
          {weekDays.map((dateItem, index) => {
            /*
            Luodaan jokaiselle dateItemille formatoitu, muoto, jota
            voidaan verrata Ateriasuunnittelijaan lisättyjen itemeiden
            päivämääriin.
            */
            const dateItemFormatted =
              dateItem.getFullYear() +
              '.' +
              (dateItem.getMonth() + 1) +
              '.' +
              dateItem.getDate();

            return (
              <div key={index}>
                <div className="divider" />

                <div className="dayDisplay">
                  <p>
                    {getWeekday(dateItem.getDay())} {dateItem.getUTCDate() + 1}.
                    {dateItem.getMonth() + 1}.
                  </p>
                  <div
                    onClick={() => {
                      setAddModalDate(dateItem);
                      toggleAddModalOpen(true);
                    }}
                  >
                    <Button type="button" text="Lisää" />
                  </div>
                </div>

                {/*
                Jos päivälle ei ole lisätty mitään, näytetään tämä teksti.
                */}
                {mealPlannerItems.filter((mpi) => mpi.pvm === dateItemFormatted)
                  .length === 0 && (
                  <p className="greyText">Ei reseptejä tälle päivälle.</p>
                )}

                {/*
                Etsitään mealPlannerItemseistä ne itemit, joiden
                päivämäärä täsmää käsiteltävän näytettävän kanssa.
                */}
                {mealPlannerItems
                  .filter((mpi) => mpi.pvm === dateItemFormatted)
                  .map((recipeItem, recipeIndex) => (
                    <RecipeCard
                      key={recipeIndex}
                      data={JSON.stringify(recipeItem)}
                      mealPlannerKId={rdsAccount.k_id}
                      deletingMode={deletingMode}
                      toggleDeletingMode={toggleDeletingMode}
                      recipesToDelete={recipesToDelete}
                      editRecipesToDelete={editRecipesToDelete}
                      plannerId={recipeItem.ka_id}
                    />
                  ))}
              </div>
            );
          })}

          {/*
          Modaali, jossa käyttäjältä kysytään, haluaako
          hän lisätä reseptin Ateriasuunnittelijaan Omista
          Resepteistään vai Hakusivulta.
          */}
          <AnimatePresence>
            {addModalOpen && (
              <MealPlannerAddModal
                date={addModalDate}
                setOpenModal={toggleAddModalOpen}
                rdsAccount={rdsAccount}
              />
            )}
          </AnimatePresence>

          {/*
          Sivun alalaitaan poistomoodin päällä ollessa ilmestyvä
          valikko, jossa käyttäjä voi hyväksyä valittujen reseptien
          poiston tai peruuttaa sen.
          */}
          <AnimatePresence>
            {deletingMode ? (
              <motion.div
                key="deleteRecipesFromList"
                initial={{ y: 500 }} // Näkymän sijainti ennen animaatiota
                animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
                transition={{ duration: 0.3, ease: 'easeOut' }} // Kesto
                exit={{ y: 500 }} // Sijainti johon näkymää menee kadotessaan.
                className="deleteRecipesFromListContainer"
              >
                <div className="deleteRecipesFromList">
                  <h4>Reseptejä valittu: {recipesToDelete.length} kpl</h4>
                  <div onClick={deleteRecipesFromList}>
                    <Button
                      color="warning"
                      text="Poista listalta"
                      type="button"
                    />
                  </div>

                  <div
                    onClick={() => {
                      setRecipesToDelete([]);
                      toggleDeletingMode(false);
                    }}
                  >
                    <Button color="secondary" text="Peruuta" type="button" />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className={deletingMode ? 'moreMarginBottom' : ''} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MealPlanner;
