const path = require("path");

const storage = require("../src/index");

test("throws error when setting options with invalid default dir", () => {
  const callConstructor = () => {
    storage().setOptions({});
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("throws error when setting options with invalid custom dir", () => {
  const callConstructor = () => {
    storage().setOptions({
      templatesDirectory: "test/emails-nonexisting"
    });
  };

  expect(callConstructor).toThrow(/templates directory does not exist/i);
});

test("returns promise on file read", () => {
  const instance = storage();
  instance.setOptions({
    templatesDirectory: "tests/fixtures"
  });

  expect(instance.getItem("file.txt")).toBeInstanceOf(Promise);
});

test("reads file with relative path", async () => {
  const instance = storage();
  instance.setOptions({
    templatesDirectory: "tests/fixtures"
  });

  const data = await instance.getItem("file.txt");

  expect(data).toEqual("Test file!\n");
});

test("reads file with absolute path", async () => {
  const instance = storage();
  instance.setOptions({
    templatesDirectory: "tests/fixtures"
  });

  const data = await instance.getItem(path.resolve("tests/fixtures/file.txt"));

  expect(data).toEqual("Test file!\n");
});

test("throw error if file does not exist", async () => {
  const instance = storage();
  instance.setOptions({
    templatesDirectory: "tests/fixtures"
  });

  await expect(instance.getItem("random-file.md")).rejects.toThrow(
    /no such file/
  );
});
