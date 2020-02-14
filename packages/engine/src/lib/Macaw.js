const path = require("path");

const Template = require("./Template");

const defaultOptions = {
  templateFileExtension: "md",
  templatesDirectory: "emails"
};

class Macaw {
  constructor({ templatesDirectory, ...options }) {
    this.options = { ...defaultOptions, ...options };
    this.templatesDirectory = path.resolve(this.options.templatesDirectory);
  }

  template(templateName, data) {
    return new Template(
      path.join(
        this.templatesDirectory,
        `${templateName}.${this.options.templateFileExtension}`
      ),
      this.options,
      data
    );
  }
}

module.exports = Macaw;
