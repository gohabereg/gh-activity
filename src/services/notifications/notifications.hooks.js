
const { authenticate } = require('@feathersjs/authentication').hooks;
const {restrictToOwner} = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [
      restrictToOwner({idField: 'installation', ownerField: 'installation'})
    ],
    get: [
      restrictToOwner({idField: 'installation', ownerField: 'installation'})
    ],
    create: [],
    update: [
      restrictToOwner({idField: 'installation', ownerField: 'installation'})
    ],
    patch: [
      restrictToOwner({idField: 'installation', ownerField: 'installation'})
    ],
    remove: [
      restrictToOwner({idField: 'installation', ownerField: 'installation'})
    ]
  },

  after: {
    all: [],
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
