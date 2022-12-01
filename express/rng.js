const randomId = function () {};

randomId.generateId = (result) => {
  hash = (+new Date().getTime() * Math.random()).toString(36).substring(0, 8);
  return hash;
};

module.exports = randomId;
