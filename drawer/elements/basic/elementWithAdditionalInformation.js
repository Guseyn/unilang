'use strict'

module.exports = (group, additionalInformation) => {
  return { ...group, ...additionalInformation }
}
