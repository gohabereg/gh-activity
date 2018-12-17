const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const url = require('url');

const oauth2 = require('@feathersjs/authentication-oauth2');
const GithubStrategy = require('passport-github');

module.exports = function (app) {
  const config = app.get('authentication');

  const handler = async (req, res, next) => {
    if (req.feathers && req.feathers.payload) {
      try {
        const token = await app.passport.createJWT(req.feathers.payload, {
          jwt: config.jwt,
          secret: config.secret
        });

        res.redirect(url.resolve(config.github.successRedirect, `./${token}`));
      } catch (e) {
        next(e);
      }
    }
  }

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());

  app.configure(oauth2(Object.assign({
    name: 'github',
    Strategy: GithubStrategy,
    handler,
    scope: ['user']
  }, config.github)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
