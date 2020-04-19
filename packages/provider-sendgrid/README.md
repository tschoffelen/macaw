# Sendgrid provider for Macaw

**[Macaw](https://macaw.email/) is a simple library to streamline email templating.**

## Quickstart

Please start by looking at the [Macaw documentation](https://macaw.email/).

First install the Sendgrid provider package:

```
yarn add @macaw-email/provider-sendgrid
```

When initiating your instance of Macaw, pass in Sendgrid as your provider:

```js
const sendgrid = require("@macaw-email/provider-sendgrid");

const mailer = macaw({
  provider: sendgrid({ apiKey: "aaaaa-bbbbbbb-ccccccc-ddddddd" })
});
```

You can find your API key in the Sendgrid developer console.

Then you can load a template and send it:

```js
const template = await mailer.template("monthly-newsletter", {
  greeting: "Hello, world"
});

await template.send({
  subject: "Hello, world!",
  to: {
    name: "Thomas Schoffelen",
    email: "thomas@schof.co"
  },
  from: {
    name: "Mark from Startup X",
    email: "noreply@startup-x.com"
  }
});
```

The `template.send()` function accepts any parameters that are accepted by the [Sendgrid Node API](https://github.com/sendgrid/sendgrid-nodejs/blob/master/use-cases/kitchen-sink.md). It requires at least a `subject`, `to` and `from` field to be set.
