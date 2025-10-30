'use strict'

module.exports = (array) => {
  return array.sort((first, second) => {
    if (first.graceCount === undefined) {
      return -1
    }
    if (second.graceCount === undefined) {
      return +1
    }
    return second.graceCount - first.graceCount
  })
}
