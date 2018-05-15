// Initializes the `poulet` service on path `/poulet`
const createService = require('feathers-memory');
const hooks = require('./poulet.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/poulet', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('poulet');

  service.hooks(hooks);
};
