'use strict'

import moveElement from '/js/e-repertoire/repertoire-worker/drawer/elements/basic/moveElement.js'

export default function (element, xPoint, interval) {
  moveElement(
    element,
    (xPoint - element.left) + interval
  )
}
