module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, { connection }) => {
    if(connection) {
      app.channel('anonymous').leave(connection);

      app.channel(`user/${connection.user.installation}`).join(connection);
    }
  });

  app.service('notifications').publish('created', (data) => {
    return app.channel(`user/${data.installation}`);
  });
};
