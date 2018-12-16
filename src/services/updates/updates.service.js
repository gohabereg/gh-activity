// Initializes the `updates` service on path `/github/updates`
const createService = require('./updates.class.js');
const hooks = require('./updates.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/github/updates', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('github/updates');

  service.hooks(hooks);
};
