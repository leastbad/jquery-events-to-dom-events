!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = e || self).jqueryEventsToDomEvents = {}))
})(this, function (e) {
  ;(e.abnegate = function (e, t) {
    e.startsWith('$')
      ? document.removeEventListener(e, t)
      : window.$(document).off(e, t)
  }),
    (e.delegate = function (e, t) {
      void 0 === t && (t = ['event'])
      var n = e.startsWith('$')
        ? function () {
            return window
              .$(document)
              .trigger(e.slice(1), [].slice.call(arguments)[0].detail)
          }
        : function () {
            var n = arguments,
              o = t.reduce(function (e, t, o) {
                return (e[t] = [].slice.call(n)[o]), e
              }, {})
            o.event.target.dispatchEvent(
              new CustomEvent('$' + e, {
                detail: o,
                bubbles: !0,
                cancelable: !0
              })
            )
          }
      return (
        e.startsWith('$')
          ? document.addEventListener(e, n)
          : window.$(document).on(e, n),
        n
      )
    })
})
//# sourceMappingURL=index.umd.js.map
