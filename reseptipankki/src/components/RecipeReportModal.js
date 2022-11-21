import { React, useState } from 'react';
import DarkBG from './DarkBG';
import PropTypes from 'prop-types';
import Button from './Button';
import { motion } from 'framer-motion';
import '../styles/RecipeReportModal.css';

const RecipeReportModal = ({ toggleMenu }) => {
  const [reportReasons, setReportReasons] = useState({
    asiaton: false,
    harhaanjohtava: false,
    laaduton: false,
    muu_syy: false,
  });
  const [otherReason, setOtherReason] = useState('');

  const handleChange = ({ target }) => {
    setReportReasons({
      ...reportReasons,
      [target.name]: !reportReasons[target.name],
    });
  };

  const handleTextInputChange = (value) => {
    setOtherReason(value);
    if (value && value.length > 0) {
      setReportReasons({
        ...reportReasons,
        muu_syy: true,
      });
    } else {
      setReportReasons({
        ...reportReasons,
        muu_syy: false,
      });
    }
  };

  const submitReport = () => {
    if (
      reportReasons.asiaton ||
      reportReasons.harhaanjohtava ||
      reportReasons.laaduton ||
      reportReasons.muu_syy
    ) {
      const reportObject = {
        ...reportReasons,
        muu_syy: reportReasons.muu_syy ? otherReason : false,
      };

      console.log('report: ', reportObject);
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
