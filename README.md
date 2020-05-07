<h1 align="center">jquery-events-to-dom-events</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/jquery-events-to-dom-events" rel="nofollow">
    <img src="https://badge.fury.io/js/jquery-events-to-dom-events.svg" alt="npm version">
  </a>
</p>

<p align="center">
  <b>Respond to jQuery "events" with DOM event handlers</b></br>
  <sub>Barely a library with just 18 LOC </sub>
</p>

<br />

- **Library Agnostic**: designed for [Stimulus](https://stimulusjs.org) but should works with previous-generation libraries such as React, Angular and Vue by accident
- **Simple**: two functions, one of them optional
- **Mutation-First**: returns an event handler to be released during `disconnect()`
- **Zero Dependencies**: makes clever use of `window.$`
- **Turbolinks**: compatible with Turbolinks lifecycle events
- **MIT Licensed**: free for personal and commercial use

## Built for StimulusJS

This [Stimulus](https://stimulusjs.org/) controller allows you to make any configurations for the image grid directly with data attributes in your HTML. Once registered in your Stimulus application, you can use it anywhere you like.

Here is a simple example:

```html
<div data-controller="image-grid">
  <img src="https://placehold.it/350x300/EEE04A/ffffff">
  <img src="https://placehold.it/420x320/5cb85c/ffffff">
  <img src="https://placehold.it/320x380/5bc0de/ffffff">
  <img src="https://placehold.it/472x500/f0ad4e/ffffff">
  <img src="https://placehold.it/540x360/FF3167/ffffff">
</div>
```
<tiny>Yes, that's really it.</tiny>

### Credit where credit is due

I don't know who wrote the original image-grid.js library. It shipped with a bunch of premium Bootstrap themes, but it relied on jQuery. While stimulus-image-grid is an improvement on the original in several significant ways, the actual meat and potatoes of the algorithm is 100% adapted from the code of a stranger. If you know who wrote [image-grid.js](https://github.com/Pactum/pactum.io/blob/9f2d162bc21f26d62c5d4ba801309bdeb8b9fa9e/v4/js/custom/image-grid.js), please let me know!

## Setup

Note: **stimulus-image-grid requires StimulusJS v2.0+**

*If you are reading this in the past* (Stimulus 2 isn't out yet) you can change your `stimulus` package in `package.json` to point to [this commit](https://github.com/stimulusjs/dev-builds/archive/b8cc8c4/stimulus.tar.gz).

Add image-grid to your main JS entry point or Stimulus controllers root folder:

```js
import { Application } from 'stimulus'
import ImageGrid from 'stimulus-image-grid'

import { definitionsFromContext } from 'stimulus/webpack-helpers'
const application = Application.start()
const context = require.context('../controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

// Manually register ImageGrid as a Stimulus controller
application.register('image-grid', ImageGrid)
```

## HTML Markup

For the image grid to work properly, it needs the raw image dimensions. If you know the dimensions at render time, set the `data-width` and `data-height` attributes. Otherwise, the library will calculate the size when it loads. This is slower and could cause a flicker, but it will only happen once - even across Turbolinks visits.

```html
<div data-controller="image-grid">
  <img data-width="350" data-height="300" src="https://placehold.it/350x300/EEE04A/ffffff">
  <img data-width="420" data-height="320" src="https://placehold.it/420x320/5cb85c/ffffff">
  <img data-width="320" data-height="380" src="https://placehold.it/320x380/5bc0de/ffffff">
  <img data-width="472" data-height="500" src="https://placehold.it/472x500/f0ad4e/ffffff">
  <img data-width="540" data-height="360" src="https://placehold.it/540x360/FF3167/ffffff">
</div>
```

The library tries really hard to not be opinionated about HTML structure. The basic idea is that every child of the container element that has the image-grid controller declared upon it will have [zero or one] image(s), somewhere in its DOM hierarchy. So for example, you could have a scenario where images are wrapped in DIV tags and it will find [zero or one] image(s) in the hierarchy:

```html
<div data-controller="image-grid" class="col-md-6 col-lg-4 col-xl-3">
  <div>
    <img data-width="350" data-height="300" src="https://placehold.it/350x300/EEE04A/ffffff">
  </div>
  <div>
    <img data-width="420" data-height="320" src="https://placehold.it/420x320/5cb85c/ffffff">
  </div>
  <div>
    <img data-width="320" data-height="380" src="https://placehold.it/320x380/5bc0de/ffffff">
  </div>
  <div>
    <img data-width="472" data-height="500" src="https://placehold.it/472x500/f0ad4e/ffffff">
  </div>
  <div>
    <img data-width="540" data-height="360" src="https://placehold.it/540x360/FF3167/ffffff">
  </div>
</div>
```

This library is fully responsive in that it will automatically re-flow the images to the ideal layout in real-time as the container it lives in changes size. If you're using a CSS library such as Bootstrap, this is usually managed with the [responsive breakpoint classes](https://getbootstrap.com/docs/4.4/layout/grid/#grid-options).

## Optional Parameters

There are only three configurable properties, all of which are set on the DOM element using data attributes:

Property | Default Value
-------- | -------------
padding | 10
targetHeight | 150
display | inline-block

```html
<div
  data-controller="image-grid"
  data-image-grid-padding-value="10"
  data-image-grid-target-height-value="150"
  data-image-grid-display-value="inline-block">
  ...
</div>
```

Padding is applied to the bottom of each image as well as the right edge of each image *that isn't the right-most image of its row*. Target height is applied to the row and you can tweak this value to suit the look of your application.

### Obtaining a reference to the Stimulus controller instance

When you place an image-grid controller on a DOM element, it hangs a variable on the element called `imageGrid` which allows you to access the internal state of the controller.

The only method you should ever call directly is `processImages()`, which shouldn't be necessary but I'm not a fucking oracle so I've got your back. Here's an example of forcing a grid re-flow on an element with the id `grid`:

```javascript
document.getElementById('grid').imageGrid.processImages()
```

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.