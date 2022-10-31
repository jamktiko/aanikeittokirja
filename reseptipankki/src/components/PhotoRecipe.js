import { React, useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import '../styles/PhotoRecipe.css';
import '../styles/ImageInput.css';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

/*
Reseptin skannaaminen/lisääminen kuvasta.
*/
const RecipePhoto = () => {
  // Kuvan tila:
  const [image, setImage] = useState({
    image: null,
    source: null,
  });

  const [crop, setCrop] = useState();

  const handleCropChange = (crop) => {
    setCrop(crop);
    console.log('crop: ', crop);
  };

  /*
  Koska komponentti ladataan uudelleen kun kuva lisätään tilaan,
  tämä if-lause ajetaan kun kuva lisätään, joten tämän kautta
  kuvan rajausprosessi laitetaan alkamaan.
  */
  if (image.source !== null) {
    console.log('image: ', image);
  }

  // Funktio, jolla kuva lisätään omaan tilaansa:
  const uploadImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      image: e.target.files[0],
      source: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <div className="photoRecipeContainer">
      {image.source ? (
        <div>
          <h1>Rajaa reseptin nimi</h1>
          <ReactCrop crop={crop} onChange={(c) => handleCropChange(c)}>
            <img src={image.source} />
          </ReactCrop>
        </div>
      ) : (
        <div>
          <div className="imageInputContainer">
            <h1>Kuvaa resepti</h1>

            <label className="imageInputLabel photoRecipeInput">
              Valitse tai ota kuva
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
            <p>Voit lisätä reseptejä kopioimalla niitä kuvista.</p>

            <p>Kuvassa tulee näkyä reseptin nimi, ainekset ja ohjeet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePhoto;
