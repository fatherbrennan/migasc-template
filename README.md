# MigascTemplate

Simple and fast templating engine.

For familiarity Mustache open/close syntax is used by default.

## Resources

- [Documentation](https://fatherbrennan.github.io/migasc-template)
- [Changelog](https://github.com/fatherbrennan/migasc-template/blob/master/CHANGELOG.md)

## Quickstart

**1. Install**

```shell
npm install migasc-template
```

**2. Import**

```javascript
import MigascTemplate from 'migasc-template';
```

Or

```javascript
const MigascTemplate = require('migasc-template');
```

**3. Create Instance**

```javascript
const mt = new MigascTemplate(
  // MigascTemplate Options
  { doAllowWhitespace: true },
  // MigascTemplate Dictionary
  {
    adjective: 'mysterious',
    animal: 'Cats',
    author: 'Sir Walter Scott',
  }
);
```

**4. Compile Templates**

> Given:
>
> ```javascript
> const template =
>   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
> ```

Use the global dictionary.

```javascript
mt.compile(template);
// -> Cats are a mysterious kind of folk - Sir Walter Scott
```

Use a local dictionary.

```javascript
mt.compile(template, {
  adjective: 'special',
  animal: 'Kevins',
  author: 'Michael Scott',
});
// -> Kevins are a special kind of folk - Michael Scott
```

Use a precompiled template.

```javascript
// Precompile the template
mt.setTemplate(template);

mt.template();
// -> Cats are a mysterious kind of folk - Sir Walter Scott
```

## Default Options

| Option              | Type      |       Default |
| :------------------ | :-------- | ------------: |
| `dict404`           | `string`  |          `''` |
| `doAllowEscapeChar` | `boolean` |       `false` |
| `doAllowWhitespace` | `boolean` |       `false` |
| `maxChars`          | `number`  |          `64` |
| `maxWhitespace`     | `number`  |          `64` |
| `tags.close`        | `string`  |          `}}` |
| `tags.open`         | `string`  |          `{{` |
| `validChars`        | `string`  | `a-zA-Z0-9_-` |

**Example**

```javascript
const mt = new MigascTemplate();

mt.compile('{{animal}} are a {{adjective}} kind of folk - {{author}}', {
  adjective: 'mysterious',
  animal: 'Cats',
  author: 'Sir Walter Scott',
});
// -> Cats are a mysterious kind of folk - Sir Walter Scott
```

## Usage Caution

The default templating language uses Mustache open/close syntax `{{variableName}}` without any whitespace. MigascTemplate relies on accurate user input as it does not throw template syntax errors. Therefore, it is recommended that templates are written using Mustache/Handlebars syntax highlighting extensions or the Handlebars file extension (.hbs) for syntax feedback.

Generating lists is common usage when using EJS and Handlebars and although this is not the intent of MigascTemplate, it can be achieved via IIFEs.

```javascript
// Note: This is not efficient code, it's purpose is to showcase
mt.compile('<ul>{{list}}</ul>', {
  list: new Array(20)
    .fill(0)
    .map(() => `<li>${Math.random()}</li>`)
    .join(''),
});
```

## Benchmarks

Benchmark results are produced from the [benchmark script](https://github.com/fatherbrennan/migasc-template/blob/master/test/benchmark/index.js).

| Test                                                 | Operations per Second | Relative Margin of Error | Samples |
| ---------------------------------------------------- | --------------------: | -----------------------: | ------: |
| [char 45] `EJS.render`                               |                56,117 |                   ±0.20% |      87 |
| [char 45] `EJS.compile`                              |                57,228 |                   ±0.19% |      98 |
| [char 45] `EJS.compile` (precompiled)                |               475,339 |                   ±0.25% |      94 |
| [char 45] `Handlebars.compile`                       |                 7,717 |                   ±0.31% |      94 |
| [char 45] `Handlebars.compile` (precompiled)         |               224,557 |                   ±0.23% |      94 |
| [char 45] `MigascTemplate.compile`                   |               517,494 |                   ±0.27% |      96 |
| [char 45] `MigascTemplate.template` (precompiled)    |             1,003,012 |                   ±0.22% |      94 |
| [char 380] `EJS.render`                              |                37,654 |                   ±0.38% |      99 |
| [char 380] `EJS.compile`                             |                38,099 |                   ±0.17% |      96 |
| [char 380] `EJS.compile` (precompiled)               |               356,497 |                   ±0.24% |      95 |
| [char 380] `Handlebars.compile`                      |                 7,097 |                   ±0.37% |      91 |
| [char 380] `Handlebars.compile` (precompiled)        |               231,864 |                   ±0.17% |      92 |
| [char 380] `MigascTemplate.compile`                  |               474,601 |                   ±0.22% |      98 |
| [char 380] `MigascTemplate.template` (precompiled)   |             1,017,288 |                   ±0.29% |      96 |
| [char 38022] `EJS.render`                            |                 1,597 |                   ±0.20% |      98 |
| [char 38022] `EJS.compile`                           |                 1,600 |                   ±0.13% |      96 |
| [char 38022] `EJS.compile` (precompiled)             |                11,765 |                   ±0.27% |      96 |
| [char 38022] `Handlebars.compile`                    |                   231 |                   ±0.62% |      83 |
| [char 38022] `Handlebars.compile` (precompiled)      |                60,799 |                   ±0.96% |      94 |
| [char 38022] `MigascTemplate.compile`                |                19,123 |                   ±0.14% |      96 |
| [char 38022] `MigascTemplate.template` (precompiled) |               215,903 |                   ±0.20% |      96 |

## License

MigascTemplate is released under the MIT license.
