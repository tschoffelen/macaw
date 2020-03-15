| [Macaw](../../README.md) / [Documentation](../../README.md#documentation) |
| :------------------------------------------------------------------------ |


# Building templates

Macaw provides a neat structure for managing email templates, separating out copy and layouts as re-usable components:

- A **layout** is written in [MJML](https://mjml.io/), a very simple HTML-like markup language that allows you to design responsive and cross-client compatible emails.
- In Macaw, an email **template** is a simple Markdown file with some frontmatter to choose what layout to use, and optionally set a subject, etc. This makes it easy to edit the copy of emails, even for non-developers.

Keeping these two things separate allows easy editing by each stakeholder (e.g. a designer can work on the layout files, a marketing team member can work on the texts in the actual templates).

## Layout files

Layout files determine the design of the email. It's similar to a HTML template, but built using **[MJML](https://mjml.io/)**, a HTML-like language that makes it easy to build email templates that look good in every email client, without having to resort to all the tricks you usually need to make even the most basic things work.

Macaw automatically compiles those MJML files to compatible HTML when you use it to preview a template or send it.

Learn about how MJML works by checking out their [Getting Started tutorial](https://mjml.io/getting-started/1), followed by their [components documentation](https://mjml.io/documentation/#standard-body-components) to learn about all the fun things you can do with it.

They also provide a [library of templates](https://mjml.io/templates) you can use as a starting point for your own.

### Layout variables

In your layout files, you can use any **[Twig](https://twig.symfony.com/)** to make the template dynamic based on any of the variables that are added in when you send the email, or any variables in the front matter of template files (see below). Some examples:

If you want to add a personal greeting, that would probably look something like this:

```xml
<mj-text>Hi, {{to.name}}!</mj-text>
```

Or if you wanted to conditionally include or exclude components:

```xml
{% if discounted %}
<mj-text>There's now a discount! Order fast, stock is limited!</mj-text>
{% endif %}
```

### Template body

One of those special variables is called `body`, and it contains the HTML for the main content, created from parsing a markdown template (see below). Usually you'd include it in your template like this:

```xml
<mj-text>
    {{body | raw}}
</mj-text>
```

(the `| raw` here tells Twig to allow HTML in this variable!)

## Template files

**[Markdown](https://daringfireball.net/projects/markdown/)** is used to write the content for your emails, in files ending in `.md` in your `emails` directory. This is a way of creating plain text files that can still contain bold, italic, links etc.

It abstracts away all of the layout, so that you can focus on what is really important: the content. No need to know any HTML for this part.

### Front matter

If you open up the example template, you'll see that there's some information at the top of the file before the actual content starts:

```md
---
layout: default
subject: November newsletter
preview: Here's your news for November.
---

Rest of the email here...
```

This is what we call 'front matter'. It is the meta data that is attached
to the email.

Front matter is a list of names and values, separated by a colon. This information is passed along to the layout file, so that you can use these variables to customize the way the email is displayed.

Macaw requires only two values to be present here:

- **layout**: this determines what layout file to use. If you set this to `newsletter` for example, it will use the file `emails/layouts/newsletter.mjml` as the layout. If you omit it, it load the default template (`emails/layouts/default.mjml`).
- **subject**: the email subject line

You're free to add whatever other variables you might need in here.

## Template variables

It is also possible to use variables in your email body. For example, if you
type:

```md
Hello team at {{name}}!
```

It will be shown as:

> Hello team at Customer X!

Anything between double curly braces will be parsed as a variable using **[Twig](https://twig.symfony.com/)**.

What variables are available, depends on what you pass into the parser when you parse the template. You can test this out using the preview tool (by running `yarn macaw` in your project).

For example, you might pass in this JSON object:

```json
{
  "subject": "Hello, world",
  "to": {
    "name": "John",
    "email": "john@example.com"
  }
}
```

Which you can then use in your template like this:

```md
Hi {{to.name}},

You are receiving this email because you signed up for the newsletter using your email address {{to.email}}.
```

Which would result in this output:

> Hi John,
>
> You are receiving this email because you signed up for the newsletter using your email address john@example.com.
