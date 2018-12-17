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

      app.channel(`user/${connection.user.id}`).join(connection);
      app.channel(`app/${connection.user.installation}`).join(connection);
    }
  });

  app.service('users').publish((data) => {
    return app.channel(`user/${data.id}`);
  })

  app.service('notifications').publish('created', (data) => {
    const user = app.channel(app.channels).filter(connection => {
      return connection.user && connection.user.installation === data.installation
    });

    app.channel(`app/${data.installation}`).join(user);

    return app.channel(`app/${data.installation}`);
  });
};
