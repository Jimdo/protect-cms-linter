'use strict';

var parseCss = require('css').parse;
var noBareElement = require('./rules/noBareElement');
var sourceMap = require('source-map');
var protectedNamespace = require('./rules/protectedNamespace');
var semiProtectedNamespace = require('./rules/semiProtectedNamespace');
var CONSTANTS = require('./CONSTANTS');

function forEachCssRule(cssRules, sourceMapConsumer, cb) {
  cssRules.forEach((cssRule) => {
    if (cssRule.type === 'rule') {
      if (sourceMapConsumer) {
        cssRule.position.start = sourceMapConsumer.originalPositionFor(
          cssRule.position.start
        );
        cssRule.position.end = sourceMapConsumer.originalPositionFor(
          cssRule.position.end
        );
      }
      cb(cssRule);
    }

    if (cssRule.rules) {
      forEachCssRule(cssRule.rules, sourceMapConsumer, cb);
    }
  });
}

function getSourceMapConsumer(rawSourcemapJson) {
  if (rawSourcemapJson) {
    return new sourceMap.SourceMapConsumer(rawSourcemapJson);
  }
}

class ProtectCmsLinter {
  constructor(rules) {
    if (typeof rules === 'undefined') {
      this.rules = ProtectCmsLinter.defaultRules;
    } else {
      this.rules = rules;
    }
  }

  lint(css, rawSourcemapJson) {
    var parsedCss = null;

    parsedCss = parseCss(css, {silent: true});

    if (parsedCss.stylesheet.parsingErrors.length) {
      return {
        status: CONSTANTS.STATUS_PARSING_ERROR,
        errors: parsedCss.stylesheet.parsingErrors
      };
    }

    this.errors = [];
    forEachCssRule(
      parsedCss.stylesheet.rules,
      getSourceMapConsumer(rawSourcemapJson),
      this.applyRules.bind(this)
    );

    if (this.errors.length) {
      return {
        status: CONSTANTS.STATUS_LINT_ERROR,
        errors: this.errors
      };
    }

    return {
      status: CONSTANTS.STATUS_OK
    };
  }
  applyRules(cssRule) {
    for (const rulename in this.rules) {
      if (this.rules.hasOwnProperty(rulename)) {
        const rule = this.rules[rulename];

        try {
          rule(cssRule);
        } catch (err) {
          this.errors.push(this.decorateErr(err, cssRule));
        }
      }
    }
  }
  decorateErr(err, cssRule) {
    if (!err.source) {
      err.source = cssRule.position.start.source;
    }
    if (!err.line) {
      err.line = cssRule.position.start.line;
    }
    if (!err.column) {
      err.column = cssRule.position.start.column;
    }
    if (!err.reason) {
      err.reason = err.message;
    }

    return err;
  }

}

ProtectCmsLinter.defaultRules = {
  noBareElement,
  protectedNamespace,
  semiProtectedNamespace
};

module.exports = ProtectCmsLinter;
