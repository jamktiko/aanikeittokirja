import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/*
Tämä komponentti pimentää koko näkymän taustaa hieman. Laita näkyviin
esim. sivuvalikon tai ikkunoiden tullessa näkyviin. ToggleMenu-parametri
on funktio, joka sulkee pimennyksen päällä olevan sivuvalikon tai ikkunan.
Sitä tarvitaan tässä komponentissa, jotta valikko/ikkuna sulkeutuu kun sen
vierestä painaa (eli käytännössä painaa pimennettyä kohtaa näytöstä).

Numerotyyppinen z-parametri määrittää komponentin z-indeksin, eli millä tasolla
se on. Tarvitaan, koska eri tilanteissa tumman taustan on oltava hieman eri
tasoilla.
*/
const DarkBG = ({ toggleMenu, z }) => {
  return (
    /*
    Diviin lisätään "motion", jonka avulla Framer-motionin animaatiot
    voidaan ottaa käyttöön.
    */
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }} // Näkymän ennen animaatiota (läpinäkyvä)
      animate={{ opacity: 1 }} // Näkymän animaation jälkeen (näkyvä)
      transition={{ duration: 0.25 }} // Animaation kesto.
      exit={{ opacity: 0 }} // Tila johon näkymä animoituu sen kadotessa.
      onClick={() => toggleMenu()}
      onTouchEnd={() => toggleMenu()}
      className="overlay"
      style={{ zIndex: z }}
    ></motion.div>
  );
};

// toggleMenun tyypin määritys (funktio).
DarkBG.propTypes = {
  toggleMenu: PropTypes.func,
  z: PropTypes.number,
};

export default DarkBG;
