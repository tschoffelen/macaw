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
 * @params {object} options Macaw instance options
 * @params {object} data Variables to pass along to renderer
 */
class Template {
  constructor(options, data) {
    this.options = options;
    this.data = data;
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
    this.markdown = body;

    if (!this.data.layout) {
      this.data.layout = "default";
    }

    this.layoutFilePath = `${this.options.layoutsDirectory}/${this.data.layout}.mjml`;
    this.mjml = await this.options.storage.getItem(this.layoutFilePath);
  }

  /**
   * Parse the template and return raw HTML output.
   *
   * @returns {string} Parsed template HTML
   */
  render() {
    const markdown = twig({ data: this.markdown }).render(this.data);
    const converter = new showdown.Converter(this.options.markdown);
    const body = converter.makeHtml(markdown);

    const mjml = twig({ data: this.mjml }).render({ ...this.data, body });
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
   * @param {object} sendOptions Options to be passed to provider
   * @returns {Promise<any>} Response from provider
   */
  async send(sendOptions) {
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
 * @param {object} options Macaw instance options
 * @param {object} data Variables to pass along to renderer
 * @returns {Promise<Template>}
 */
Template.load = async (templatePath, options, data) => {
  const template = new Template(options, data);
  await template.loadFile(templatePath);
  return template;
};

module.exports = Template;
