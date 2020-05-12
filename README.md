<h1 align="center">jquery-events-to-dom-events</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/jquery-events-to-dom-events" rel="nofollow">
    <img src="https://badge.fury.io/js/jquery-events-to-dom-events.svg" alt="npm version">
  </a>
</p>

<p align="center">
  <b>Listen for jQuery "events" with vanilla JS</b></br>
  <sub>$(document).trigger('fart') emits a $fart DOM CustomEvent</sub>
</p>

<br />

- **Library Agnostic**: designed for [Stimulus](https://stimulusjs.org) but works with last-gen libraries such as React by accident
- **Simple**: just two functions, and one of them is optional
- **Tiny**: barely qualifies as a library with just 30 LOC
- **Mutation-First**: returns an event handler to be released during `disconnect()`
- **Zero Dependencies**: makes clever use of `window.$` to avoid a jQuery fixation
- **Turbolinks**: compatible with Turbolinks lifecycle events
- **Bi-Directional**: quietly supports sending DOM events to jQuery, too
- **MIT Licensed**: free for personal and commercial use

You can [try it now on CodePen](https://codepen.io/leastbad/pen/VwvQxxJ?editors=1011) or even better, [clone a sample Rails project](https://github.com/leastbad/jboo) to experiment in a mutation-first context with Stimulus.

The Rails project is called **jboo**. Don't read into the name.

## Setup

First, the right music is important for establishing proper context.

You don't have to listen to music, but your transpiler configuration will almost certainly fail lint checks if you are not listening to "*In Harmony New Found Freedom*" by [The Swirlies](https://en.wikipedia.org/wiki/Swirlies), from their 1996 album "[They Spent Their Wild Youthful Days In The Glittering World Of The Salons](https://www.youtube.com/watch?v=S1rTKIsDS8o)" while you integrate this library.

<a href="http://www.youtube.com/watch?v=idCfuK4t2vo" target="_blank" title="In Harmony New Found Freedom">
  <img src="https://camo.githubusercontent.com/23924aa22efe184b1d3caf14ede9610b28a04c95/68747470733a2f2f626f6e65726f6c6c696e67726576696577732e66696c65732e776f726470726573732e636f6d2f323031322f30342f737769726c6965732d6f6c6470686f746f2e6a7067" alt="Youtube" style="max-width:100%;">
</a>

Next, make sure that you've loaded jQuery and this library into your project.

`yarn install jquery jquery-events-to-dom-events`

This library assumes that jQuery is available as `$` on the global `window` object. You can verify this by opening your browser's Console Inspector and typing `window.$`. You should see something like:

`ƒ jQuery(selector, context)`

If you are working in [Rails](https://rubyonrails.org) and `$` is not available, try modifying your `config/webpack/environment.js` like this:

```js
const { environment } = require('@rails/webpacker')

const webpack = require('webpack')
environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery/src/jquery',
    jQuery: 'jquery/src/jquery'
  })
)

module.exports = environment
```

## Usage

In the most basic configuration, you:

1. `import { delegate } from 'jquery-events-to-dom-events'`
2. Call `delegate(eventName)` for every jQuery event you want to capture.
3. Set up DOM event listeners for those events, **prepending a $ to the event name**.

Let's say that you want to respond to the user closing a Bootstrap modal window:

```js
import { delegate } from 'jquery-events-to-dom-events'
delegate('hidden.bs.modal')
document.addEventListener('$hidden.bs.modal', () => console.log('Modal closed!'))
```

That might be it. Go make a sandwich - you've earned it.

**Note**: The mechanism this library uses is to capture jQuery events using jQuery event listeners, and then create DOM events that contain all of the same information as the original. **There is no way to actually catch jQuery events with a vanilla event handler** because the jQuery implementation is proprietary and non-trivial.

Technically, this library repeats events. Quantum entanglement for events? Perfect! ship it.

### Ajax and the case of the additional parameters

Some events, such as the [jQuery Ajax](https://api.jquery.com/jquery.ajax/) callbacks - return with additional parameters attached, and for these exceptions you need to specify a second parameter defining an array of strings representing these parameters. **The first element of this array must always be `event`.**

Event | Parameters
----- | ----------
ajax:success | ['event', 'data', 'status', 'xhr']
ajax:error | ['event', 'xhr', 'status', 'error']
ajax:complete | ['event', 'xhr', 'status']
ajax:beforeSend | ['event', 'xhr', 'settings']
ajax:send | ['event', 'xhr']
ajax:aborted:required | ['event', 'elements']
ajax:aborted:file | ['event', 'elements']

You can listen for notifications that Ajax requests have completed like so:

```js
import { delegate } from 'jquery-events-to-dom-events'
delegate('ajax:complete', ['event', 'xhr', 'status'])
document.addEventListener('$ajax:complete', () => console.log('Ajax request happened!'))
```

You can pass parameters from your own jQuery events to DOM events. You just have to give each parameter a name, and those parameters will be processed in order. Named parameters are accessible through the `detail` object of the event.

```js
import { delegate } from 'jquery-events-to-dom-events'
delegate('birthday', ['event', 'beast'])
document.addEventListener('$birthday', event =>
  console.log('birthday received as $birthday from DOM', event.detail.beast))
window.$(document).trigger('birthday', 666)
```

## Mutation-First

You've [heard the fuss](https://leastbad.com/mutation-first-development). Now it's time to *get real* about making your code idempotent. If you take pride in the quality of the code you write, [Stimulus](https://stimulusjs.org) makes it easy to structure your logic so that it automatically works with [Turbolinks](https://www.youtube.com/watch?v=SWEts0rlezA&t=214s) and doesn't leak memory when you morph DOM elements out of existence that still have event listeners attached.

Let's start with an HTML fragment that attaches a Stimulus controller called `delegate` to a DIV:

```html
<div data-controller="jquery-to-dom">
  <button data-action="jquery-to-dom#trigger">Trigger jQuery event</button>
</div>
```

That Stimulus controller imports a second function called `abnegate`, which releases your delegated events while your component teardown happens:

```js jquery_to_dom_controller.js
import { Controller } from 'stimulus'
import { delegate, abnegate } from 'jquery-events-to-dom-events'

const eventHandler = () => console.log('jquery received as $jquery from DOM')

export default class extends Controller {
  connect () {
    this.delegate = delegate('jquery')
    document.addEventListener('$jquery', eventHandler)
  }
  disconnect () {
    abnegate('jquery', this.delegate)
    document.removeEventListener('$jquery', eventHandler)
  }
  trigger () {
    window.$(document).trigger('jquery')
  }
}
```

We use Stimulus to wire the click event of the button to call the `triggerjQ` method of the `delegate` controller. You can also call `$(document).trigger('test')` from your Console Inspector without clicking the button.

The important takeaway is that the `delegate` function returns the jQuery event handler, which can be stored as a property of the controller instance. This handler then gets passed back to the `abnegate` function so that jQuery can release its own event listener on elements that might soon be removed from the DOM.

It's only by strictly adhering to good habits around attaching listeners during `connect()` and removing them during `disconnect()` that we can be confident we're releasing references properly. This convention helps us eliminate weird glitches and side-effects that come from blending legacy jQuery components with Turbolinks. They were written for a time when there was a single page load event, and clicks triggered page refresh operations.

Remember: if you define event handlers with anonymous functions passed to a listener, you can't remove them later. Only you can prevent forest fires.

## Sending DOM events to jQuery

It's important to strike a balance between being opinionated and imposing ideological limitations. While this library is definitely intended to act as a bridge to help jQuery developers move to using vanilla JS, at some point I realized that if I don't make it easy to send DOM events *into* jQuery as well, people will choose a library that does.

To capture DOM events inside of your jQuery code, you essentially want to invert all previous instructions. The delegate and abnegate functions accept event names that start with a `$` character, and that tells the library to listen for DOM events and fire them as jQuery events.

```js dom_to_jquery_controller.js
import { Controller } from 'stimulus'
import { delegate, abnegate } from 'jquery-events-to-dom-events'

const eventHandler = (event, detail) =>
  console.log('$wedding received as wedding by jQuery', detail)

export default class extends Controller {
  connect () {
    this.delegate = delegate('$wedding')
    window.$(document).on('wedding', eventHandler)
  }
  disconnect () {
    abnegate('$wedding', this.delegate)
    window.$(document).off('wedding', eventHandler)
  }
  trigger () {
    document.dispatchEvent(
      new CustomEvent('$wedding', { detail: 666 })
    )
  }
}
```

While the syntax is quite similar, there is a significant difference in the way events are passed into a jQuery event. The CustomEvent constructor can take an object as an optional second parameter, and the key in that object must be `detail`. Interestingly, the value of `detail` can be just about anything - such as *666* above - but most frequently, it's an object with key/value pairs in it.

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.