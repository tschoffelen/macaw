module.exports = ({ apiKey }) => {
  if (!apiKey) {
    throw Error("Missing required parameter `apiKey` for Sendgrid provider.");
  }

  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(apiKey);

  return {
    sendgrid,
    send: function sendViaSendgrid(options) {
      return sendgrid.send({
        subject: options.subject || options.data.subject,
        to: options.to || options.data.to,
        from: options.from || options.data.from,
        ...data,
        html
      });
    }
  };
};
