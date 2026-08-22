'use strict'

import moveElement from '/js/e-unilang/unilang-worker/drawer/elements/basic/moveElement.js'

export default function (elements, dx = 0, dy = 0) {
  if (dx !== 0 || dy !== 0) {
    if (elements) {
      elements.forEach(element => {
        if (element) {
          moveElement(element, dx, dy)
        }
      })
    }
  }
}
