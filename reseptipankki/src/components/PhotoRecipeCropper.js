import { React, useState } from 'react';
import Button from './Button';
import ReactCrop from 'react-image-crop';
import PropTypes from 'prop-types';

/*
Komponentti, jossa suoritetaan kuvien rajaaminen.
image = Rajattava kuva
setCroppedImage = Tilaa muuttava funktio, johon rajattu kuva laitetaan.
setStage = Funktio, jolla vaihdetaan PhotoRecipe-komponentin vaihetta.
*/
const PhotoRecipeCropper = ({ image, setCroppedImage, setStage, stage }) => {
  const [output, setOutput] = useState();

  // Rajauksen tila. Alkuarvona rajauskentän lähtöasema:
  const [crop, setCrop] = useState({
    x: 20,
    y: 33,
    width: 60,
    height: 33,
    unit: '%',
  });
  const [pixelCrop, setPixelCrop] = useState();

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
      // Asetetaan onnistuneesti rajattu kuva (blob) omaan tilaansa:
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

  const cropReady = () => {
    if (output) {
      setCroppedImage(output);
      setStage(stage + 1);
    }
  };

  return (
    <div>
      <div onClick={cropReady}>
        <Button
          text="Valmis"
          color={pixelCrop ? 'primary' : 'secondary'}
          type="button"
        />
      </div>

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
    </div>
  );
};

// Parametrien tyypitykset.
PhotoRecipeCropper.propTypes = {
  image: PropTypes.any,
  setCroppedImage: PropTypes.func,
  setStage: PropTypes.func,
  stage: PropTypes.number,
};

export default PhotoRecipeCropper;
