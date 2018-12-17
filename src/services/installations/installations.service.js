// Initializes the `installations` service on path `/installations`
const createService = require('./installations.class.js');
const hooks = require('./installations.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/installations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('installations');

  service.hooks(hooks);
};
