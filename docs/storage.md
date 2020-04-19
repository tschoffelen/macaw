| [Macaw](../../README.md) / [Documentation](../../README.md#documentation) |
| :------------------------------------------------------------------------ |


# Template storage

By default, Macaw expects your template files to exist in a local directory named `emails` relative to your script file. You can change this path, or ask Macaw to load the templates from other sources, like Amazon S3.

## Local templates directory

When initiating your Macaw instance, pass along a `templatesDirectory` in the options to change the email template storage path:

```js
const mailer = macaw({
  templatesDirectory: "resources/misc/emails"
});
```

## Layout files path

By default Macaw expects layout files to exist in a subdirectory of the `templatesDirectory` called `layouts`. Of course this can be changed as well:

```js
const mailer = macaw({
  layoutsDirectory: "mjml-layout-files" // relative to templatesDirectory
});
```

## Loading templates from AWS S3

First add `@macaw-email/storage-s3` to your project:

```
yarn add @macaw-email/storage-s3
```

Then reference it in your code:

```js
const macaw = require("macaw");
const s3 = require("@macaw-email/storage-s3");

const mailer = macaw({
  storage: s3("my-bucket-name")
});
```

The `s3()` function accepts three parameters:

- `bucketName` – **required**, string that contains the S3 bucket name from where Macaw will read your templates.
- `s3Options` – optional, object of options that can be passed in to the S3 constructor to specify things like region and credentials.
- `aws` – optional, override the default AWS object loaded from `aws-sdk`. Useful for testing/mocking.

Notes:

- When loading from S3, the `templatesDirectory` option is ignored (expects templates to be in the root of the bucket), but `layoutsDirectory` is still taken into account, and defaults to `layouts`.
