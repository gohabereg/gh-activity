const JWT = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const rp = require('request-promise');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (username) {
    const githubApp = this.app.get('githubApp');

    const keyPath = path.resolve(__dirname, '../../../key.pem');
    const key = fs.readFileSync(keyPath);
    const now = Math.round(Date.now() / 1000)
    const token = JWT.sign({
      iat: now,
      exp: now + 5 * 60,
      iss: githubApp.id
    }, key, {algorithm: 'RS256'});

    const response = await rp({
      uri: `https://api.github.com/users/${username}/installation`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.machine-man-preview+json',
        'User-Agent': githubApp.name
      },
      json: true
    })

    return response
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
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

  setup (app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
