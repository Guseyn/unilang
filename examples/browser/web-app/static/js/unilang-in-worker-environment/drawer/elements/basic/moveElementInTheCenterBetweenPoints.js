'use strict'

import moveElement from '/js/unilang-in-worker-environment/drawer/elements/basic/moveElement.js'

export default function (element, leftPoint, rightPoint) {
  const elementCenter = (element.right + element.left) / 2
  const centerPointBetweenLeftAndRightPoints = (leftPoint + rightPoint) / 2
  moveElement(
    element,
    centerPointBetweenLeftAndRightPoints - elementCenter
  )
}
