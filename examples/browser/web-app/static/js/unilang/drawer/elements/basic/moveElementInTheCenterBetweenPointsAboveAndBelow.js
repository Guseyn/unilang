'use strict'

import moveElement from '#unilang/drawer/elements/basic/moveElement.js'

export default function (element, topPoint, bottomPoint) {
  const elementCenter = (element.bottom + element.top) / 2
  const centerPointBetweenTopAndBottomPoints = (topPoint + bottomPoint) / 2
  moveElement(
    element,
    0,
    centerPointBetweenTopAndBottomPoints - elementCenter
  )
}
