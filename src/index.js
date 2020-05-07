const delegate = (event, params = ['event']) => {
  const handler = (...args) => {
    const detail = params.reduce((acc, cur, idx) => {
      acc[cur] = args[idx]
      return acc
    }, {})
    const sequel = new CustomEvent(`$${event}`, {
      detail,
      bubbles: true,
      cancelable: true
    })
    return detail.event.target.dispatchEvent(sequel)
  }
  window.$(document).on(event, handler)
  return handler
}

const abnegate = (event, handler) => window.$(document).off(event, handler)

export { delegate, abnegate }
