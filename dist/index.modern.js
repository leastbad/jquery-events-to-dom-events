const t = (t, e = ['event']) => {
    const n = t.startsWith('$')
      ? (...e) => window.$(document).trigger(t.slice(1), e[0].detail)
      : (...n) => {
          const o = e.reduce((t, e, o) => ((t[e] = n[o]), t), {})
          o.event.target.dispatchEvent(
            new CustomEvent('$' + t, { detail: o, bubbles: !0, cancelable: !0 })
          )
        }
    return (
      t.startsWith('$')
        ? document.addEventListener(t, n)
        : window.$(document).on(t, n),
      n
    )
  },
  e = (t, e) => {
    t.startsWith('$')
      ? document.removeEventListener(t, e)
      : window.$(document).off(t, e)
  }
export { e as abnegate, t as delegate }
//# sourceMappingURL=index.modern.js.map
