import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import '../styles/UserRegisterLoginPage.css';

const UserAgreement = ({ togglePage }) => {
  return (
    <div className="userAgreementPageModal">
      <div className="userAgreementPageContainer">
        <h2>Käyttöehdot</h2>

        <p>1. Lorem Ipsum</p>
        <p>2. Lorem Ipsum</p>
        <p>3. Lorem Ipsum</p>

        <div onClick={() => togglePage(false)}>
          <Button color="secondary" text="sulje" type="button" />
        </div>
      </div>
    </div>
  );
};

// Parametrien tyypitykset.
UserAgreement.propTypes = {
  togglePage: PropTypes.func,
};

export default UserAgreement;
