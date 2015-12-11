'use strict';

const PROTECTED_NAMESPACE = [
  '.j-',
  '.cc-m'
];

function forEachSubselector(selectors, cb) {
  selectors.forEach((selector) => {
    selector.split(' ').forEach(cb);
  });
}

module.exports = function noBareElement(rule) {
  PROTECTED_NAMESPACE.forEach((protectedNamespace) => {
    forEachSubselector(rule.selectors, (subselector) => {
      const withoutModule = subselector.replace('.j-module', '');

      if (withoutModule.indexOf(protectedNamespace) !== -1) {
        throw new Error(`illegal use of "${protectedNamespace}"...`);
      }
    });
  });
};
