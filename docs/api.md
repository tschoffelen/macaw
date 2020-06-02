| [Macaw](../../README.md) / [Documentation](../../README.md#documentation) |
| :------------------------------------------------------------------------ |


# API reference

## Classes

- [Macaw](#macaw) - main mailer instance class
- [Template](#template) - template instance class

## Macaw

Usually, rather than initiating this class directly, you'd use the factory
function `macaw`.

```js
const mailer = macaw({ templatesDirectory: "emails" });
```

### `mailer.template()`

Load a template from storage, and set any variables that should be made
available within the template. Returns a Template instance.

Note that this method is async!

```js
const template = await mailer.template("newsletter", { name: "John" });
```

##### Parameters

- **String `templateName`** - The name of the template to load, excluding directory name and extension
- **Object `data`** - Key-value object with template variable values

##### Return value

- **Promise&lt;[Template](#template)&gt;** - Template instance

## Template

Use the `template()` function on your Macaw instance to initiate a template instance.

### `template.render()`

Parse the template and return raw HTML output.

##### Return value

- **String** - Parsed template HTML

### `template.send()`

Send the template via the `provider` specified in the Macaw options.

Every provider requires their own set of `sendOptions`, so have a look
at the README file for the provider to find out what to pass along.

##### Parameters

- **Object `sendOptions`** - Options to be passed to provider

##### Return value

- **Promise&lt;any&gt;** - Response from provider

### `template.data`

**Object** Frontmatter data in markdown template.

### `template.markdown`

**String** Raw markdown body of template (with frontmatter stripped out).

### `template.mjml`

**String** Raw MJML layout file content.
