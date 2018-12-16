const fs = require('fs');
const path = require('path');

const events = new Map();
const eventsDir = path.join(__dirname, 'events');

fs.readdir(eventsDir, (err, files) => {
  files.forEach(file => {
    const filePath = path.join(eventsDir, file);

    const EventClass = require(filePath);

    events.set(EventClass.EVENT, EventClass);
  });
});

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    const type = params.headers['x-github-event'];
    const Event = events.get(type);

    if (!Event) {
      return {message: 'Unknown event type'};
    }

    const event = new Event(data);

    if (type === 'installation') {
      switch (event.action) {
        case 'created':
          this.app.service('users').patch(event.installation.targetId, {installation: event.installation.id});
          break;

        case 'deleted':
          this.app.service('users').patch(event.installation.targetId, {installation: undefined});
          break;
      }
      return;
    }

    try {
      const message = event.getMessage();
      const installation = event.installation.id;

      this.app.service('notifications').create({...message, installation});

      return {message: 'OK'};
    } catch (e) {
      return {message: e};
    }
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
