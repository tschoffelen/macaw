const path = require("path");

const Template = require("../../src/lib/Template");

test("template without frontmatter uses default layout", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-no-frontmatter.md"),
    {
      layoutsDirectory: "layouts"
    },
    {}
  );

  expect(template.layoutFilePath).toEqual(
    path.resolve("./tests/emails/layouts/default.mjml")
  );
});

test("template can specify custom layout", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-custom-layout.md"),
    {
      layoutsDirectory: "layouts"
    },
    {}
  );

  expect(template.layoutFilePath).toEqual(
    path.resolve("./tests/emails/layouts/custom.mjml")
  );
});

test("template throws error if file doesn't exist", () => {
  const loadNonExistingTemplate = () => {
    new Template("randomfile.md", {}, {});
  };

  expect(loadNonExistingTemplate).toThrow(/no such file/i);
});

test("template renders with vars", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-no-frontmatter.md"),
    {
      layoutsDirectory: "layouts"
    },
    {
      name: "John"
    }
  );

  const html = template.render();

  expect(html).toContain("Hello, John!");
});

test("template renders layout with vars", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-twig-subject.md"),
    {
      layoutsDirectory: "layouts"
    },
    {
      name: "John"
    }
  );

  const html = template.render();

  expect(html).toContain("Twig, world!");
});

test("template gracefully handles missing vars", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-twig-subject.md"),
    {
      layoutsDirectory: "layouts"
    },
    {}
  );

  const html = template.render();

  expect(html).toContain("Twig, world!");
  expect(html).toContain("Hello, !");
});

test("template send calls provider send function", () => {
  const mockSend = jest.fn();
  const template = new Template(
    path.resolve("./tests/emails/example-no-frontmatter.md"),
    {
      layoutsDirectory: "layouts",
      provider: {
        send: mockSend
      }
    },
    {
      name: "John"
    }
  );

  const html = template.render();
  const to = {
    name: "John",
    email: "john@example.com"
  };

  template.send({
    to
  });

  expect(mockSend).toBeCalledTimes(1);
  expect(mockSend).toBeCalledWith({ html, to, data: template.data });
});

test("template throws error on invalid mjml", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-invalid-mjml.md"),
    {
      layoutsDirectory: "layouts"
    },
    {
      name: "John"
    }
  );

  expect(template.data.layout).toEqual("invalid");

  const callRender = () => {
    template.render();
  };

  expect(callRender).toThrow(/invalid mjml/i);
});

test("template send throws error if no provider set", () => {
  const template = new Template(
    path.resolve("./tests/emails/example-no-frontmatter.md"),
    {
      layoutsDirectory: "layouts"
    },
    {
      name: "John"
    }
  );

  const callSend = () => {
    template.send({
      to: {
        name: "John",
        email: "john@example.com"
      }
    });
  };

  expect(callSend).toThrow(/no provider set/i);
});
