const cheerio = require('cheerio');
const axios = require('axios');

const Link = function (Link) {
  this.link = Link;
};

Link.getInfoFromLink = (link, result) => {
  try {
    axios
      .get(link, {
        headers: {
          'Accept-encoding': null,
        },
      })
      .then((res) => {
        const data = res.data.toString('utf8');

        const $ = cheerio.load(data);

        const content = {};

        let recipeClass = '.recipe';
        let nameClass = '.title';
        let ingredientClass = '.ingredient';
        let directionsClass = '.instructions';

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
          nameClass = '.Title-sc-nktazt';
          ingredientClass = 'tr';
          directionsClass = '.InstructionsWrapper-sc-57tfo1';
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

        content.name = $(nameClass, data)
          .first()
          .text()
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/ +(?= )/g, '')
          .trim();

        content.directions = $(directionsClass, data).first().text().trim();

        content.ingredients = ingredients;

        result(null, content);
      })
      .catch((err) => {
        console.log(err);
        result(err, null);
      });
  } catch (error) {
    console.log(error, error.message);
    result(err, null);
  }
};
module.exports = Link;
