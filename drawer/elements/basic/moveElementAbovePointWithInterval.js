'use strict'

import moveElement from './moveElement.js'

export default function (element, yPoint, interval) {
  moveElement(
    element,
    0,
    -(element.bottom - yPoint) - interval
  )
}
