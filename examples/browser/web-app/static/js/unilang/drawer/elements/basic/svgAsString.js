'use strict'

import polyline from '#unilang/drawer/elements/basic/polyline.js'

const debugMode = true

const escapeSVGPropertyValueChars = (value) => {
  if (typeof value === 'string') {
    return value.replaceAll('"', '&quot;')
      .replaceAll('\'', '&apos;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('&', '&amp;')
  }
  return value
}

const svgAsString = (element, boxesAsBuffers = [], isFirstCall = true) => {
  const buffer = []
  if (element) {
    if (element.wrapWithBox && debugMode) {
      boxesAsBuffers.push(
        svgAsString(
          polyline([element.left, element.top, element.right, element.top, element.right, element.bottom, element.left, element.bottom, element.left, element.top], { width: 1, color: (typeof element.wrapWithBox === 'string' ? element.wrapWithBox : 'red'), linecap: 'round', linejoin: 'miter' }, false),
          [],
          false
        )
      )
    }
    buffer.push(`<${element.name}`)
    for (const propertyName in element.properties) {
      buffer.push(` ${propertyName}="${escapeSVGPropertyValueChars(element.properties[propertyName])}"`)
      if (propertyName === 'ref-ids') {
        buffer.push(' pointer-events="painted"')
      }
    }
    buffer.push(` data-left="${element.left}"`)
    buffer.push(` data-right="${element.right}"`)
    buffer.push(` data-top="${element.top}"`)
    buffer.push(` data-bottom="${element.bottom}"`)
    if (element.transformations && element.transformations.length > 0) {
      buffer.push(' transform="')
      for (let transformIndex = element.transformations.length - 1; transformIndex >= 0; transformIndex--) {
        const transformation = element.transformations[transformIndex]
        switch (transformation.type) {
          case 'translate': {
            buffer.push(`translate(${transformation.x}, ${transformation.y})`)
            break
          }
          case 'rotate': {
            buffer.push(`rotate(${transformation.angle}, ${transformation.cx || 0}, ${transformation.cy || 0})`)
            break
          }
          case 'scale': {
            buffer.push(`scale(${transformation.x}, ${transformation.y})`)
            break
          }
        }
      }
      buffer.push('"')
    }
    buffer.push('>')
    if (element.elements) {
      for (let index = 0; index < element.elements.length; index++) {
        buffer.push(
          svgAsString(
            element.elements[index],
            boxesAsBuffers,
            false
          )
        )
      }
    }
  }
  if (isFirstCall) {
    boxesAsBuffers.forEach(
      boxAsBuffer => {
        buffer.push(boxAsBuffer)
      }
    )
  }
  buffer.push(`</${element.name}>`)
  return buffer.join('')
}

export default svgAsString
