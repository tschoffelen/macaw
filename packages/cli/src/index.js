#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");

const program = new commander.Command();

program
  .command("init")
  .description("Set up your emails directory structure.")
  .action(() => require("./commands/init")());

program
  .command("preview")
  .description("Set up your emails directory structure.")
  .option('-s, --source <path>', 'The source of your templates', 'emails')
  .action((options) => require("./commands/preview")(options));

program.on("command:*", () => {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

if (process.argv.length === 2) {
  return program.emit("command:preview");
}

program.version("macaw " + pkg.version, "-v, --version").parse(process.argv);
