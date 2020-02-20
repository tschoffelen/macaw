const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

module.exports = () => {
  const dirName = "emails";
  const basePath = path.resolve(".");
  const emailsPath = path.join(basePath, dirName);
  const templatesPath = path.resolve(
    path.join(__dirname, "..", "..", "templates")
  );

  // First check if there isn't already an "emails" directory
  if (fs.existsSync(emailsPath)) {
    console.log(
      "\n\n    " +
        chalk.bold("Hold on!") +
        '\n\n    There seems to already be a "' +
        dirName +
        '" directory in this \n    project. ' +
        "Can't finish the Macaw setup.\n\n"
    );
    process.exit(1);
  }

  // Create "emails" directory
  fs.mkdirSync(emailsPath);
  fs.mkdirSync(path.join(emailsPath, "layouts"));

  // Copy over templates
  fs.copyFileSync(
    path.join(templatesPath, "default.mjml"),
    path.join(emailsPath, "layouts", "default.mjml")
  );
  fs.copyFileSync(
    path.join(templatesPath, "monthly-newsletter.md"),
    path.join(emailsPath, "monthly-newsletter.md")
  );

  // Show nice message
  console.log(
    "\n\n    " +
      chalk.bold("All done!") +
      "\n\n    We've created an \"" +
      dirName +
      '" directory with some sample\n    templates to get you started.\n\n' +
      "    Run " +
      chalk.green("macaw preview") +
      " to preview the templates in the" +
      "\n    browser while you edit them. " +
      "\n\n"
  );
  process.exit(0);
};
