'use strict'

export default function (drawnArticulation, styles) {
  const { backgroundColor, articulationOutlinePadding, articulationOutlineRadius } = styles
  const outline = {
    name: 'rect',
    properties: {
      'data-name': 'outline',
      'fill': backgroundColor,
      'width': drawnArticulation.right - drawnArticulation.left + 2 * articulationOutlinePadding,
      'height': drawnArticulation.bottom - drawnArticulation.top + 2 * articulationOutlinePadding,
      'rx': articulationOutlineRadius
    },
    transformations: [
      {
        type: 'translate',
        x: drawnArticulation.left - articulationOutlinePadding,
        y: drawnArticulation.top - articulationOutlinePadding
      }
    ],
    top: drawnArticulation.top - articulationOutlinePadding,
    right: drawnArticulation.right + articulationOutlinePadding,
    bottom: drawnArticulation.bottom + articulationOutlinePadding,
    left: drawnArticulation.left - articulationOutlinePadding
  }
  return outline
}
