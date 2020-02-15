const path = require("path");
const fs = require("fs");
const fm = require("front-matter");
const Twig = require("twig");
const twig = Twig.twig;
const showdown = require("showdown");
const mjml2html = require("mjml");

class Template {
  constructor(templatePath, options, data) {
    this.options = options;
    this.data = data;
    this.loadFile(templatePath);
  }

  loadFile(templatePath) {
    const content = fs.readFileSync(templatePath, "utf8");
    const { attributes, body } = fm(content);
    this.data = { ...attributes, ...this.data };
    this.markdown = body;

    if (!this.data.layout) {
      this.data.layout = "default";
    }

    this.layoutFilePath = path.join(
      path.dirname(templatePath),
      this.options.layoutsDirectory,
      `${this.data.layout}.mjml`
    );

    this.mjml = fs.readFileSync(this.layoutFilePath, "utf8");
  }

  render() {
    const markdown = twig({ data: this.markdown }).render(this.data);
    const converter = new showdown.Converter(this.options.markdown);
    const body = converter.makeHtml(markdown);

    const mjml = twig({ data: this.mjml }).render({ ...this.data, body });
    const { html, errors } = mjml2html(mjml, {
      ...this.options.mjml,
      filePath: this.layoutFilePath
    });

    return html;
  }

  send(sendOptions) {
    if (!this.options.provider) {
      throw Error("No provider set to send email with.");
    }

    const html = this.render();
    return this.options.provider.send({ ...sendOptions, html });
  }
}

module.exports = Template;
