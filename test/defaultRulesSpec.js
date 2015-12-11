'use strict';

var getFixtures = require('./helper/getFixtures');
var goodFixtures = getFixtures('good');
var badFixtures = getFixtures('bad');
var getCssFromFixture = require('./helper/getCssFromFixture');
var Linter = require('../lib/ProtectCmsLinter');
var CONSTANTS = require('../lib/CONSTANTS');

describe('default rules', () => {
  var linter = null;

  beforeEach(() => {
    linter = new Linter();
  });

  describe('with positive fixtures', () => {
    goodFixtures.forEach((fixture) => {
      it(`accepts ${fixture.name}`, (done) => {
        getCssFromFixture(fixture).then((css) => {
          expect(linter.lint(css).status).toBe(CONSTANTS.STATUS_OK);

          done();
        }).catch(done.fail);
      });
    });
  });

  describe('with negative fixtures', () => {
    badFixtures.forEach((fixture) => {
      it(`declines ${fixture.name}`, (done) => {
        getCssFromFixture(fixture).then((css) => {
          expect(linter.lint(css).status).toBe(CONSTANTS.STATUS_LINT_ERROR);

          done();
        }).catch(done.fail);
      });
    });
  });
});
