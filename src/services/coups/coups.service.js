// Initializes the `coups` service on path `/coups`
const createService = require('feathers-nedb');
const createModel = require('../../models/coups.model');
const hooks = require('./coups.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'coups',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/coups', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('coups');

  service.hooks(hooks);
};
