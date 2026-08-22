'use strict'

import moveElement from '/js/e-unilang/unilang-worker/drawer/elements/basic/moveElement.js'

export default function (element, leftPoint, rightPoint) {
  const elementCenter = (element.right + element.left) / 2
  const centerPointBetweenLeftAndRightPoints = (leftPoint + rightPoint) / 2
  moveElement(
    element,
    centerPointBetweenLeftAndRightPoints - elementCenter
  )
}
