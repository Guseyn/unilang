'use strict'

import topOffsetForCurrentStave from '#msq/drawer/elements/stave/topOffsetForCurrentStave.js'
import stavePiece from '#msq/drawer/elements/stave/stavePiece.js'
import group from '#msq/drawer/elements/basic/group.js'
import addPropertiesToElement from '#msq/drawer/elements/basic/addPropertiesToElement.js'

import treble from '#msq/drawer/elements/clef/trebleClef.js'
import bass from '#msq/drawer/elements/clef/bassClef.js'
import alto from '#msq/drawer/elements/clef/altoClef.js'
import baritone from '#msq/drawer/elements/clef/baritoneClef.js'
import mezzoSoprano from '#msq/drawer/elements/clef/mezzoSopranoClef.js'
import octaveEightUp from '#msq/drawer/elements/clef/octaveEightUpClef.js'
import octaveEightDown from '#msq/drawer/elements/clef/octaveEightDownClef.js'
import octaveFifteenUp from '#msq/drawer/elements/clef/octaveFifteenUpClef.js'
import octaveFifteenDown from '#msq/drawer/elements/clef/octaveFifteenDownClef.js'
import soprano from '#msq/drawer/elements/clef/sopranoClef.js'
import tenor from '#msq/drawer/elements/clef/tenorClef.js'

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
