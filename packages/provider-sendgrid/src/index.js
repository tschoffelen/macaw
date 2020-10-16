module.exports = ({ apiKey }) => {
  if (!apiKey) {
    throw Error("Missing required parameter `apiKey` for Sendgrid provider.");
  }

  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(apiKey);

  return {
    sendgrid,
    send: function sendViaSendgrid(options) {
      let { data, html, category, categories, ...providerOptions } = options;

      categories = [
        ...(data.template ? [data.template] : []),
        ...(categories || [])
      ];
      if (data.template && data.template.includes("-")) {
        categories.push(data.template.split("-", 1)[0]);
      }

      return sendgrid.send({
        subject: providerOptions.subject || data.subject,
        to: providerOptions.to || data.to,
        from: providerOptions.from || data.from,
        categories,
        ...providerOptions,
        html
      });
    }
  };
};
