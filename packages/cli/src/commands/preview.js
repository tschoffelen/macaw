const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const { log, error } = require("../util/log");

module.exports = async (dir = "emails") => {
  const emailsPath = path.resolve(dir);

  // First check if there isn't already an "emails" directory
  if (!fs.existsSync(emailsPath)) {
    error(
      "Hold on!",
      'The directory "' +
        dir +
        "\" doesn't seem to exist here.\n\n" +
        "Run " +
        chalk.blue("npx macaw init") +
        " first to set up your project."
    );
    process.exit(1);
  }

  log("hello, world"); // TODO

  process.exit(0);
};
