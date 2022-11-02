/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import { createWorker } from 'tesseract.js';
import PhotoRecipeCropper from './PhotoRecipeCropper';

import { useNavigate } from 'react-router-dom';

import '../styles/PhotoRecipe.css';
import '../styles/ImageInput.css';
import 'react-image-crop/dist/ReactCrop.css';

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

  const worker = createWorker();

  // Rajattujen kuvien tilat:
  const [croppedImage1, setCroppedImage1] = useState();
  const [croppedImage2, setCroppedImage2] = useState();
  const [croppedImage3, setCroppedImage3] = useState();

  const convertImagesToText = async () => {
    await worker.load();
    await worker.loadLanguage('fin');
    await worker.initialize('fin');
    // Reseptin nimi:
    const textData1 = await worker.recognize(croppedImage1.image);
    // Reseptin ainekset tekstinä:
    const textData2 = await worker.recognize(croppedImage2.image);
    // Reseptin ohjeet tekstinä:
    const textData3 = await worker.recognize(croppedImage3.image);

    console.log(textData2.data.text);

    const dietsObject = {
      kasvis: 0,
      maidoton: 0,
      vegaaninen: 0,
      gluteeniton: 0,
      laktoositon: 0,
      kananmunaton: 0,
    };

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

    const recipeData = {
      nimi: textData1.data.text,
      annosten_maara: null,
      erikoisruokavaliot: JSON.stringify(dietsObject),
      julkinen: 0,
      kategoriat: JSON.stringify(categoriesObj),
      kuva: null,
      ohjeet: textData3.data.text,
      uusi: 1,
      valmistusaika: null,
    };

    const ingredientsData = null;

    navigate('/muokkaa', {
      state: {
        recipeData: recipeData,
        ingredientsData: ingredientsData,
        editMode: true,
      },
    });
  };

  if (croppedImage1 && croppedImage2 && croppedImage3) {
    convertImagesToText();
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

      {stage === 4 && <p>Ladataan...</p>}
    </div>
  );
};

export default RecipePhoto;
