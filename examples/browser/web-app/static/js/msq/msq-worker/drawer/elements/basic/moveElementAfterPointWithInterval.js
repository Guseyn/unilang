'use strict'

import moveElement from '/js/msq/msq-worker/drawer/elements/basic/moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    (xPoint - element.left) + interval
  )
}
