'use strict'

import moveElement from './moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    (xPoint - element.left) + interval
  )
}
