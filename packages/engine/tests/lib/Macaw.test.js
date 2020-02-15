const path = require("path");

const Macaw = require("../../src/lib/Macaw");
const Template = require("../../src/lib/Template");

test("engine fails with non-existing default templates directory", () => {
  const callConstructor = () => {
    const engine = new Macaw();
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("engine fails with non-existing custom templates directory", () => {
  const callConstructor = () => {
    const engine = new Macaw({
      templatesDirectory: "test/emails-nonexisting"
    });
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("engine allows custom templates directory", () => {
  const engine = new Macaw({
    templatesDirectory: "tests/emails"
  });

  expect(engine.templatesDirectory).toEqual(path.resolve("tests/emails"));
});

test("engine is able to load template", () => {
  const engine = new Macaw({
    templatesDirectory: "tests/emails"
  });

  const template = engine.template("example-no-frontmatter");

  expect(template).toBeInstanceOf(Template);
  expect(template.options).toEqual(engine.options);
});
