(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['jquery-events-to-dom-events'] = {}));
}(this, (function (exports) { 'use strict';

  const delegate = (event, params = ['event']) => {
    const handler = (...args) => {
      const detail = params.reduce((acc, cur, idx) => {
        acc[cur] = args[idx];
        return acc;
      }, {});
      const sequel = new CustomEvent(`$${event}`, {
        detail,
        bubbles: true,
        cancelable: true
      });
      return detail.event.target.dispatchEvent(sequel);
    };

    window.$(document).on(event, handler);
    return handler;
  };

  const abnegate = (event, handler) => window.$(document).off(event, handler);

  exports.abnegate = abnegate;
  exports.delegate = delegate;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
