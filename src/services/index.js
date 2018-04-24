const parties = require('./parties/parties.service.js');
const users = require('./users/users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(parties);
  app.configure(users);
};
