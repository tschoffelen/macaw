const fm = require("front-matter");
const showdown = require("showdown");
const mjml2html = require("mjml");
const Twig = require("twig");
const twig = Twig.twig;

class Template {
  constructor(options, data) {
    this.options = options;
    this.data = data;
  }

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

Template.load = async (templatePath, options, data) => {
  const template = new Template(options, data);
  await template.loadFile(templatePath);
  return template;
};

module.exports = Template;
