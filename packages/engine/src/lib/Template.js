class Template {
  constructor(templatePath, options, data) {
    this.options = options;
    this.data = data;
    this.loadFile(templatePath);
  }

  loadFile(templatePath) {
    console.log(templatePath);
    // TODO
  }

  render() {
    // TODO
  }
}

module.exports = Template;
