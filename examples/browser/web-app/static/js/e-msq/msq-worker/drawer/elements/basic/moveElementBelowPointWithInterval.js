'use strict'

import moveElement from '/js/e-msq/msq-worker/drawer/elements/basic/moveElement.js'

export default function (element, yPoint, interval) {
  moveElement(
    element,
    0,
    (yPoint - element.top) + interval
  )
}
