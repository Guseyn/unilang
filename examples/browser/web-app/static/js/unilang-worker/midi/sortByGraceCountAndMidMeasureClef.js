'use strict'

export default function (array) {
  return array.sort((first, second) => {
    if (!first.isMidMeasureClef) {
      return +1
    }
    if (!second.isMidMeasureClef) {
      return -1
    }
    if (first.graceCount === undefined) {
      return -1
    }
    if (second.graceCount === undefined) {
      return +1
    }
    return second.graceCount - first.graceCount
  })
}
