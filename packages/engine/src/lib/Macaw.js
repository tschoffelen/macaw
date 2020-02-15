const path = require("path");
const fs = require("fs");

const Template = require("./Template");

const defaultOptions = {
  templateFileExtension: "md",
  templatesDirectory: "emails",
  layoutsDirectory: "layouts",
  markdown: {
    noHeaderId: true,
    simplifiedAutoLink: true,
    encodeEmails: false,
    backslashEscapesHTMLTags: false,
    ghCodeBlocks: false,
    excludeTrailingPunctuationFromURLs: true
  },
  mjml: {
    validationLevel: "soft"
  }
};

class Macaw {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.templatesDirectory = path.resolve(this.options.templatesDirectory);

    if (!fs.existsSync(this.templatesDirectory)) {
      throw Error(
        `Templates directory does not exist: ${this.templatesDirectory}`
      );
    }
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

Macaw.defaultOptions = defaultOptions;

module.exports = Macaw;
