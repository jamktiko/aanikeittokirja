/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import '../styles/PhotoRecipe.css';
import '../styles/ImageInput.css';

import Button from './Button';

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

  // Rajatun kuvan tila:
  const [output, setOutput] = useState({
    image: null,
    source: null,
  });

  // Rajauksen tila. Alkuarvona rajauskentän lähtöasema:
  const [crop, setCrop] = useState({
    x: 20,
    y: 33,
    width: 60,
    height: 33,
    unit: '%',
  });
  const [pixelCrop, setPixelCrop] = useState();

  // Funktio, jolla kuva lisätään omaan tilaansa:
  const uploadImage = (e) => {
    if (e.target.files.length === 0) return;
    setImage({
      image: e.target.files[0],
      source: URL.createObjectURL(e.target.files[0]),
    });
  };

  /*
  Tämä funktio ajetaan kun rajattava kuvaelementti on latautunut.
  Parametri e on EventListeneristä tuleva event, josta saadaan kyseinen
  kuva, eli e.path[0].
  */
  const onImageLoad = (e) => {
    const imageToCrop = e.path[0];
    const canvas = document.createElement('canvas');

    // Lasketaan rajaukseen tarvittavat arvot, kuten leveydet ja pituudet.
    const targetX = (imageToCrop.width * pixelCrop.x) / 100;
    const targetY = (imageToCrop.height * pixelCrop.y) / 100;
    const targetWidth = (imageToCrop.width * pixelCrop.width) / 100;
    const targetHeight = (imageToCrop.height * pixelCrop.height) / 100;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // Tässä kohdassa canvasissa oleva kuva rajataan.
    ctx.drawImage(
      imageToCrop,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Tehdään rajatusta canvasista kuva (blob):
    canvas.toBlob((blob) => {
      // Asetetaan rajattu kuva (blob) output-tilaan:
      setOutput({
        image: blob,
        source: URL.createObjectURL(blob),
      });
    }, 'image/jpeg');
  };

  /*
  Kuvan rajaustoimenpide alkaa tästä funktiosta. Siinä luodaan
  aluksi kuvaelementti siitä kuvasta, joka on tallennettu image-
  tilaan. Sille lisätään sitten EventListener, joka laukaisee
  onImageLoad-funktion kun kuva on latautunut.
  */
  const getCroppedImage = () => {
    const imageToCrop = new Image();
    imageToCrop.src = image.source;
    imageToCrop.addEventListener('load', onImageLoad);
  };

  return (
    <div className="photoRecipeContainer">
      {image.source ? (
        <div>
          <h1>Rajaa reseptin nimi</h1>

          {/* ReactCrop on lisäosa, joka mahdollistaa kuvien rajauksen */}
          <ReactCrop
            src={image.source}
            crop={crop}
            onImageLoaded={(img) => setImage(img)}
            onComplete={getCroppedImage}
            onChange={(crop, pixelCrop) => {
              setCrop(crop);
              setPixelCrop(pixelCrop);
            }}
          >
            <img src={image.source} />
          </ReactCrop>

          {/*
          Tämä nappi tällä hetkellä vain tulostaa linkin
          rajattuun kuvaan.
          */}
          <div onClick={() => console.log(output)}>
            <Button
              text="Valmis"
              color={output.image ? 'primary' : 'secondary'}
              type="button"
            />
          </div>
        </div>
      ) : (
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
            <p>Voit skannata reseptin kuvasta.</p>

            <p>Kuvassa tulee näkyä reseptin nimi, ainekset ja ohjeet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePhoto;
