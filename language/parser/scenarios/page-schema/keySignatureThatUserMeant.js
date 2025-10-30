'use strict'

const keySignatureNames = require('./../static-objects/keySignatureNames')

module.exports = keySignatureNameFromUnitext => keySignatureNames.find(keySignatureName => keySignatureName.split('|').indexOf(keySignatureNameFromUnitext) !== -1)
