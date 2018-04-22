const parties = require('./parties/parties.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(parties);
};
