const User = require('../types/User');

class Review {
  constructor (payload) {
    const { user, body, html_url: url, state } = payload;

    this.user = new User(user);
    this.body = body;
    this.url = url;
    this.state = state;
  }
}

module.exports = Review;
module.exports.Review = Review;
