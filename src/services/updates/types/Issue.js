const User = require('../types/User');

class Issue {
  constructor (payload) {
    const { user, html_url: url, title } = payload;

    this.user = new User(user);
    this.url = url;
    this.title = title;
  }
}

module.exports = Issue;
module.exports.Review = Issue;
