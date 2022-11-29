const cheerio = require('cheerio');
const axios = require('axios');

const Link = function (Link) {
  this.link = Link;
};

Link.getInfoFromLink = (link, result) => {
  try {
    const download = async () => {
      const request = await axios.request({
        method: 'GET',
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
        url: link,
      });

      const data = request.data.toString('utf8');

      const $ = cheerio.load(data);

      const content = {};

      let recipeClass = '';
      let nameClass = '';
      let ingredientClass = '';
      let directionsClass = '';

      if (link.includes('kotikokki.net')) {
        recipeClass = '.content';
        nameClass = '.recipe-title';
        ingredientClass = '.ingredient';
        directionsClass = '.instructions';
      }

      if (link.includes('soppa365.fi')) {
        recipeClass = '.field-name-field-recipe-items';
        nameClass = '.field-name-title';
        ingredientClass = '.recipe-items__item';
        directionsClass = '.field-name-field-recipe-instructions';
      }

      if (link.includes('valio.fi')) {
        recipeClass = '.RecipeHeaderWrapper';
        nameClass = '.Title-sc-1309phm';
        ingredientClass = 'tr';
        directionsClass = '.InstructionsWrapper-sc-107c9bz';
      }

      const recipe = $(recipeClass, data).first();

      const ingredients = [];

      $(ingredientClass, $.html(recipe)).each(function () {
        const aines = $(this).text();

        ingredients.push(
          aines
            .replace(/(\r\n|\n|\r)/gm, '')
            .replace(/ +(?= )/g, '')
            .trim()
        );
      });

      console.log('nameClass: ', nameClass);

      content.name = $(nameClass, data)
        .first()
        .text()
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/ +(?= )/g, '')
        .trim();

      content.directions = $(directionsClass, data)
        .first()
        .text()
        .replace(/\n\s*\n/g, '\n')
        .trim();

      console.log('content: ', content);

      content.ingredients = ingredients;

      result(null, content);
    };
    download();
  } catch (error) {
    console.log(error, error.message);
    result(err, null);
  }
};
module.exports = Link;
