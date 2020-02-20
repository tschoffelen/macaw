const fs = require("fs");

const getTemplates = emailsPath =>
  fs
    .readdirSync(emailsPath)
    .filter(
      file =>
        !["layouts", "readme.md"].includes(file.toLowerCase()) &&
        file.includes(".md")
    )
    .map(file => file.replace(".md", ""));

module.exports = {
  getTemplates
};
