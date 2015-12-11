'use strict';

const MODULE_NAMESPACE = '.j-module';

module.exports = function noBareElement(rule) {
  rule.selectors.forEach((selector) => {
    var subselectors = selector.split(' ');
    var hadModuleNamespace = false;

    subselectors.forEach((subselector) => {
      if (!hadModuleNamespace && subselector.indexOf(MODULE_NAMESPACE) === 0) {
        hadModuleNamespace = true;
      }

      if (!hadModuleNamespace && !/[\.\#]/g.test(subselector)) {
        throw new Error(`contains bare element ${subselector}`);
      }
    });
  });
};
