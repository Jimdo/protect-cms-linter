Jimdo Protect CMS Linter
========================

[![Build Status](https://img.shields.io/travis/Jimdo/protect-cms-linter/master.svg?style=flat-square)](https://travis-ci.org/Jimdo/protect-cms-linter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![David](https://img.shields.io/david/Jimdo/protect-cms-linter.svg?style=flat-square)](https://david-dm.org/Jimdo/protect-cms-linter)


Linting tool to check if css potentially leaks rules into the Jimdo CMS interface.

Do you do grunt? - check out [grunt-jimdo-protect-cms](https://github.com/Jimdo/grunt-jimdo-protect-cms)


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


```js
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

```js
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


Tests
-----

If you find an edge-case where the linter build false results, please
add a css file to [`test/fixtures/good`](https://github.com/Jimdo/protect-cms-linter/tree/master/test/fixtures/good)
or [`test/fixtures/bad`](https://github.com/Jimdo/protect-cms-linter/tree/master/test/fixtures/bad) 

These files will be tested in unit tests and on travis.


LICENSE
-------

> The MIT License
>
> Copyright (c) 2015 Jimdo GmbH
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.

