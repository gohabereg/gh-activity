const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;


const customizeGithubProfile = () => {
  return async (context) => {
    if (context.params.oauth.provider !== 'github') {
      return;
    }

    const {github: {profile, accessToken}} = context.data;

    const data = {
      name: profile.displayName,
      username: profile.username,
      profileUrl: profile.profileUrl,
      photo: profile.photos.pop().value,
      githubToken: accessToken
    };
    const id = +context.data.githubId;

    try {
      const user = await context.app.service('users').patch(id, data);

      context.result = user;
    } catch (e) {
      context.data = {
        id: +context.data.githubId,
        ...data
      };
    }
  };
};

const getUserInstallation = (context) => {
  context.app.service('installations').get(context.result.username)
    .then((installation) => {
      context.app.service('users').patch(context.result.id, {installation: installation.id});
    })
    .catch(() => {
      context.app.service('users').patch(context.result.id, {installation: undefined});
    });
};

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword(), customizeGithubProfile() ],
    update: [ hashPassword(),  authenticate('jwt'), customizeGithubProfile() ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
      protect('githubToken')
    ],
    find: [],
    get: [getUserInstallation],
    create: [getUserInstallation],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
