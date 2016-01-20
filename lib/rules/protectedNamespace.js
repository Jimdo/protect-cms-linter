'use strict';

const PROTECTED_NAMESPACES = [
  '.cc-',
  '.jui-'
];

function forEachSubselector(selectors, cb) {
  selectors.forEach((selector) => {
    selector.split(' ').forEach(cb);
  });
}

module.exports = function noBareElement(rule) {
  PROTECTED_NAMESPACES.forEach((protectedNamespace) => {
    forEachSubselector(rule.selectors, (subselector) => {
      if (subselector.indexOf(protectedNamespace) !== -1) {
        throw new Error(`illegal use of "${protectedNamespace}"...`);
      }
    });
  });
};
