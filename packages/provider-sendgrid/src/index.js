module.exports = ({ apiKey }) => {
  if (!apiKey) {
    throw Error("Missing required parameter `apiKey` for Sendgrid provider.");
  }

  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(apiKey);

  return {
    sendgrid,
    send: function sendViaSendgrid(data) {
      // TODO: send via Sendgrid instance
    }
  };
};
