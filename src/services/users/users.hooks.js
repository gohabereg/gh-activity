const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;


const customizeGithubProfile = () => {
  return (context) => {
    if (context.params.oauth.provider !== 'github') {
      return;
    }

    const {github: {profile, accessToken}} = context.data;

    context.data = {
      id: +context.data.githubId,
      name: profile.displayName,
      username: profile.username,
      profileUrl: profile.profileUrl,
      photo: profile.photos.pop().value,
      githubToken: accessToken
    };
  };
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
    get: [],
    create: [],
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
