'use strict'

/* API

const videoLightning = require('video-lightning')

videoLightning([elements Array], {options})

WHAT IT SHOULD DO:
- take global options
- take HTMLElement(s)
- take options specific to element(s)
- for each element do the following
  - wrap element in `.vl-video-target` with optional tag type (default `span`)
  - insert sibling el `.vl-video-wrapper` with optional tag type (default `div`)
  - apply styling to `.vl-video-wrapper` as specified in options
  - insert `.vl-video-frame` as child of `.vl-video-wrapper`
  - apply styling to `.vl-video-frame` as specified in options
  - insert `.vl-video` as child of `.vl-video-frame`
  - insert `.vl-video-close` as child of `.vl-video`
  - apply styling to `.vl-video-close` as specified in options
  - insert `.vl-video-iframe` as child of `.vl-video`
  - initialize `.vl-video-iframe` with supplied YT or Vimeo video options
- return array of elements to include the following properties
  - HTMLElement
  - options applied
  - setters to change options on the returned element
  - event emitter to expose actions like `opened` and `closed`

POSSIBILE IMPROVEMENTS
- figure out a way to make it inherently virtual dom compatible
  - no idea how to do this, I use snabbdom but would want to support React too
- have a single set of vl elements that are re-attached to each link on demand
  - this would eliminate loading a bunch of els and videos needlessly
  - would be much more efficent
  - would increase latency on opening videos
  - would make videos reload if another was opened, losing current position
  - maybe we could store position when closed and reload at position on re-open

*/

// setup

// helpers
// const getEls = (elements) => {
//   let allEls = []
//   elements.forEach((el) => {
//     let elObj = el
//     let els
//     if (el.constructor === Object) {}
//     if (typeof el === 'string') els = Array.from(document.querySelectorAll(el))
//     if (el instanceof window.HTMLCollection || el instanceof window.NodeList) {
//       els = Array.from(el)
//     }
//   })
// }

// main export
module.exports = async ({element, elements = [], settings = {}} = {}) => {
  if (element) elements.push(element)
  return Promise.resolve(elements)
}
