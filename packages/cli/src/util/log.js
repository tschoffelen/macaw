const chalk = require("chalk");

const log = message => console.log(message);

const message = message =>
  log(`\n\n    ${message.split("\n").join("\n    ")}\n\n`);

const error = (title, description) =>
  message(`${chalk.red.bold(title)}\n\n${description}`);

const success = (title, description) =>
  message(`${chalk.green.bold(title)}\n\n${description}`);

module.exports = {
  log,
  message,
  error,
  success
};
