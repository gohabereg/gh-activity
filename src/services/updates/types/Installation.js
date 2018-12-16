const User = require('./User');

class Installation {
  constructor (payload) {
    const {id, account, target_id: targetId} = payload;

    this.id = id;
    this.account = account ? new User(account) : null;
    this.targetId = targetId;
  }
}

module.exports = Installation;
module.exports.Installation = Installation;
