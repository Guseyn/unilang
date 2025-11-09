'use strict'

import moveElement from '#unilang/drawer/elements/basic/moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    -(element.right - xPoint) - interval
  )
}
