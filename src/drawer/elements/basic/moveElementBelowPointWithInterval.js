'use strict'

import moveElement from '#msq/drawer/elements/basic/moveElement.js'

export default function (element, yPoint, interval) {
  moveElement(
    element,
    0,
    (yPoint - element.top) + interval
  )
}
