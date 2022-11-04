import numericQuantity from 'numeric-quantity';

/*
Tämä tiedosto sisältää funktiot, jotka muuntavat yhdessä stringissä
olevan ainesosaluettelon sovelluksen vaatimaan muotoon, eli objekti-
taulukoksi.
*/

// Taulukko niistä ainesten määrien lyhenteistä, joita tekstistä etsitään.
const measures = [
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

/*
Funktio, joka etsii tekstiriviltä (line), measures-taulukossa olevia lyhenteitä.
*/
const findUnitLocation = (line) => {
  // Muuttuja, joka funktion lopussa palautetaan täydennettynä.
  let returnedValue;

  // Käydään läpi jokainen measures-taulukon lyhenne.
  for (let i = 0; i < measures.length; i++) {
    // Käsiteltävän substringin (lyhenteen) mahdollinen sijainti teksirivillä.
    const sub = [
      line.indexOf(measures[i]),
      line.indexOf(measures[i]) + measures[i].length - 1,
    ];

    /*
    Jos lyhenne löytyy tekstiriviltä, suoritetaan sille muutama tarkastus,
    joilla pyritään varmistamaan, että lyhenne on nimenomaan aineksen määrää
    selventävä yksikkö, eikä esimerkiksi keskellä aineksen nimeä oleva
    merkkijono.
    */
    if (
      // Varmistetaan, että lyhenne löytyy tekstiriviltä.
      sub[0] !== -1 &&
      // Katsotaan, onko lyhenteen jälkeen oleva merkki välilyönti tai tyhjää.
      (line.charAt(sub[1] + 1) === ' ' || line.charAt(sub[1] + 1) === '') &&
      // Katsotaan, onko lyhennettä edeltävä merkki välilyönti tai numero.
      (line.charAt(sub[0] - 1) === ' ' || /^\d+$/.test(line.charAt(sub[0] - 1)))
    ) {
      // Laitetaan lyhenne palautettavaan muuttujaan.
      returnedValue = sub;
      break;
    }
  }
  return returnedValue;
};

const findAmount = (line) => {
  const amountAtStart = line.trim().replace(/[^\d.-].*/, '');

  if (/\d/.test(amountAtStart)) return amountAtStart;

  const amountAtEnd = line.trim().match(/\d*\.*\-*\d*$/);
  if (amountAtEnd && /\d/.test(amountAtEnd[0])) return amountAtEnd[0];
};

/*
Muuntaa yhden ainesosan sisältävän rivin (line) vaaditunmuotoiseksi objektiksi.
*/
const convertOneLine = (line) => {
  /*
  Ensimmäisenä etsitään riviltä ainesosan määrän mahdollinen yksikkölyhenne.
  findUnitLocation-funktio etsii sellaisen mahdollisen sijainnin, ja
  laittaa sen unitLocation-vakioon. Jos sijainti löytyi, tekstirivistä
  leikataan kyseinen yksikkö measure-muuttujaan.
  */
  let measure = '';
  const unitLocation = findUnitLocation(line);
  if (unitLocation) measure = line.slice(unitLocation[0], unitLocation[1] + 1);

  /*
  Toisena tekstiriviltä etsitään aineksen mahdollinen määrä, jonka
  tekee findAmount-funktio, johon syötetään rivi, josta on poistettu
  äsken mahdollisesti löydetty yksikkölyhenne.
  */
  let amount = findAmount(line.replace(measure, '')) || '';

  /*
  Kolmantena tekstiriviltä otetaan aineksen nimi. Se on kaikki teksti,
  mitä jää jäljelle, kun riviltä poistetaan yksikkö ja määrä.
  */
  const ingredient = line.replace(measure, '').replace(amount, '');

  // Poistetaan määrän muuttujaan mahdollisesti jääneet välilyönnit.
  amount = amount.trim();

  /*
  Jos ainesosan määrässä on viiva, kuten (4-5 dl), aineksen
  objektiin jätetään vaihtoehdoista pienin arvo, eli viivaa
  edeltävä luku, koska sovelluksemme ei muuten osaa käsitellä sitä.
  */
  if (amount.includes('-')) amount = amount.split('-')[0];

  // Palautetaan tekstirivistä kerätystä datasta koostuva objekti.
  return {
    aines: ingredient.trim(),
    maara: amount,
    yksikko: measure.trim(),
  };
};

// Muuntaa merkkijonossa (line) olevat murtoluvut desimaaleiksi.
const convertFractions = (line) => {
  // Regex-koodi, joka löytää murtoluvut:
  const regex = /(([1-9]+\d*\s)?(\d+)\/(\d+))/;

  // Etsitään regexin mukaiset merkkijonot tekstirivistä.
  const txt = regex.exec(line);

  /*
  Jos murtolukuja löytyi, ne korvataan desimaaliluvuilla, kuten 2 1/2 => 2.5,
  tähän käytetään pakettia numeric-quantity.
  */
  if (txt) {
    return line.replace(txt[0], numericQuantity(txt[0]));
  }
  return line;
};

// Funktio, josta ainesluettelon sisältävän tekstin käsittely alkaa.
const covertIngredients = (text) => {
  // Muunnetaan tekstin jokainen rivi taulukon alkioksi.
  const linesArray = text.match(/[^\r\n]+/g);

  /*
  Käydään läpi juuri luodun taulukon jokainen alkio, ja lähetetään
  siinä oleva string funktioon, joka muuntaa sen murtoluvut desimaaleiksi.
  */
  for (let i = 0; i < linesArray.length; i++) {
    linesArray[i] = convertFractions(linesArray[i]);
  }

  // Luodaan taulukko, johon valmiit ainesosaobjektit lisätään.
  const ingredientsData = [];

  /*
  Käydään jokainen ainesosarivi läpi. Ne lähetetään funktioon, joka
  muuntaa ne oikeamuotoisiksi objekteiksi.
  */
  linesArray.forEach((line) => {
    const converted = convertOneLine(line);

    // Lisätään vain ne objektit, joissa on nimetty jokin ainesosa.
    if (/[a-zA-Z]/.test(converted.aines) && converted.aines.length > 1) {
      ingredientsData.push(converted);
    }
  });

  // Palautetaan valmis ainesosien objektien taulukko.
  return ingredientsData;
};

export default covertIngredients;
