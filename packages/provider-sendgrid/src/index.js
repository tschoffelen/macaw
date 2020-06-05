module.exports = ({ apiKey }) => {
  if (!apiKey) {
    throw Error("Missing required parameter `apiKey` for Sendgrid provider.");
  }

  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(apiKey);

  return {
    sendgrid,
    send: function sendViaSendgrid(options) {
      const { data, html, providerOptions } = options;

      return sendgrid.send({
        subject: providerOptions.subject || data.subject,
        to: providerOptions.to || data.to,
        from: providerOptions.from || data.from,
        ...providerOptions,
        html
      });
    }
  };
};
