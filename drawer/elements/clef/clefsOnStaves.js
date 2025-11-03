'use strict'

import topOffsetForCurrentStave from './../stave/topOffsetForCurrentStave.js'
import stavePiece from './../stave/stavePiece.js'
import group from './../basic/group.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

import treble from './trebleClef.js'
import bass from './bassClef.js'
import alto from './altoClef.js'
import baritone from './baritoneClef.js'
import mezzoSoprano from './mezzoSopranoClef.js'
import octaveEightUp from './octaveEightUpClef.js'
import octaveEightDown from './octaveEightDownClef.js'
import octaveFifteenUp from './octaveFifteenUpClef.js'
import octaveFifteenDown from './octaveFifteenDownClef.js'
import soprano from './sopranoClef.js'
import tenor from './tenorClef.js'

const clefs = {
  treble,
  bass,
  alto,
  baritone,
  mezzoSoprano,
  octaveEightUp,
  octaveEightDown,
  octaveFifteenUp,
  octaveFifteenDown,
  soprano,
  tenor,
}

export default function (numberOfStaves, numberOfStaveLines, clefNames, measureIndexInGeneral) {
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
