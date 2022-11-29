Link = require('../models/link.model');

exports.getInfoFromLink = (req, res) => {
  Link.getInfoFromLink(req.body.link, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send(data);
    }
  });
};
