'use strict'

export default function (element, properties) {
  for (const propertyName in properties) {
    const propertyValue = properties[propertyName]
    element.properties = element.properties || {}
    if (propertyName === 'ref-ids' && element.properties[propertyName]) {
      element.properties[propertyName] += `,${propertyValue}`
    } else {
      element.properties[propertyName] = propertyValue
    }
  }
}
