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

/**
 * Constructor for the Macaw engine class.
 *
 * Usually, rather than initiating this class directly, you'd use the factory
 * function `macaw`.
 *
 * ```js
 * const mailer = macaw({ templatesDirectory: 'emails' });
 * ```
 *
 * @param {Object} options Engine options
 * @param {string} options.templateFileExtension File extension appended to
 *    template files - defaults to `md`.
 * @param {string} options.templatesDirectory Directory to use to look for
 *    template files - defaults to `emails`.
 * @param {string} options.layoutDirectory Layouts directory name, needs to be
 *    a subdirectory of the templatesDirectory - defaults to `layouts`.
 * @param {Object} options.storage Define this to override the default storage
 *    engine, needs to be an object with a method `getObject` - defaults to
 *    `fsStorage`.
 * @param {Object} options.provider Specify email provider, needs to be a
 *    object with a method `send`, have a look at any of the included
 *    providers (e.g. Sendgrid) for an example on how to create your own.
 * @param {Object} options.markdown Set custom options for markdown rendering
 *    engine. See the [Showdown docs](https://github.com/showdownjs/showdown#valid-options)
 *    for more info on valid options.
 * @param {Object} options.mjml Set custom options for the
 *    [MJML renderer](https://github.com/mjmlio/mjml#inside-nodejs).
 */
class Macaw {
  /**
   * Constructor.
   *
   * @param {Object} options Engine options
   */
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.options.storage.setOptions({ ...this.options, storage: undefined });
  }

  /**
   * Load a template from storage, and set any variables that should be made
   * available within the template. Returns a Template instance.
   *
   * Note that this method is async!
   *
   * ```js
   * const template = await mailer.template('newsletter', { name: 'John' });
   * ```
   *
   * @param {string} templateName The name of the template to load, excluding directory name and extension
   * @param {{[string]: any}} data An object of variables to set in the template
   * @returns {Promise<Template>}
   */
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
