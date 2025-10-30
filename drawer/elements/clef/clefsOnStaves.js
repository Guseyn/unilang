'use strict'

const topOffsetForCurrentStave = require('./../stave/topOffsetForCurrentStave')
const stavePiece = require('./../stave/stavePiece')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

const clefs = {
  treble: require('./trebleClef'),
  bass: require('./bassClef'),
  alto: require('./altoClef'),
  baritone: require('./baritoneClef'),
  mezzoSoprano: require('./mezzoSopranoClef'),
  octaveEightUp: require('./octaveEightUpClef'),
  octaveEightDown: require('./octaveEightDownClef'),
  octaveFifteenUp: require('./octaveFifteenUpClef'),
  octaveFifteenDown: require('./octaveFifteenDownClef'),
  soprano: require('./sopranoClef'),
  tenor: require('./tenorClef')
}

module.exports = (numberOfStaves, numberOfStaveLines, clefNames, measureIndexInGeneral) => {
  return (styles, leftOffset, topOffset) => {
    const { intervalBetweenStaves, intervalBetweenStaveLines, stavePieceWidthForClef } = styles
    const clefsOnStaves = []
    const thereIsAtLeastOneClef = clefNames.some(clefName => clefs[clefName])
    for (let staveIndex = 0; staveIndex < numberOfStaves; staveIndex++) {
      const calculatedTopOffsetForCurrentStave = topOffsetForCurrentStave(topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines)
      const clefName = clefNames[staveIndex]
      if (clefs[clefName]) {
        const drawnClef = clefs[clefName]()(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        addPropertiesToElement(
          drawnClef,
          {
            'ref-ids': `clef-${measureIndexInGeneral + 1}-${staveIndex + 1}`
          }
        )
        clefsOnStaves.push(drawnClef)
      } else {
        clefsOnStaves.push(
          stavePiece(numberOfStaveLines, thereIsAtLeastOneClef ? stavePieceWidthForClef : 0)(styles, leftOffset, calculatedTopOffsetForCurrentStave)
        )
      }
    }
    return group(
      'clefsOnStaves',
      clefsOnStaves
    )
  }
}
