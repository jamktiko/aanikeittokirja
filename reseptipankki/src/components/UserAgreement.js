/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import '../styles/UserRegisterLoginPage.css';

const UserAgreement = ({ togglePage }) => {
  return (
    <div className="userAgreementPageModal">
      <div className="userAgreementPageContainer">
        <h2>1. Käyttöehdot</h2>

        <p>
          Näitä käyttöehtoja ("Käyttöehdot") sovelletaan Brita-sovelluksen
          ("Sovellus") käyttöön.
        </p>

        <h2>2. Vastuunrajoitukset</h2>

        <p>
          Sovellus on kehitysvaiheessa eikä ole tarkoitettu jokapäiväiseen
          käyttöön. Sovellus on osa Jyväskylän Ammattikorkeakoulun
          Ticorporate-sovelluskehityskurssia ("Kurssi"). Sovelluksessa saattaa
          ilmetä käyttökatkoksia tai muita teknisiä ongelmia.
        </p>

        <p>Sovellus saatetaan ottaa pois käytöstä ilmoittamatta.</p>

        <h2>3. Tietosi ja niiden käyttö</h2>

        <p>
          Jotta voit käyttää Sovelluksen kaikkia ominaisuuksia, tulee sinun
          antaa meille etunimesi ja sähköpostiosoitteesi sekä vapaavalintaisesti
          sukunimesi ("Tiedot"). Etunimeä käytetään sovelluksen etusivulla
          näkyvässä tervehdyksessä, sähköpostiosoitteella tunnistaudutaan
          tietyksi käyttäjäksi ja sukunimeä ei käytetä missään.
        </p>

        <p>
          Rekisteröitymällä Sovellukseemme hyväksyt Tietojesi tallennuksen
          Amazon.comin (Amazon Web Services) Irlannissa-sijaitsevalle
          palvelimelle.
        </p>

        <p>
          Pidätämme oikeuden poistaa käyttäjätunnuksesi, jos käytät Sovellusta
          hyvien tapojen vastaisesti. Kaikkien rekisteröityneiden käyttäjien
          Tiedot poistetaan palvelimelta Kurssin päätyttyä.
        </p>

        <h2>4. Vastuusi</h2>

        <p>
          Vastaat itse Sovellukseen lisäämiesi reseptien ja kuvien
          tekijänoikeuksista.
        </p>

        <div onClick={() => togglePage(false)}>
          <Button color="primary" text="sulje" type="button" />
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
