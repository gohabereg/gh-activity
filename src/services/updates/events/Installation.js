const Installation = require('../types/Installation');
const User = require('../types/User');

class InstallationEvent {
  static get EVENT () {
    return 'installation';
  }

  constructor(payload) {
    const {action, installation, sender} = payload;

    this.action = action;
    this.installation = new Installation(installation);
    this.sender = new User(sender);
  }
}

module.exports = InstallationEvent;
module.exports.InstallationEvent = InstallationEvent;
