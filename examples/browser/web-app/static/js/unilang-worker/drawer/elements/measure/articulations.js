'use strict'

import staccato from '/js/unilang-worker/drawer/elements/articulation/staccato.js'
import spiccato from '/js/unilang-worker/drawer/elements/articulation/spiccato.js'
import accent from '/js/unilang-worker/drawer/elements/articulation/accent.js'
import tenuto from '/js/unilang-worker/drawer/elements/articulation/tenuto.js'
import marcato from '/js/unilang-worker/drawer/elements/articulation/marcato.js'
import fermata from '/js/unilang-worker/drawer/elements/articulation/fermata.js'
import leftHandPizzicato from '/js/unilang-worker/drawer/elements/articulation/leftHandPizzicato.js'
import snapPizzicato from '/js/unilang-worker/drawer/elements/articulation/snapPizzicato.js'
import naturalHarmonic from '/js/unilang-worker/drawer/elements/articulation/naturalHarmonic.js'
import upBow from '/js/unilang-worker/drawer/elements/articulation/upBow.js'
import downBow from '/js/unilang-worker/drawer/elements/articulation/downBow.js'
import turn from '/js/unilang-worker/drawer/elements/articulation/turn.js'
import trill from '/js/unilang-worker/drawer/elements/articulation/trill.js'
import mordent from '/js/unilang-worker/drawer/elements/articulation/mordent.js'
import noteLetter from '/js/unilang-worker/drawer/elements/articulation/noteLetter.js'
import dynamicMark from '/js/unilang-worker/drawer/elements/articulation/dynamicMark.js'
import octaveSign from '/js/unilang-worker/drawer/elements/articulation/octaveSign.js'

const articulations = {
  staccato,
  spiccato,
  accent,
  tenuto,
  marcato,
  fermata,
  leftHandPizzicato,
  snapPizzicato,
  naturalHarmonic,
  upBow,
  downBow,
  turn,
  trill,
  mordent,
  noteLetter,
  dynamicMark,
  octaveSign
}

const articulationsThatNeedOutline = [ 'staccato', 'tenuto', 'naturalHarmonic', 'snapPizzicato', 'leftHandPizzicato', 'spiccato' ]

import group from '/js/unilang-worker/drawer/elements/basic/group.js'
import moveElement from '/js/unilang-worker/drawer/elements/basic/moveElement.js'
import scaleElementAroundPoint from '/js/unilang-worker/drawer/elements/basic/scaleElementAroundPoint.js'
import addPropertiesToElement from '/js/unilang-worker/drawer/elements/basic/addPropertiesToElement.js'
import topOfStaveForFirstNoteInCurrentSingleUnit from '/js/unilang-worker/drawer/elements/stave/topOfStaveForFirstNoteInCurrentSingleUnit.js'
import topOfStaveForLastNoteInCurrentSingleUnit from '/js/unilang-worker/drawer/elements/stave/topOfStaveForLastNoteInCurrentSingleUnit.js'
import articulationIsAttachedToUnit from '/js/unilang-worker/drawer/elements/articulation/articulationIsAttachedToUnit.js'
import outlineForArticulation from '/js/unilang-worker/drawer/elements/articulation/outlineForArticulation.js'

export default function (drawnVoicesOnPageLine, drawOnlyArticulationsAttachedToUnit, drawnOnlyArticulationsBelowOrAboveStave, dontDrawDynamics, drawOnlyDynamics, styles) {
  const { intervalBetweenStaveLines, graceElementsScaleFactor } = styles
  const drawnArticulations = []
  for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
    if (drawnVoicesOnPageLine[measureIndex]) {
      const { drawnSingleUnitsInVoices, topOffsetsForEachStave, numberOfStaveLines, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
      if (!withoutVoices) {
        for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
          if (drawnSingleUnitsInVoices[staveIndex]) {
            for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
              if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                  const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                  const nextSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex + 1]
                  for (let articulationIndex = 0; articulationIndex < currentSingleUnit.articulationParams.length; articulationIndex++) {
                    const currentArticulationParams = currentSingleUnit.articulationParams[articulationIndex]
                    const currentArticulationIsAttachedToUnit = articulationIsAttachedToUnit(currentArticulationParams)
                    if (
                      (drawOnlyArticulationsAttachedToUnit && currentArticulationIsAttachedToUnit) ||
                      (drawnOnlyArticulationsBelowOrAboveStave && !currentArticulationIsAttachedToUnit)
                    ) {
                      if (!currentArticulationParams.direction) {
                        currentArticulationParams.direction = 'up'
                      }
                      if (articulations[currentArticulationParams.name] && ((dontDrawDynamics && (currentArticulationParams.name !== 'dynamicMark')) || (drawOnlyDynamics && (currentArticulationParams.name === 'dynamicMark')))) {
                        const calculatedTopOfStaveForFirstNoteInCurrentSingleUnit = topOfStaveForFirstNoteInCurrentSingleUnit(staveIndex, currentSingleUnit, topOffsetsForEachStave)
                        const calculatedTopOfStaveForLastNoteInCurrentSingleUnit = topOfStaveForLastNoteInCurrentSingleUnit(staveIndex, currentSingleUnit, topOffsetsForEachStave)
                        const calculatedBottomOfStaveForLastNoteInCurrentSingleUnit = calculatedTopOfStaveForLastNoteInCurrentSingleUnit + (numberOfStaveLines - 1) * (intervalBetweenStaveLines)
                        const drawnArticulation = currentArticulationParams.name === 'trill'
                          ? articulations[currentArticulationParams.name](currentSingleUnit, articulationIndex, nextSingleUnit, currentArticulationParams, calculatedTopOfStaveForFirstNoteInCurrentSingleUnit, calculatedBottomOfStaveForLastNoteInCurrentSingleUnit, styles)
                          : articulations[currentArticulationParams.name](currentSingleUnit, articulationIndex, currentArticulationParams, calculatedTopOfStaveForFirstNoteInCurrentSingleUnit, calculatedBottomOfStaveForLastNoteInCurrentSingleUnit, styles)
                        addPropertiesToElement(
                          drawnArticulation,
                          {
                            'ref-ids': `articulation-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}-${articulationIndex + 1}`
                          }
                        )
                        moveElement(
                          drawnArticulation,
                          0, (currentArticulationParams.yCorrection || 0) * intervalBetweenStaveLines
                        )
                        if (currentArticulationParams.isGrace) {
                          scaleElementAroundPoint(
                            drawnArticulation,
                            graceElementsScaleFactor,
                            graceElementsScaleFactor,
                            {
                              x: (drawnArticulation.left + drawnArticulation.right) / 2,
                              y: (currentArticulationParams.direction === 'up' || !currentArticulationParams.direction)
                                ? drawnArticulation.bottom
                                : drawnArticulation.top
                            }
                          )
                        }
                        const articulationComponents = []
                        if (articulationsThatNeedOutline.indexOf(currentArticulationParams.name) !== -1) {
                          articulationComponents.push(
                            outlineForArticulation(drawnArticulation, styles)
                          )
                        }
                        articulationComponents.push(drawnArticulation)
                        const drawnArticulationWithOutline = group(
                          currentArticulationParams.name,
                          articulationComponents
                        )
                        drawnArticulations.push(
                          drawnArticulationWithOutline
                        )
                        if (currentArticulationParams.direction === 'up' || !currentArticulationParams.direction) {
                          currentSingleUnit.top = Math.min(currentSingleUnit.top - styles.articulationYAdditionalOffset * (currentArticulationParams.isGrace ? graceElementsScaleFactor : 1), drawnArticulation.top - styles.articulationYAdditionalOffset * (currentArticulationParams.isGrace ? graceElementsScaleFactor : 1))
                        } else if (currentArticulationParams.direction === 'down') {
                          currentSingleUnit.bottom = Math.max(currentSingleUnit.bottom + styles.articulationYAdditionalOffset * (currentArticulationParams.isGrace ? graceElementsScaleFactor : 1), drawnArticulation.bottom + styles.articulationYAdditionalOffset * (currentArticulationParams.isGrace ? graceElementsScaleFactor : 1))
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return drawnArticulations
}
