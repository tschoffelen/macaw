const path = require('path');

const Template = require('./Template');

const defaultOptions = {
  templateFileExtension: 'md'
};

class Macaw {
  constructor({ templatesDirectory, ...options }) {
    if (!templatesDirectory) {
      throw Error('No `templatesDirectory` specified.');
    }

    this.templatesDirectory = path.resolve(templatesDirectory);
    this.options = { ...defaultOptions, ...options };
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
