const fm = require("front-matter");
const showdown = require("showdown");
const mjml2html = require("mjml");
const Twig = require("twig");
const twig = Twig.twig;

/**
 * Constructor for the Macaw template instance.
 *
 * Rather than initiating this class directly, use the `template` factory
 * method in the `Macaw` class.
 *
 * @param {Object} options Macaw instance options
 * @param {Object} data Variables to pass along to renderer
 */
class Template {
  /**
   * Constructor.
   *
   * @param {Object} options Macaw instance options
   * @param {Object} data Variables to pass along to renderer
   */
  constructor(options, data) {
    this.options = options;
    this.data = data;
    this.includesCache = {};
  }

  async resolveIncludes(str) {
    const regex = /\{%\s+?includes?\s+('|")([^'"]+)('|")\s+?%\}/;
    while (str.match(regex)) {
      const result = str.match(regex);
      const { index } = result;
      const [match, , includePath] = result;
      const fullIncludePath = `${this.options.layoutsDirectory}/partials/${includePath}.mjml`;
      this.includesCache[fullIncludePath] = await this.options.storage.getItem(
        fullIncludePath
      );
      str = `${str.substr(
        0,
        index
      )}<!--macawincludes:"${fullIncludePath}"-->${str.substr(
        index + match.length
      )}`;
    }

    return str;
  }

  applyIncludes(str) {
    const regex = /(<p>\s+?)?\<!--macawincludes:"([^"]+)"-->(\s+?<\/p>)?/;
    while (str.match(regex)) {
      const result = str.match(regex);
      const { index } = result;
      const [match, , fullIncludePath] = result;
      str = `${str.substr(0, index)}${
        this.includesCache[fullIncludePath]
      }${str.substr(index + match.length)}`;
    }

    return str;
  }

  /**
   * Load a template file and its layout from the storage engine.
   *
   * @param {string} templatePath The template path
   * @returns {Promise<void>}
   */
  async loadFile(templatePath) {
    const content = await this.options.storage.getItem(templatePath);
    const { attributes, body } = fm(content);
    this.data = { ...attributes, ...this.data };
    this.markdown = await this.resolveIncludes(body);

    if (!this.data.layout) {
      this.data.layout = "default";
    }

    this.layoutFilePath = `${this.options.layoutsDirectory}/${this.data.layout}.mjml`;
    this.mjml = await this.resolveIncludes(
      await this.options.storage.getItem(this.layoutFilePath)
    );
  }

  /**
   * Parse the template and return raw HTML output.
   *
   * @returns {string} Parsed template HTML
   */
  render() {
    const markdown = twig({ data: this.markdown }).render(this.data);
    const converter = new showdown.Converter(this.options.markdown);
    const body = twig({
      data: this.applyIncludes(converter.makeHtml(markdown))
    }).render(this.data);

    const mjml = twig({ data: this.applyIncludes(this.mjml) }).render({
      ...this.data,
      body
    });
    const { html, errors } = mjml2html(mjml, {
      ...this.options.mjml
    });

    if (errors.length) {
      const err = new Error(
        errors.reduce(
          (errors, error) => `${errors}\n - ${error.formattedMessage}`,
          "Invalid MJML:"
        )
      );
      err.errors = errors;
      throw err;
    }

    return html;
  }

  /**
   * Send the template via the `provider` specified in the Macaw options.
   *
   * Every provider requires their own set of `sendOptions`, so have a look
   * at the README file for the provider to find out what to pass along.
   *
   * @param {Object} sendOptions Options to be passed to provider
   * @returns {Promise<any>} Response from provider
   */
  send(sendOptions) {
    if (!this.options.provider) {
      throw Error("No provider set to send email with.");
    }

    const html = this.render();
    return this.options.provider.send({
      ...sendOptions,
      data: this.data,
      html
    });
  }
}

/**
 * Static template loading helper.
 *
 * @param {string} templatePath Path of the template in the storage engine
 * @param {Object} options Macaw instance options
 * @param {Object} data Variables to pass along to renderer
 * @returns {Promise<Template>}
 */
Template.load = async (templatePath, options, data) => {
  const template = new Template(options, data);
  await template.loadFile(templatePath);
  return template;
};

module.exports = Template;
