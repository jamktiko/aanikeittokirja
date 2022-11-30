// Funktio joka poistaa tekstistä tarpeettomat rivinvaihdot.
const formatDirections = (text) => {
  const textArray = text.split(/\r?\n/);

  let str = '';
  const finalArray = [];

  for (let i = 0; i < textArray.length; i++) {
    if (textArray[i] !== '') {
      str += textArray[i];
      if (i === textArray.length - 1) {
        finalArray.push(str);
      }
    } else {
      finalArray.push(str);
      if (i !== textArray.length - 1) {
        finalArray.push('');
      }
      str = '';
    }
  }

  return finalArray.join();
};

export default formatDirections;
