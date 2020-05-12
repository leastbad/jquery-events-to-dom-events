;(exports.abnegate = function (e, t) {
  e.startsWith('$')
    ? document.removeEventListener(e, t)
    : window.$(document).off(e, t)
}),
  (exports.delegate = function (e, t) {
    void 0 === t && (t = ['event'])
    var n = e.startsWith('$')
      ? function () {
          return window
            .$(document)
            .trigger(e.slice(1), [].slice.call(arguments)[0].detail)
        }
      : function () {
          var n = arguments,
            i = t.reduce(function (e, t, i) {
              return (e[t] = [].slice.call(n)[i]), e
            }, {})
          i.event.target.dispatchEvent(
            new CustomEvent('$' + e, { detail: i, bubbles: !0, cancelable: !0 })
          )
        }
    return (
      e.startsWith('$')
        ? document.addEventListener(e, n)
        : window.$(document).on(e, n),
      n
    )
  })
//# sourceMappingURL=index.js.map
