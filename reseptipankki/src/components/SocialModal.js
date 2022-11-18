import React from 'react';
import DarkBG from './DarkBG';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import '../styles/SocialModal.css';
import { BiCopyAlt } from 'react-icons/bi';

import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

/*
Tämä komponentti sisältää ikkunan, jossa on vaihtoehtoja reseptin/listan
jakamiselle. Jakamisessa käytetään "react-share"-nimistä pakettia.

toggleMenu = funktio, joka sulkee ikkunan. Ajetaan DarkBG-komponentissa.
item = merkkijono, tieto siitä mitä jaetaan, joko "resepti" tai "lista".
url = osoite, joka lähetetään jakamisen yhteydessä.
*/
const SocialModal = ({ toggleMenu, item, url }) => {
  return (
    <div>
      <DarkBG toggleMenu={toggleMenu} z={94} />

      <motion.div
        key="listRecipeAddMenu"
        initial={{ y: 700 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.4 }} // Kesto ja pehmennys
        exit={{ y: 700 }} // Sijainti johon näkymä menee kadotessaan
        className="socialModalContainer"
      >
        <h2>Jaa {item}</h2>

        <div className="shareButtons">
          {/* Reseptin tai listan linkin kopioiminen leikepöydälle */}
          <div className="shareButtonContainer">
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              className="shareButton buttonInvisible"
            >
              <BiCopyAlt className="copyLinkIcon" /> <p>Kopioi linkki</p>
            </button>
          </div>

          {/* Reseptin tai listan jakaminen WhatsAppissa */}
          <div className="shareButtonContainer">
            <WhatsappShareButton
              url={url}
              title={`Hei! Käy katsomassa tämä ${
                item === 'resepti' ? item : 'reseptilista'
              } Brita-sovelluksessa:`}
              className="shareButton"
            >
              <WhatsappIcon size={50} round={true} /> <p>WhatsApp</p>
            </WhatsappShareButton>
          </div>

          {/* Reseptin tai listan jakaminen Facebookissa */}
          <div className="shareButtonContainer">
            <FacebookShareButton
              url={url}
              quote={`Hei! Käy katsomassa tämä ${
                item === 'resepti' ? item : 'reseptilista'
              } Brita-sovelluksessa:`}
              hashtag="#reseptit #brita"
              className="shareButton"
            >
              <FacebookIcon size={50} round={true} /> <p>Facebook</p>
            </FacebookShareButton>
          </div>

          {/* Reseptin tai listan jakaminen sähköpostitse */}
          <div className="shareButtonContainer">
            <EmailShareButton
              url={url}
              subject="Herkullinen resepti!"
              body={`Hei! Käy katsomassa tämä ${
                item === 'resepti' ? item : 'reseptilista'
              } Brita-sovelluksessa: `}
              className="shareButton"
            >
              <EmailIcon size={50} round={true} /> <p>Sähköposti</p>
            </EmailShareButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

SocialModal.propTypes = {
  toggleMenu: PropTypes.func,
  item: PropTypes.string,
  url: PropTypes.string,
};

export default SocialModal;