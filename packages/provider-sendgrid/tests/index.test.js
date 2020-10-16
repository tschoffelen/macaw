jest.mock("@sendgrid/mail");
const sendgrid = require("@sendgrid/mail");

const provider = require("../src/index");

test("sets api key", () => {
  provider({ apiKey: "aaaa" });
  expect(sendgrid.setApiKey).toBeCalledWith("aaaa");
});

test("throws when no api key is specified", () => {
  expect(() => provider({})).toThrow();
});

test("passes through html", () => {
  const providerOptions = {
    data: {},
    html: "<p>Hello, world!</p>"
  };

  const sender = provider({ apiKey: "aaaa" });
  sender.send(providerOptions);
  expect(sendgrid.setApiKey).toBeCalledWith("aaaa");
  expect(sendgrid.send).toBeCalledWith({
    html: "<p>Hello, world!</p>",
    categories: []
  });
});

test("sets expected categories", () => {
  const providerOptions = {
    data: {
      template: "intro-customer-email"
    },
    html: "<p>Hello, world!</p>"
  };

  const sender = provider({ apiKey: "aaaa" });
  sender.send(providerOptions);
  expect(sendgrid.setApiKey).toBeCalledWith("aaaa");
  expect(sendgrid.send).toBeCalledWith({
    categories: ["intro-customer-email", "intro"],
    html: "<p>Hello, world!</p>"
  });
});

test("sets expected custom categories", () => {
  const providerOptions = {
    data: {
      template: "intro-customer"
    },
    categories: ["payment"],
    html: "<p>Hello, world!</p>"
  };

  const sender = provider({ apiKey: "aaaa" });
  sender.send(providerOptions);
  expect(sendgrid.setApiKey).toBeCalledWith("aaaa");
  expect(sendgrid.send).toBeCalledWith({
    categories: ["intro-customer", "payment", "intro"],
    html: "<p>Hello, world!</p>"
  });
});
