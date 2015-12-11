Jimdo Protect CMS Linter
========================

Linting tool to check if css potentially leaks rules into the Jimdo CMS interface.


Install
-------

`npm install jimdo-protect-cms-linter`

add `-g` for global bin


Usage
-----

### CLI

`protect-cms-lint ./myCss.css`

### Programmatic

```js
var css = 'html { color: fuchsia; }';
var Linter = require('jimdo-protect-cms-linter');
var linter = new Linter();

var result = linter.lint(css);
// do something with result
```

### Custom Rules

Linting rules can be customized by passing them into linter creation
A rule is supposed to throw an error when something is not cool, and
to be silent when everything is fine. Line and column numbers will
be applied automatically.


```
var linter = new Linter({
  noBareElement: Linter.defaultRules.noBareElement,
  noFooSelectors: (rule) => {
    if (rule.selectors.join('').indexOf('foo') !== -1) {
      throw new Error('no foo allowed here');
    }
  };
});
```

Rules can also be manipulated after linter creation

```
var linter = new Linter();
delete linter.rules.protectedNamespace;
```


Results
-------

linter will allways return a json object with the following keys

### status

 - `'OK'`/`Linter.CONSTANTS.STATUS_OK`: everything fine
 - `'ParsingError'`/`Linter.CONSTANTS.STATUS_PARSING_ERROR`: could not parse CSS
 - `'LintError'`/`Linter.CONSTANTS.STATUS_LINT_ERROR`: found some linting issues

### errors

Array of potential parsing or linting errors

Example:

```js
Error {
  reason: 'you shall not do this',
  line: 3,
  column: 14
}
```

