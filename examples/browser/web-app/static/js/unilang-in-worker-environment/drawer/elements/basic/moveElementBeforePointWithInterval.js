'use strict'

import moveElement from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    -(element.right - xPoint) - interval
  )
}
