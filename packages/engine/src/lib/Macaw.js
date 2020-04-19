const fsStorage = require("@macaw-email/storage-fs");

const Template = require("./Template");

const defaultOptions = {
  templateFileExtension: "md",
  templatesDirectory: "emails",
  layoutsDirectory: "layouts",
  storage: fsStorage(),
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
    this.options.storage.setOptions({ ...this.options, storage: undefined });
  }

  async template(templateName, data) {
    return Template.load(
      `${templateName}.${this.options.templateFileExtension}`,
      this.options,
      data
    );
  }
}

Macaw.defaultOptions = defaultOptions;

module.exports = Macaw;
