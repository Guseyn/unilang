'use strict'

const correctedStaveIndexOfNoteOrKey = require('./correctedStaveIndexOfNoteOrKey')

const compareTwoKeys = (key1, key2) => {
  const staveIndex1 = correctedStaveIndexOfNoteOrKey(key1)
  const staveIndex2 = correctedStaveIndexOfNoteOrKey(key2)
  if (staveIndex1 < staveIndex2) {
    return -1
  }
  if (staveIndex1 > staveIndex2) {
    return +1
  }
  if (key1.keyType === 'noteLetter' && key2.keyType !== 'noteLetter') {
    return +1
  }
  if (key2.keyType === 'noteLetter' && key1.keyType !== 'noteLetter') {
    return -1
  }
  return key1.positionNumber - key2.positionNumber
}

module.exports = (keys) => {
  return keys.slice(0).sort((key1, key2) => compareTwoKeys(key1, key2))
}
