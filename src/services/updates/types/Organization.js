class Organization {
  constructor (payload) {
    const {name, company, avatar_url: avatar, description, email, location, html_url: url} = payload;

    this.name = name;
    this.company = company;
    this.avatar = avatar;
    this.description = description;
    this.email = email;
    this.location = location;
    this.url = url;
  }
}

module.exports = Organization;
module.exports.Organization = Organization;
