//Tämän tiedoston lähde on https://brianmorrison.me/blog/adding-authentication-to-a-nodejs-api-using-aws-cognito

const CognitoExpress = require('cognito-express');

// Aseta CognitoExpress
const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_DEFAULT_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600,
});

exports.validateAuth = (req, res, next) => {
  // Tarkista onko req:issa tokeni
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Validoi token
    const token = req.headers.authorization.split(' ')[1];
    cognitoExpress.validate(token, function (err, response) {
      if (err) {
        // Jos validoinnissa virhe, palauta 401 Unauthorized ja virhe viesti
        res.status(401).send(err);
      } else {
        // Jos validointi onnistui niin siirrytään eteenpäin
        next();
      }
    });
  } else {
    // Jos tokenia ei ole, vastataan sen mukaisesti
    res.status(401).send('No token provided.');
  }
};
