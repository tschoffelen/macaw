const macaw = require("@macaw-email/engine");
const sendgrid = require("@macaw-email/provider-sendgrid");

const mailer = macaw({
  provider: sendgrid({
    apiKey: "aaaaa-bbbbbbb-ccccccc-ddddddd"
  })
});

const template = mailer.template("monthly-newsletter", {
  name: "Example Business"
});

console.log(template.render());
