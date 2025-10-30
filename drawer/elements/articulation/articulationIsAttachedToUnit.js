'use strict'

const notAttachedArticulations = [
  'dynamicMark',
  'octaveSign',
  'turn',
  'trill'
]

module.exports = (articulationParams) => {
  if (notAttachedArticulations.indexOf(articulationParams.name) !== -1) {
    return false
  }
  if (articulationParams.aboveBelowOverUnderStaveLines) {
    return false
  }
  return true
}
