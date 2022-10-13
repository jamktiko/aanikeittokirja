/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
import { React, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/RecipeAddForm.css';
import '../styles/Slider.css';
import Button from './Button';
import { useNavigate, useLocation } from 'react-router-dom';

/*
Reseptien lisäämisessä/muokkauksessa käytettävä lomake, jossa on kentät kaikille
reseptien tiedoille, sekä lopussa painike joka lisää/tallettaa reseptin.
*/
const RecipeAddForm = () => {
  // Luodaan funktio, jolla voidaan navigoida eri sivuille.
  // Tässä tapauksessa reseptinäkymään reseptin lisäyksen jälkeen.
  const navigate = useNavigate();

  window.history.replaceState({}, '');

  const recipeData = useLocation().state?.recipeData;
  const ingredientsData = useLocation().state?.ingredientsData;

  console.log('iD: ', ingredientsData);

  /*
  Refit ovat kohteita sivulla, joihin voidaan navigoida.
  Tarvitaan, jotta näytetään oikeaa kohtaa jos reseptistä puuttuu
  jotain kun se lähetetään.
  */
  const refName = useRef();
  const refIngredients = useRef();
  const refDirections = useRef();

  /*
  Ainesosaluettelon jokaisella aineksella on oltava oma, uniikki ID, jotta
  oikean aineksen poistaminen onnistuu. ID:t generoidaan tällä useStatella.
  */
  const [idNumber, setIdNumber] = useState(1);

  // Reseptin nimen tila:
  const [name, setName] = useState(recipeData?.nimi);

  // Reseptin ainesosaluettelon tila:
  const [ingredients, setIngredients] = useState([
    {
      id: idNumber,
      aines: '',
      maara: '',
      yksikko: '',
    },
  ]);

  // Ainesosien määrien yksiköt, tulevat drop-down valikkoon.
  const measures = [
    '',
    'kpl',
    'tl',
    'rkl',
    'ml',
    'dl',
    'l',
    'mg',
    'g',
    'kg',
    'pkt',
    'tlk',
    'prk',
    'rs',
    'pss',
  ];

  // Reseptin valmistusohjeiden tila:
  const [directions, setDirections] = useState(recipeData?.ohjeet);

  const times = [
    'Alle 5 min',
    '5-15 min',
    '15-30 min',
    '30-60 min',
    '1-2 tuntia',
    'Yli 2 tuntia',
  ];
  // Reseptin valmistusajan tila (välillä 0-5):
  const [time, setTime] = useState(
    times.indexOf(recipeData ? recipeData?.valmistusaika : 0)
  );

  // Reseptin annosmäärän tila:
  const [mealCount, setMealCount] = useState(recipeData?.annosten_maara);

  // Lomakkeella valittavat erikoisruokavaliot:
  const dietsArray = [
    'kasvis',
    'vegaaninen',
    'gluteeniton',
    'laktoositon',
    'maidoton',
    'kananmunaton',
    'vähärasvainen',
    'vähähiilihydr.',
  ];

  // Objekti, johon lisätään avain-arvo pari jokaiselle erikoisruokavaliolle.
  const dietsObj = {};

  // Erikoisruokavalioiden lisääminen objektiin.
  dietsArray.forEach((diet) => {
    dietsObj[diet] = false;
  });

  // Erikoisruokavalioiden tila:
  const [diets, setDiets] = useState(
    recipeData ? JSON.parse(recipeData.erikoisruokavaliot) : dietsObj
  );

  // Lomakkeella valittavat kategoriat:
  const categoriesArray = [
    'alkuruoat',
    'pääruoat',
    'jälkiruoat',
    'leivonnaiset',
    'keitot',
    'juomat',
  ];

  // Objekti, johon lisätään avain-arvo pari jokaiselle kategorialle.
  const categoriesObj = {};

  // Kategorioiden lisääminen objektiin.
  categoriesArray.forEach((cat) => {
    categoriesObj[cat] = false;
  });

  let kat;
  if (recipeData) {
    kat = JSON.parse(recipeData.kategoriat);
    Object.keys(kat).forEach(function (key) {
      switch (JSON.parse(recipeData.kategoriat)[key]) {
        case 1:
          kat[key] = true;
          break;
        case 0:
          kat[key] = false;
          break;
        default:
          break;
      }
    });
  }

  // Kategorioiden tila:
  const [categories, setCategories] = useState(
    recipeData?.kategoriat ? kat : categoriesObj
  );

  // Julkisuuden tila (0 = yksityinen, 1 = julkinen):
  const [publicity, togglePublicity] = useState(recipeData?.julkinen);

  // Funktio, jolla lisätään uusi rivi ainesosien listaan.
  const addIngredient = () => {
    // Käyttämätön ID generoidaan lisäämällä idNumberiin 1.
    const idNumberCopy = idNumber + 1;
    setIdNumber(idNumberCopy);
    // Uuden ainesosaobjektin lisääminen:
    setIngredients([
      ...ingredients,
      {
        id: idNumberCopy,
        aines: '',
        maara: '',
        yksikko: '',
      },
    ]);
  };

  // Vaihtaa ingredients-taulukon "index"-alkion namen "valuen" arvoksi.
  const editIngredientName = (index, value) => {
    const ingredientsCopy = ingredients;
    ingredientsCopy[index].aines = value;
    setIngredients(ingredientsCopy);
  };

  // Vaihtaa ingredients-taulukon "index"-alkion amountin "valuen" arvoksi.
  const editIngredientAmount = (index, value) => {
    const ingredientsCopy = ingredients;
    ingredientsCopy[index].maara = value.replace(/,/g, '.');
    setIngredients(ingredientsCopy);
  };

  // Vaihtaa ingredients-taulukon "index"-alkion measuren "valuen" arvoksi.
  const editIngredientMeasure = (index, value) => {
    const ingredientsCopy = ingredients;
    ingredientsCopy[index].yksikko = value;
    setIngredients(ingredientsCopy);
  };

  // Poistaa ainesosalistalta indeksin mukaisen aineksen
  const removeIngredient = (index) => {
    const ingredientsCopy = ingredients;
    ingredientsCopy.splice(index, 1);
    setIngredients([...ingredientsCopy]);
  };

  // Varmistaa että tekstikenttä on tarpeeksi korkea näyttämään koko reseptin.
  const textAreaHeightEdit = (e) => {
    e.target.style.height = 'inherit';
    const computed = window.getComputedStyle(e.target);
    const height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding-top'), 10) +
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue('padding-bottom'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    e.target.style.height = `${height}px`;
  };

  // Vaihtaa tietyn erikoisruokavalion (diet) tilan vastakkaiseksi.
  const changeRecipeDiets = (diet) => {
    const copy = { ...diets };
    copy[diet] = !copy[diet];

    // Tehdään ruokavaliomuutoksen vaatimat päivitykset.
    // Esim. vegaanisuus vaatii että "kasvis" on lukittu trueksi, jne.
    // Switchissä on myös case joka poistaa lukitukset.
    switch (true) {
      case diet === 'vegaaninen' && copy[diet] === true:
        copy.kasvis = 'lock'; // Arvoa lock käytetään disabloimaan checkbox
        copy.maidoton = 'lock';
        copy.laktoositon = 'lock';
        copy.kananmunaton = 'lock';
        break;

      case diet === 'vegaaninen' && copy[diet] === false:
        copy.kasvis = false;
        copy.maidoton = false;
        copy.laktoositon = false;
        copy.kananmunaton = false;

      default:
        break;
    }

    setDiets(copy);
  };

  // Vaihtaa tietyn erikoisruokavalion (cat) tilan vastakkaiseksi.
  const changeRecipeCategories = (cat) => {
    const copy = categories;
    copy[cat] = !copy[cat];
    setCategories(copy);
  };

  // Funktio jolla muutetaan reseptin julkisuus-booleania.
  const setPublicityBoolean = (event) => {
    if (event.target.value === 'true') {
      togglePublicity(1);
    } else {
      togglePublicity(0);
    }
  };

  // Funktio jolla siirrytään tiettyyn ref-pisteeseen.
  const scrollTo = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (recipeData && ingredientsData) {
      setIngredients(ingredientsData);
    }
  }, []);

  /*
  Lomakkeen tietojen validointi.Parametri ing on
  submitissa filtteröity ainesosataulukko.
  */
  const submitValidation = (ing) => {
    // Nimi ei saa olla tyjä.
    if (name === '' || name === undefined) {
      console.log('Nimi puuttuu!');
      scrollTo(refName);
      return false;
    }

    // Ainesosataulukko ei saa olla tyhjä, ensimmäisellä alkiolla on oltava nimi
    if (ing.length === 0 || ing[0].aines === '' || ing[0].aines === undefined) {
      console.log('Ainekset puuttuvat!');
      scrollTo(refIngredients);
      return false;
    }

    // Reseptin ohjeet-kohta ei saa olla tyhjä.
    if (directions === '' || directions === undefined) {
      console.log('Ohjeet puuttuvat!');
      scrollTo(refDirections);
      return false;
    }
    return true;
  };

  // Lomakkeen lähetysfunktio
  const submit = (event) => {
    event.preventDefault(); // estää sivun uudelleenlatautumisen

    // Poistetaan ainesosataulukosta alkiot joiden nimi on tyhjä.
    const ingredientsFiltered = ingredients.filter((i) => i.aines);

    // Muunnetaan ainesosaobjektit oikeaan muotoon:
    ingredientsFiltered.forEach((e) => {
      JSON.stringify(e);
    });

    // Vaihdetaan diets-objektin truet 1:ksi ja falset 0:ksi.
    Object.keys(diets).forEach(function (diet) {
      if (diets[diet] === true) {
        diets[diet] = 1;
      } else {
        diets[diet] = 0;
      }
    });

    // Vaihdetaan categories-objektin truet 1:ksi ja falset 0:ksi.
    Object.keys(categories).forEach(function (cat) {
      if (categories[cat] === true) {
        categories[cat] = 1;
      } else {
        categories[cat] = 0;
      }
    });

    /*
    Lomakkeen resepti "lähetetään" vain jos se läpäisee
    submitValidation-funktion.
    */
    if (submitValidation(ingredientsFiltered)) {
      // Luodaan reseptiobjekti, joka liitetään post-pyyntöön.
      const recipeObject = {
        nimi: name,
        ohjeet: directions,
        erikoisruokavaliot: JSON.stringify(diets),
        kategoriat: JSON.stringify(categories),
        valmistusaika: times[time],
        annosten_maara: mealCount,
        kuva: null,
        julkinen: publicity,
        uusi: 1,
        kayttaja_k_id: 7,
        ainekset: ingredientsFiltered,
      };

      // Pyyntö, joka lähettää reseptin tietokantaan.
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/resepti`, recipeObject)
        .then((res) => {
          navigate(`/reseptit/${res.data.id}`);
        })
        .catch((error) => {
          console.error('Adding recipe failed: ', error);
        });
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        {/* Tämä div on piste, johon navigoidaan jos reseptiä lähetettäessä
        siltä puuttuu nimi. Ilman tätä navigointi jäisi liian alas. */}
        <div className="refDivAbsolute" ref={refName} />

        <div className="recipeFormContainer">
          <div className="recipeName">
            <h3>Reseptin nimi</h3>
            <input
              onInvalid={(e) =>
                e.target.setCustomValidity('Lisää reseptille nimi!')
              }
              onInput={(e) => e.target.setCustomValidity('')}
              className="textInput"
              value={name}
              maxLength="45"
              onChange={({ target }) => setName(target.value)}
            />
          </div>

          <div className="divider" />

          <div className="refDivRelative" ref={refIngredients} />

          <div className="ingredients">
            <h3>Ainekset</h3>

            <table className="ingredientInputTable">
              <thead>
                <tr className="tableHeaders">
                  <th width="60%">Aines</th>
                  <th width="20%">Määrä</th>
                  <th width="20%">Yksikkö</th>
                </tr>
              </thead>
              <tbody>
                {/* Luo jokaiselle ingredients-taulukon alkiolle oman rivin: */}
                {ingredients?.map((item, index) => {
                  return (
                    <tr className="ingredientRow" key={item.ai_id}>
                      <td>
                        <input
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              'Reseptillä on oltava vähintään yksi ainesosa!'
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity('')}
                          className="ingredientNameInput tableInput"
                          onChange={({ target }) =>
                            editIngredientName(index, target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="ingredientAmountInput tableInput"
                          onChange={({ target }) =>
                            editIngredientAmount(index, target.value)
                          }
                        />
                      </td>

                      <td>
                        <select
                          className="ingredientMeasureInput tableInput"
                          onChange={({ target }) =>
                            editIngredientMeasure(index, target.value)
                          }
                        >
                          {measures.map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                        {index !== 0 ? (
                          <div
                            onClick={() => removeIngredient(index)}
                            className="ingredientRemoveButtonContainer"
                          >
                            <p className="ingredientRemoveButton">✖</p>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div onClick={() => addIngredient()}>
              <Button type="button" color="secondary" text="+ Uusi aines" />
            </div>
          </div>

          <div className="divider" />

          <div className="refDivRelative" ref={refDirections} />

          <div className="recipeDirections">
            <h3>Ohjeet</h3>
            <textarea
              onInvalid={(e) =>
                e.target.setCustomValidity('Kirjoita reseptin valmistusohjeet!')
              }
              onInput={(e) => e.target.setCustomValidity('')}
              rows={4}
              className="textInputLarge textInput"
              value={directions}
              onKeyDown={(e) => textAreaHeightEdit(e)}
              placeholder="Kirjoita reseptin työvaiheet tähän"
              onChange={({ target }) => setDirections(target.value)}
            />
          </div>

          <div className="divider" />

          <div className="timeSlider">
            <h3 className="timeHeader">
              <span>Valmistusaika</span>{' '}
              <span className="timeText">{times[time]}</span>
            </h3>

            <div className="slidecontainer">
              <input
                type="range"
                min="0"
                max="5"
                value={time}
                onChange={({ target }) => setTime(target.value)}
                className="slider"
              />
            </div>
          </div>

          <div className="mealCount">
            <h3>Annosmäärä</h3>
            <div className="mealCountCounter">
              <span
                onClick={() => {
                  if (mealCount !== 1) setMealCount(mealCount - 1);
                }}
              >
                −
              </span>
              <span>{mealCount}</span>
              <span
                onClick={() => {
                  if (mealCount < 20) setMealCount(mealCount + 1);
                }}
              >
                +
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="diets">
            <h3>Erikoisruokavaliot</h3>

            <div className="checkboxGrid">
              {dietsArray.map((item, index) => {
                return (
                  <div key={index} className="checkbox">
                    <input
                      onChange={() => changeRecipeDiets(item)}
                      type="checkbox"
                      id={`dietCheckbox${index}`}
                      checked={diets[item]}
                      disabled={diets[item] === 'lock' ? true : false}
                    />
                    <label htmlFor={`dietCheckbox${index}`}>{item}</label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="divider" />

          <div className="categories">
            <h3>Kategoriat</h3>

            <div className="checkboxGrid">
              {categoriesArray.map((item, index) => {
                return (
                  <div key={index} className="checkbox">
                    <input
                      onChange={() => changeRecipeCategories(item)}
                      type="checkbox"
                      checked={categories[item]}
                      id={`catCheckbox${index}`}
                    />
                    <label htmlFor={`catCheckbox${index}`}>{item}</label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="divider" />

          <div className="publicity">
            <h3>Reseptin julkisuus</h3>

            <div className="radioButtons">
              <div>
                <input
                  onChange={setPublicityBoolean}
                  type="radio"
                  value={false}
                  name="publicity"
                  id="private"
                  checked={publicity === 0}
                />
                <label htmlFor="private">Yksityinen</label>
              </div>
              <div>
                <input
                  onChange={setPublicityBoolean}
                  type="radio"
                  value={true}
                  name="publicity"
                  id="public"
                  checked={publicity === 1}
                />
                <label htmlFor="public">Julkinen</label>
              </div>
            </div>
          </div>

          {/* Lomakkeen lähetysnappi */}
          <div className="submitButtonContainer">
            <Button type="submit" color={'primary'} text={'Lisää resepti'} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeAddForm;
