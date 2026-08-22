'use strict'

import keySignatureNames from '/js/e-unilang/unilang-worker/language/parser/scenarios/static-objects/keySignatureNames.js'

export default function (keySignatureNameFromUnitext) {
  return keySignatureNames.find(
    keySignatureName => keySignatureName
      .split('|')
      .indexOf(keySignatureNameFromUnitext) !== -1
  )
}
