'use strict';

var Linter = require('../lib/ProtectCmsLinter');
var CONSTANTS = require('../lib/CONSTANTS');

describe('linter', () => {
  var linter = null;

  beforeEach(() => {
    linter = new Linter({});
  });

  it('passes through parsing errors', () => {
    var result = linter.lint('html color: blue }');
    var errorLine = 1;
    var errorColums = 19;

    expect(result.status).toBe(CONSTANTS.STATUS_PARSING_ERROR);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].line).toBe(errorLine);
    expect(result.errors[0].column).toBe(errorColums);
    expect(result.errors[0].reason).toBe('missing \'{\'');
  });

  it('applies its rules', () => {
    linter.rules.fakeRule = jasmine.createSpy('fakeRule');

    linter.lint('html { color: blue }');

    expect(linter.rules.fakeRule).toHaveBeenCalled();
  });

  it('passes through errors of rules', () => {
    var fakeError = new Error('foo');
    var result = null;
    var errorLine = 1;
    var errorColums = 1;

    linter.rules.fakeRule = jasmine.createSpy('fakeRule')
      .and.throwError(fakeError);

    result = linter.lint('html { color: blue }');

    expect(result.status).toBe(CONSTANTS.STATUS_LINT_ERROR);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toBe(fakeError);
    expect(result.errors[0].line).toBe(errorLine);
    expect(result.errors[0].column).toBe(errorColums);
    expect(result.errors[0].reason).toBe('foo');
  });

  it('uses default rules', () => {
    var originDefaultRules = Linter.defaultRules;

    Linter.defaultRules = {
      test: jasmine.createSpy('fakeDefaultRule')
    };

    linter = new Linter();
    linter.lint('html { color: blue }');
    expect(Linter.defaultRules.test).toHaveBeenCalled();

    Linter.defaultRules = originDefaultRules;
  });
});
