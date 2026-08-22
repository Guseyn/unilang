'use strict'

import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'

export default function (element, yPoint, interval) {
  moveElement(
    element,
    0,
    -(element.bottom - yPoint) - interval
  )
}
