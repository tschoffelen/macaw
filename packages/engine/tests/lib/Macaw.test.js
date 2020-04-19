const path = require("path");

const Macaw = require("../../src/lib/Macaw");
const Template = require("../../src/lib/Template");

test("engine fails with non-existing default templates directory", () => {
  const callConstructor = () => {
    new Macaw();
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("engine fails with non-existing custom templates directory", () => {
  const callConstructor = () => {
    new Macaw({
      templatesDirectory: "test/emails-nonexisting"
    });
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("engine allows custom templates directory", () => {
  const engine = new Macaw({
    templatesDirectory: "tests/emails"
  });

  expect(engine.options.templatesDirectory).toEqual("tests/emails");
});

test("engine is able to load template", async () => {
  const engine = new Macaw({
    templatesDirectory: "tests/emails"
  });

  const template = await engine.template("example-no-frontmatter");

  expect(template).toBeInstanceOf(Template);
  expect(template.options).toEqual(engine.options);
});
