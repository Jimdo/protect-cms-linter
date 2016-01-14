'use strict';

const SEMI_PROTECTED_NAMESPACE = '.j-';
const EXCLUSION_ZONE = /\.j-module-content$/;

module.exports = function noBareElement(rule) {
  rule.selectors.forEach((selector) => {
    var hadExclusion = false;

    if (selector.indexOf(SEMI_PROTECTED_NAMESPACE) === -1) {
      return;
    }

    const subselectors = selector.split(' ');

    subselectors.forEach((subselector, index) => {
      if (hadExclusion) {
        return;
      }

      if (EXCLUSION_ZONE.test(subselector)) {
        hadExclusion = true;
        return;
      }

      if (subselector.indexOf(SEMI_PROTECTED_NAMESPACE) !== -1 &&
        index < subselectors.length - 1
      ) {
        throw new Error(`${SEMI_PROTECTED_NAMESPACE}* selector ` +
          `must be the hindmost`);
      }
    });
  });
};
