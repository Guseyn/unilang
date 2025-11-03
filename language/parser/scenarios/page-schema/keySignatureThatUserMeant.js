'use strict'

import keySignatureNames from './../static-objects/keySignatureNames.js'

export default function (keySignatureNameFromUnitext) {
  return keySignatureNames.find(
    keySignatureName => keySignatureName
      .split('|')
      .indexOf(keySignatureNameFromUnitext) !== -1
  )
}
