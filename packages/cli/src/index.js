#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");

const program = new commander.Command();

program
  .command("init")
  .description("Set up your emails directory structure.")
  .action(() => require("./commands/init")());

program.on("command:*", () => {
  console.error(
    "Invalid command: %s\nSee --help for a list of available commands.",
    program.args.join(" ")
  );
  process.exit(1);
});

let called = false;
program.on("command", () => {
  called = true;
});

if (process.argv.length === 2) {
  program.help();
  process.exit(1);
}

program.version("macaw " + pkg.version, "-v, --version").parse(process.argv);
