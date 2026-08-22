'use strict'

import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'

export default function (element, yPoint, interval) {
  moveElement(
    element,
    0,
    (yPoint - element.top) + interval
  )
}
