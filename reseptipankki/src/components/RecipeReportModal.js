import { React, useState } from 'react';
import DarkBG from './DarkBG';
import PropTypes from 'prop-types';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/RecipeReportModal.css';
import Message from './Message';

/*
Komponentti, joka sisältää reseptin ilmiantamisen ikkunan.
*/
const RecipeReportModal = ({ toggleMenu }) => {
  // Onko ilmianto jo lähetetty. Tällä estetään napin spämmääminen.
  const [reportSent, setReportSent] = useState(false);

  // Tila, jossa säilötään objekti, jossa on ilmiannon syyt booleaneina.
  const [reportReasons, setReportReasons] = useState({
    asiaton: false,
    harhaanjohtava: false,
    laaduton: false,
    muu_syy: false,
  });

  // Tila, jossa on tekstimuotoinen "muu syy".
  const [otherReason, setOtherReason] = useState('');

  // Boolean, joka kertoo näytetäänkö onnistumisesta kertova viesti.
  const [showMessage, toggleMessage] = useState(false);

  // Syyobjektin muuttamisesta vastaava funktio.
  const handleChange = ({ target }) => {
    setReportReasons({
      ...reportReasons,
      [target.name]: !reportReasons[target.name],
    });
  };

  // "Muu syy" -tekstikentän muuttamisesta vastaava funktio.
  const handleTextInputChange = (value) => {
    setOtherReason(value);
    // Jos tekstiä syötetään, muu_syy-syyn arvoksi laitetaan true.
    if (value && value.length > 0) {
      setReportReasons({
        ...reportReasons,
        muu_syy: true,
      });
    } else {
      // Jos teksti otettiin pois, muu_syy-syyn arvoksi laitetaan false.
      setReportReasons({
        ...reportReasons,
        muu_syy: false,
      });
    }
  };

  // Funktio, jossa hoidetaan ilmiannon lähettäminen tietokantaan.
  const submitReport = () => {
    if (
      (reportReasons.asiaton ||
        reportReasons.harhaanjohtava ||
        reportReasons.laaduton ||
        reportReasons.muu_syy) &&
      !reportSent
    ) {
      setReportSent(true);
      const reportObject = {
        ...reportReasons,
        muu_syy: reportReasons.muu_syy ? otherReason : false,
      };

      console.log(reportObject);

      // TO DO: Tähän pyyntö joka lähettää ilmiannon eteenpäin.

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
        key="recipeReportModal"
        initial={{ y: 700 }} // Näkymän sijainti ennen animaatiota
        animate={{ y: 0 }} // Näkymän sijainti animaation jälkeen
        transition={{ duration: 0.4 }} // Kesto ja pehmennys
        exit={{ y: 700 }} // Sijainti johon näkymä menee kadotessaan
        className="recipeReportModal"
      >
        <h2>Ilmianna resepti</h2>

        <div className="reportReasonsContainer">
          {Object.keys(reportReasons).map((item, index) => {
            return (
              <div className="reportReasonBox" key={index}>
                <input
                  onChange={handleChange}
                  type="checkbox"
                  name={item}
                  id={item}
                  checked={reportReasons[item]}
                />
                <label htmlFor={item}>
                  {item.replace(/_/g, ' ')}
                  {item === 'muu_syy' ? ':' : ''}
                </label>
              </div>
            );
          })}
        </div>

        <div className="otherReasonContainer">
          <input
            value={otherReason}
            onChange={(event) => handleTextInputChange(event.target.value)}
            type="text"
          />
        </div>

        <div className="reportButton" onClick={submitReport}>
          <Button color="warning" text="Ilmianna" type="submit" />
        </div>

        {/* Ilmiannon jälkeen näkyviin laitetaan pieni ilmoitus: */}
        <AnimatePresence>
          {showMessage && (
            <Message
              text="Ilmianto lähetetty!"
              toggle={toggleMessage}
              seconds={1.5}
            />
          )}
        </AnimatePresence>

        <div onClick={() => toggleMenu(false)}>
          <Button color="secondary" text="Peruuta" type="submit" />
        </div>
      </motion.div>
    </div>
  );
};

RecipeReportModal.propTypes = {
  toggleMenu: PropTypes.func,
};

export default RecipeReportModal;