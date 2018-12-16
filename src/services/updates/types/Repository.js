const User = require('./User');
const Organization = require('./Organization');

class Repository {
  constructor (payload) {
    const {name, full_name: fullName, owner, description, html_url: url, organization} = payload;

    this.name = name;
    this.description = description;
    this.fullName = fullName;
    this.owner = new User(owner);
    this.url = url;
    this.organization = organization ? new Organization(organization) : null;
  }
}

module.exports = Repository;
module.exports.Repository = Repository;
