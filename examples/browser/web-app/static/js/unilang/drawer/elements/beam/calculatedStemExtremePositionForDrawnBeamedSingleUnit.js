'use strict'

export default function (drawnSingleUnit, beamLineCoefficients) {
  let drawnSingleUnitStemEnd = drawnSingleUnit.stemLeft * beamLineCoefficients.gradient + beamLineCoefficients.topIntercept
  if (drawnSingleUnit.stemDirection === 'up') {
    if (drawnSingleUnitStemEnd > drawnSingleUnit.stemTop) {
      drawnSingleUnitStemEnd = drawnSingleUnit.stemTop
    }
  } else {
    if (drawnSingleUnitStemEnd < drawnSingleUnit.stemBottom) {
      drawnSingleUnitStemEnd = drawnSingleUnit.stemBottom
    }
  }
  return drawnSingleUnitStemEnd
}
