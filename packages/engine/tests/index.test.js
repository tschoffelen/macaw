const index = require("../src/index");
const Macaw = require("../src/lib/Macaw");

test("index initiates engine", () => {
  const engine = index({
    templatesDirectory: "tests/emails"
  });

  expect(engine).toBeInstanceOf(Macaw);
});

test("index initiates engine with options", () => {
  const options = { option1: "test", templatesDirectory: "tests/emails" };
  const engine = index(options);

  expect(engine).toBeInstanceOf(Macaw);
  expect(engine.options).toEqual({
    ...Macaw.defaultOptions,
    ...options
  });
});
