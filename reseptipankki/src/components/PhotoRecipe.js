/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import PhotoRecipeCropper from './PhotoRecipeCropper';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

import '../styles/PhotoRecipe.css';
import '../styles/ImageInput.css';
import 'react-image-crop/dist/ReactCrop.css';

import covertIngredients from '../hooks/ingredientsConverter';

const AWS = require('aws-sdk');

/*
Reseptin skannaaminen/lisääminen kuvasta.
*/
const RecipePhoto = () => {
  const navigate = useNavigate();

  /*
  Skannausprosessin vaiheen tila:
  0 = Kuvan valinta / ottaminen
  1 = Nimen rajaus
  2 = Ainesten rajaus
  3 = Vaihdeiden rajaus
  */
  const [stage, setStage] = useState(0);

  // Rajaamattomann kuvan tila:
  const [image, setImage] = useState({
    image: null,
    source: null,
  });

  // Rajattujen kuvien tilat:
  const [croppedImage1, setCroppedImage1] = useState();
  const [croppedImage2, setCroppedImage2] = useState();
  const [croppedImage3, setCroppedImage3] = useState();

  // Rekognitionin käyttöönottoon liittyvät asetukset:
  const config = new AWS.Config({});
  AWS.config.update({ region: 'eu-west-1' });
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });
  // eslint-disable-next-line new-cap
  const client = new AWS.Rekognition();

  // Muuttaa rajatut kuvat AWS Rekognitionin vaatimaan muotoon:
  const convertImage = (encodedFile) => {
    const base64Image = encodedFile.split('data:image/jpeg;base64,')[1];
    const binaryImg = atob(base64Image);
    const length = binaryImg.length;
    const ab = new ArrayBuffer(length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }
    const blob = new Blob([ab], {
      type: 'image/jpeg',
    });
    return ab;
  };

  /*
  Muuttaa kuvan oikeaan muotoon (convertImage), lähettää sen
  AWS Rekognition-palveluun (client)
  */
  const imageToText = (image) => {
    return new Promise((resolve, reject) => {
      const imageBlob = image.image;
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const imageInCorrectFormat = convertImage(reader.result);
        const params = {
          Image: {
            Bytes: imageInCorrectFormat,
          },
        };
        client.detectText(params, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.TextDetections);
          }
        });
      });

      reader.readAsDataURL(imageBlob);
    });
  };

  // Laittaa taulukon kaikki stringit yhteen pitkään stringiin.
  const multilineResultsToOneString = (results) => {
    let finishedText = '';
    results.forEach((line) => {
      if (line.Type === 'LINE') {
        // Jokaisen lisätyn stringin perään laitetaan rivinvaihto.
        finishedText += `${line.DetectedText} \n`;
      }
    });
    return finishedText;
  };

  /*
  Funktio, joka käsittelee rajatut kuvat ja niistä saadun tekstin,
  ja siirtyy sitten reseptinlisäyskomponenttiin tietojen kanssa.
  */
  const finishScanning = async () => {
    // imageToText-funktio kerää tekstin rajatuista kuvista.
    const nameResults = await imageToText(croppedImage1);
    const ingredietsResults = await imageToText(croppedImage2);
    const directionsResults = await imageToText(croppedImage3);

    // Otetaan reseptin nimi 1. rajatusta kuvasta saadusta tekstidatasta:
    const recipeName = nameResults[0] ? nameResults[0].DetectedText : '';

    // Käsitellään 2. ja 3. rajatusta kuvasta saadut datat mRTOS-funktiossa:
    const recipeIngredients = multilineResultsToOneString(ingredietsResults);
    const recipeDirections = multilineResultsToOneString(directionsResults);

    console.log('1: ', recipeIngredients);
    console.log('2: ', recipeDirections);

    /*
    Reseptin erikoisruokavaliot sisältävä objekti, joka lähetetään
    lomakkeeseen tyhjänä.
    */
    const dietsObject = {
      kasvis: 0,
      maidoton: 0,
      vegaaninen: 0,
      gluteeniton: 0,
      laktoositon: 0,
      kananmunaton: 0,
    };

    /*
    Reseptin kategoriat sisältävä objekti, joka lähetetään
    lomakkeeseen tyhjänä.
    */
    const categoriesObj = {
      juomat: 0,
      keitot: 0,
      salaatit: 0,
      alkuruoat: 0,
      lisukkeet: 0,
      pääruoat: 0,
      välipalat: 0,
      jälkiruoat: 0,
      makeat_leivonnaiset: 0,
      suolaiset_leivonnaiset: 0,
    };

    // Luodaan reseptiobjekti, joka lähetetään reseptinlisäyslomakkeeseen:
    const recipeData = {
      nimi:
        recipeName.charAt(0).toUpperCase() + recipeName.slice(1).toLowerCase(),
      annosten_maara: null,
      erikoisruokavaliot: JSON.stringify(dietsObject),
      julkinen: 0,
      kategoriat: JSON.stringify(categoriesObj),
      kuva: null,
      ohjeet: recipeDirections,
      uusi: 1,
      valmistusaika: null,
    };

    /*
    Lähetetään kuvasta saatu ainesosien tekstidata importattuun funktioon,
    joka muuntaa tekstin lomakkeen vaatimaksi objektitaulukoksi.
    */
    const ingredientsData = recipeIngredients
      ? covertIngredients(recipeIngredients)
      : null;

    /*
    Siirrytään lisäyslomakkeen osoitteeseen, ja laitetaan stateksi sen
    tarvitsemat tiedot.
    */
    navigate('/uusi', {
      state: {
        recipeData: recipeData,
        ingredientsData: ingredientsData,
        formMode: 'copy',
      },
    });
  };

  // Kun kaikki rajatut kuvat on saatu, aloitetaan niiden käsittely.
  if (croppedImage1 && croppedImage2 && croppedImage3) {
    finishScanning();
  }

  // Funktio, jolla kuva lisätään omaan tilaansa:
  const uploadImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      image: e.target.files[0],
      source: URL.createObjectURL(e.target.files[0]),
    });
    setStage(1);
  };

  return (
    <div className="photoRecipeContainer">
      {stage === 0 && (
        <div>
          <div>
            <div className="imageInputContainer">
              <h1>Kuvaa resepti</h1>

              <label className="imageInputLabel photoRecipeInput">
                Ota kuva tai valitse galleriasta
                <input
                  type="file"
                  className="imageInput"
                  name="image"
                  onChange={uploadImage}
                  accept="image/*"
                />
                <span className="imageInputStatusInfo">
                  <div className="noPreview">
                    <BiCamera className="cameraIcon" />
                  </div>
                </span>
              </label>
            </div>

            <div className="photoRecipeInstructions">
              <p>
                Voit skannata reseptin kuvasta. Mitä selkeämpi kuva on, sitä
                paremmin sovellus osaa kopioida tekstin.
              </p>

              <p>Kuvassa tulee näkyä reseptin nimi, ainekset ja ohjeet.</p>
            </div>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div>
          <h2>Rajaa reseptin nimi</h2>

          <PhotoRecipeCropper
            image={image}
            setCroppedImage={setCroppedImage1}
            setStage={setStage}
            stage={stage}
          />
        </div>
      )}

      {stage === 2 && (
        <div>
          <h2>Rajaa reseptin ainekset</h2>

          <PhotoRecipeCropper
            image={image}
            setCroppedImage={setCroppedImage2}
            setStage={setStage}
            stage={stage}
          />
        </div>
      )}

      {stage === 3 && (
        <div>
          <h2>Rajaa reseptin ohjeet</h2>

          <PhotoRecipeCropper
            image={image}
            setCroppedImage={setCroppedImage3}
            setStage={setStage}
            stage={stage}
          />
        </div>
      )}

      {stage === 4 && <Loading />}
    </div>
  );
};

export default RecipePhoto;
