'use strict'

import moveElement from '/js/e-unilang/unilang-worker/drawer/elements/basic/moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    -(element.right - xPoint) - interval
  )
}
