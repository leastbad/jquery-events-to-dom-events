var t = function (t, e) {
    void 0 === e && (e = ['event'])
    var n = t.startsWith('$')
      ? function () {
          return window
            .$(document)
            .trigger(t.slice(1), [].slice.call(arguments)[0].detail)
        }
      : function () {
          var n = arguments,
            i = e.reduce(function (t, e, i) {
              return (t[e] = [].slice.call(n)[i]), t
            }, {})
          i.event.target.dispatchEvent(
            new CustomEvent('$' + t, { detail: i, bubbles: !0, cancelable: !0 })
          )
        }
    return (
      t.startsWith('$')
        ? document.addEventListener(t, n)
        : window.$(document).on(t, n),
      n
    )
  },
  e = function (t, e) {
    t.startsWith('$')
      ? document.removeEventListener(t, e)
      : window.$(document).off(t, e)
  }
export { e as abnegate, t as delegate }
//# sourceMappingURL=index.m.js.map
