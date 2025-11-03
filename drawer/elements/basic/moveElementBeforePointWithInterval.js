'use strict'

import moveElement from './moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    -(element.right - xPoint) - interval
  )
}
