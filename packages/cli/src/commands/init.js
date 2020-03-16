const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { packageJson, install } = require("mrm-core");

const { log, error, success } = require("../util/log");

const isUsingYarn = () => fs.existsSync("yarn.lock");

module.exports = async (dir = "emails") => {
  const emailsPath = path.join(dir);
  const templatesPath = path.resolve(
    path.join(__dirname, "..", "..", "templates")
  );

  // First check if there isn't already an "emails" directory
  if (fs.existsSync(emailsPath)) {
    error(
      "Hold on!",
      'There seems to already be a "' +
        dir +
        '" directory in this \nproject. ' +
        "Can't finish the Macaw setup."
    );
    process.exit(1);
  }

  // Create "emails" directory
  log("Creating " + dir + " directory...");
  fs.mkdirSync(emailsPath);
  fs.mkdirSync(path.join(emailsPath, "layouts"));

  // Copy over templates
  log("Adding templates...");
  fs.copyFileSync(
    path.join(templatesPath, "layouts", "default.mjml"),
    path.join(emailsPath, "layouts", "default.mjml")
  );
  fs.copyFileSync(
    path.join(templatesPath, "monthly-newsletter.md"),
    path.join(emailsPath, "monthly-newsletter.md")
  );

  // Install macaw
  await install("macaw");

  // Update package.json
  await packageJson()
    .appendScript("macaw", "macaw")
    .save();

  // Show nice message
  success(
    "All done!",
    "We've created an \"" +
      dir +
      '" directory with some sample\ntemplates to get you started.\n\n' +
      "Run " +
      chalk.blue((isUsingYarn() ? "yarn" : "npm run") + " macaw") +
      " to preview the templates in the" +
      "\nbrowser while you edit them. "
  );
  process.exit(0);
};
