'use strict'

const articulations = {
  staccato: require('./../articulation/staccato'),
  spiccato: require('./../articulation/spiccato'),
  accent: require('./../articulation/accent'),
  tenuto: require('./../articulation/tenuto'),
  marcato: require('./../articulation/marcato'),
  fermata: require('./../articulation/fermata'),
  leftHandPizzicato: require('./../articulation/leftHandPizzicato'),
  snapPizzicato: require('./../articulation/snapPizzicato'),
  naturalHarmonic: require('./../articulation/naturalHarmonic'),
  upBow: require('./../articulation/upBow'),
  downBow: require('./../articulation/downBow'),
  turn: require('./../articulation/turn'),
  trill: require('./../articulation/trill'),
  mordent: require('./../articulation/mordent'),
  noteLetter: require('./../articulation/noteLetter'),
  dynamicMark: require('./../articulation/dynamicMark'),
  octaveSign: require('./../articulation/octaveSign')
}

const articulationsThatNeedOutline = [ 'staccato', 'tenuto', 'naturalHarmonic', 'snapPizzicato', 'leftHandPizzicato', 'spiccato' ]

const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')
const topOfStaveForFirstNoteInCurrentSingleUnit = require('./../stave/topOfStaveForFirstNoteInCurrentSingleUnit')
const topOfStaveForLastNoteInCurrentSingleUnit = require('./../stave/topOfStaveForLastNoteInCurrentSingleUnit')
const articulationIsAttachedToUnit = require('./../articulation/articulationIsAttachedToUnit')
const outlineForArticulation = require('./../articulation/outlineForArticulation')

module.exports = (drawnVoicesOnPageLine, drawOnlyArticulationsAttachedToUnit, drawnOnlyArticulationsBelowOrAboveStave, dontDrawDynamics, drawOnlyDynamics, styles) => {
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
