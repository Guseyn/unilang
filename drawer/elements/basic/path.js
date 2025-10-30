'use strict'

const bboxForPath = require('./bboxForPath')

module.exports = (points, strokeOptions, fill = true, leftOffset = 0, topOffset = 0) => {
  const areAnyNaNPoints = points.some(point => isNaN(point) && typeof point !== 'string')
  if (areAnyNaNPoints) {
    throw new Error(`there are NaN points in path ${points}`)
  }
  const path = points.join(' ')
  const { minTop, minLeft, maxRight, maxBottom } = bboxForPath(path)
  const top = minTop + topOffset
  const right = maxRight + leftOffset
  const bottom = maxBottom + topOffset
  const left = minLeft + leftOffset
  // const box = `<polyline points="${left} ${top} ${right} ${top} ${right} ${bottom} ${left} ${bottom} ${left} ${top}" fill="none" stroke-width="1.0" stroke="red"></polyline>`
  const properties = {
    'd': path,
    'fill': fill || 'none',
    'fill-rule': 'evenodd',
    'vector-effect': 'none'
  }
  if (strokeOptions) {
    properties['fill'] = fill ? strokeOptions.color : 'none'
    properties['stroke'] = strokeOptions.color || ''
    properties['stroke-width'] = strokeOptions.width
    properties['stroke-linejoin'] = strokeOptions.linejoin || ''
    properties['stroke-linecap'] = strokeOptions.linecap || ''
  }
  return {
    name: 'path',
    properties,
    transformations: (leftOffset !== 0 || topOffset !== 0)
      ? [
        {
          type: 'translate',
          x: leftOffset,
          y: topOffset
        }
      ]
      : [],
    top,
    right,
    bottom,
    left
  }
}
