/* eslint-disable operator-linebreak */
import { React, useState } from 'react';
import DarkBG from './DarkBG';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SocialModal.css';
import { BiCopyAlt } from 'react-icons/bi';
import Message from './Message';

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
  const [showMessage, toggleMessage] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = () => {
    if (!linkCopied) {
      setLinkCopied(true);
      navigator.clipboard.writeText(url);
      toggleMessage(true);
      setTimeout(() => {
        toggleMenu(false);
      }, 2000);
    }
  };

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
            <button onClick={copyLink} className="shareButton buttonInvisible">
              <BiCopyAlt className="copyLinkIcon" /> <p>Kopioi linkki</p>
            </button>
          </div>

          {/* Linkin kopioimisen jälkeen näkyviin laitetaan pieni ilmoitus: */}
          <AnimatePresence>
            {showMessage && (
              <Message
                text="Kopioitu leikepöydälle!"
                toggle={toggleMessage}
                seconds={1.5}
              />
            )}
          </AnimatePresence>

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
              subject={`${
                item === 'resepti'
                  ? 'Herkullinen resepti!'
                  : 'Lista herkullisia reseptejä!'
              }`}
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
