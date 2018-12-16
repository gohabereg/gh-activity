class User {
  constructor (payload) {
    const {login, avatar_url: avatar, html_url: url} = payload;

    this.login = login;
    this.avatar = avatar;
    this.url = url;
  }
}

module.exports = User;
module.exports.User = User;
