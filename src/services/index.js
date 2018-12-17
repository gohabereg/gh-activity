const users = require('./users/users.service.js');
const notifications = require('./notifications/notifications.service.js');
const updates = require('./updates/updates.service.js');
const installations = require('./installations/installations.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(notifications);
  app.configure(updates);
  app.configure(installations);
};
