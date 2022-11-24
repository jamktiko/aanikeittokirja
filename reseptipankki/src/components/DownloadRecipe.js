import { React, useState } from 'react';
import '../styles/DownloadRecipe.css';
import Button from './Button';
import { BiPaste } from 'react-icons/bi';

/*
Komponentti näkymälle, jossa käyttäjä voi liittää kopioimansa linkin
tekstikenttään, sekä napin jonka painamisen jälkeen linkin takana
oleva resepti latautuu.
*/
const RecipeDownload = () => {
  const [url, setUrl] = useState('');

  const pasteClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setUrl(text);
  };

  return (
    <div className="downloadRecipeContainer">
      <h2>Kopioi resepti netistä</h2>
      <p>Liitä reseptin URL-osoite:</p>

      <div className="searchBarContainer">
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          className="searchBar"
          type="text"
        />

        <div onClick={pasteClipboard} className="filterButton">
          <BiPaste className="filterIcon" />
        </div>
      </div>

      <div>
        <Button color="primary" text="Kopioi" type="button" />
      </div>
    </div>
  );
};

export default RecipeDownload;
