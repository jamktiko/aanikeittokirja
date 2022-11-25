import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import DarkBG from './DarkBG';
import Button from './Button';
import { useNavigate } from 'react-router';
import '../styles/MealPlannerAddModal.css';

const MealPlannerAddModal = ({ date, setOpenModal, rdsAccount }) => {
  const navigate = useNavigate();

  return (
    <div>
      <DarkBG toggleMenu={setOpenModal} z={94} />

      <motion.div
        key="mealPlannerAddModal"
        initial={{ y: 700 }} // Näkymän ennen animaatiota (läpinäkyvä)
        animate={{ y: 0 }} // Näkymän animaation jälkeen (näkyvä)
        transition={{ duration: 0.4 }} // Animaation kesto.
        exit={{ y: 700 }} // Tila johon näkymä animoituu sen kadotessa.
        className="mealPlannerAddModalContainer"
      >
        <h3>
          Lisää resepti {date.getUTCDate() + 1}.{date.getMonth() + 1}.
        </h3>

        <div
          onClick={() => {
            navigate('/reseptit', {
              state: { mealPlannerDate: date, mealPlannerKId: rdsAccount.k_id },
            });
          }}
        >
          <Button color="primary" text="Omat reseptit" />
        </div>

        <div>
          <Button color="secondary" text="Hae" />
        </div>
      </motion.div>
    </div>
  );
};

MealPlannerAddModal.propTypes = {
  date: PropTypes.object,
  setOpenModal: PropTypes.func,
  rdsAccount: PropTypes.any,
};

export default MealPlannerAddModal;
