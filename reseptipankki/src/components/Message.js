import { React, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Message.css';
import DarkBG from './DarkBG';
import { motion } from 'framer-motion';

/*
Komponentti, joka sisältää vain pienen ilmoitusikkunan.
Käytetään näyttämään pieniä viestejä käyttäjille, esimerkiksi
linkin kopioimisen tai ilmiannon lähettämisen onnistumisen yhteydessä.
toggle = Funktio, joka sulkee viestin.
text = Viestissä näytettävä teksit.
seconds = Kauanko viesti on näkyvissä sekunteina.
*/
const Message = ({ toggle, text, seconds }) => {
  useEffect(() => {
    const tOut = setTimeout(() => {
      toggle(false);
    }, seconds * 1000);

    return () => clearTimeout(tOut);
  }, []);

  return (
    <div>
      <DarkBG toggleMenu={toggle} z={96} />

      <motion.div
        key="listRecipeAddMenu"
        initial={{ x: 700 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        exit={{ x: -700 }}
        className="messageBubble"
      >
        <p className="centerText">{text}</p>
      </motion.div>
    </div>
  );
};

// Parametrien tyypitykset.
Message.propTypes = {
  toggle: PropTypes.func,
  text: PropTypes.string,
  seconds: PropTypes.number,
};

export default Message;
