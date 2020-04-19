const macaw = require("macaw");
const sendgrid = require("@macaw-email/provider-sendgrid");

(async () => {
  const mailer = macaw({
    provider: sendgrid({
      apiKey: "aaaaa-bbbbbbb-ccccccc-ddddddd"
    })
  });

  const template = await mailer.template("monthly-newsletter", {
    name: "John"
  });

  console.log(template.render());
})();
