class Label {
  constructor (payload) {
    const {name, color, url} = payload;

    this.name = name;
    this.color = color;
    this.url = url;
  }
}

module.exports = Label;
module.exports.Label = Label;
