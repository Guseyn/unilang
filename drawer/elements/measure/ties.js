'use strict'

import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'
import tieShape from '#unilang/drawer/elements/tie-and-slur/tieShape.js'
import tieDirection from '#unilang/drawer/elements/tie-and-slur/tieDirection.js'
import tieJunctionPoint from '#unilang/drawer/elements/tie-and-slur/tieJunctionPoint.js'
const keyForTie = (staveIndex, voiceIndex) => {
  return `${staveIndex}-${voiceIndex}`
}
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'

export default function (drawnVoicesOnPageLine, voicesBodiesOnPageLine, styles) {
  const drawndTies = []
  const tiesStack = {}
  for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
    if (drawnVoicesOnPageLine[measureIndex]) {
      const { measureIndexOnPageLine, numberOfStaveLines, drawnSingleUnitsInVoices, topOffsetsForEachStave, voicesBody, isOnLastMeasureInGeneral, withoutVoices } = drawnVoicesOnPageLine[measureIndex]
      if (!withoutVoices) {
        for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
          if (drawnSingleUnitsInVoices[staveIndex]) {
            for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
              if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                  const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                  const generatedKeyForTie = keyForTie(staveIndex, voiceIndex)
                  if (tiesStack[generatedKeyForTie]) {
                    tiesStack[generatedKeyForTie].rightSingleUnit = currentSingleUnit
                    for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                      const currentNotePositionNumberInRightSingleUnitOfTie = currentSingleUnit.sortedNotes[tieJunctionPointIndex].positionNumber
                      const currentStaveInRightSingleUnitOfTie = currentSingleUnit.sortedNotes[tieJunctionPointIndex].stave
                      const correspondingTieJunctionPointIndexWithCurrentNotePositionNumberInLeftSingleUnit = tiesStack[generatedKeyForTie].leftJunctionPoints.findIndex(leftJunctionPoint => leftJunctionPoint.notePositionNumber === currentNotePositionNumberInRightSingleUnitOfTie && leftJunctionPoint.stave === currentStaveInRightSingleUnitOfTie)
                      const correspondingLeftTieJunctionPoint = tiesStack[generatedKeyForTie].leftJunctionPoints[correspondingTieJunctionPointIndexWithCurrentNotePositionNumberInLeftSingleUnit]
                      const rightTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'right', correspondingLeftTieJunctionPoint, styles)
                      if (correspondingLeftTieJunctionPoint) {
                        const determinedTieDirection = tieDirection(correspondingLeftTieJunctionPoint, rightTieJunctionPoint)
                        const drawndTie = tieShape(
                          correspondingLeftTieJunctionPoint.xPosition,
                          correspondingLeftTieJunctionPoint.yPosition,
                          rightTieJunctionPoint.xPosition,
                          rightTieJunctionPoint.yPosition,
                          determinedTieDirection,
                          tiesStack[generatedKeyForTie].leftSingleUnit,
                          tiesStack[generatedKeyForTie].rightSingleUnit,
                          tiesStack[generatedKeyForTie].roundCoefficientFactor,
                          styles
                        )
                        addPropertiesToElement(
                          drawndTie,
                          {
                            'ref-ids': `tie-${correspondingLeftTieJunctionPoint.singleUnit.measureIndexInGeneral + 1}-${correspondingLeftTieJunctionPoint.singleUnit.staveIndex + 1}-${correspondingLeftTieJunctionPoint.singleUnit.voiceIndex + 1}-${correspondingLeftTieJunctionPoint.singleUnit.singleUnitIndex + 1}`
                          }
                        )
                        addPropertiesToElement(
                          rightTieJunctionPoint.singleUnit,
                          {
                            'ref-ids': `next-to-unit-under-tie-${correspondingLeftTieJunctionPoint.singleUnit.measureIndexInGeneral + 1}-${correspondingLeftTieJunctionPoint.singleUnit.staveIndex + 1}-${correspondingLeftTieJunctionPoint.singleUnit.voiceIndex + 1}-${correspondingLeftTieJunctionPoint.singleUnit.singleUnitIndex + 1}`
                          }
                        )
                        drawndTies.push(drawndTie)
                        if (!correspondingLeftTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                          moveElement(
                            drawndTie,
                            0,
                            determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                          )
                        }
                        tiesStack[generatedKeyForTie].leftJunctionPoints.splice(correspondingTieJunctionPointIndexWithCurrentNotePositionNumberInLeftSingleUnit, 1)
                        const theCaseWhenNothingIsLeftWeNeedToCleanItUpSoThatWeCanImmediatelyCreateNewTiesWithNewSetup = tiesStack[generatedKeyForTie].leftJunctionPoints.length === 0
                        if (theCaseWhenNothingIsLeftWeNeedToCleanItUpSoThatWeCanImmediatelyCreateNewTiesWithNewSetup) {
                          delete tiesStack[generatedKeyForTie]
                        }
                      }
                    }
                  }
                  if (currentSingleUnit.tiedWithNext) {
                    if (!tiesStack[generatedKeyForTie]) {
                      tiesStack[generatedKeyForTie] = {
                        staveIndex: staveIndex,
                        voiceIndex: voiceIndex,
                        leftJunctionPoints: [],
                        leftSingleUnit: currentSingleUnit,
                        roundCoefficientFactor: currentSingleUnit.tiedWithNext.roundCoefficientFactor
                      }
                    }
                    if (currentSingleUnit.sortedNotesPositionNumbers.length > 0) {
                      for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                        const leftTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'left', null, styles)
                        const leftTieJunctionPointIndex = tiesStack[generatedKeyForTie].leftJunctionPoints.findIndex(existingLeftJunctionPoint => existingLeftJunctionPoint.notePositionNumber === leftTieJunctionPoint.notePositionNumber && existingLeftJunctionPoint.stave === leftTieJunctionPoint.stave)
                        if (leftTieJunctionPointIndex === -1) {
                          tiesStack[generatedKeyForTie].leftJunctionPoints.push(leftTieJunctionPoint)
                        }
                      }
                    }
                  }
                  if (tiesStack[generatedKeyForTie]) {
                    if (singleUnitIndex === drawnSingleUnitsInVoices[staveIndex][voiceIndex].length - 1 && (currentSingleUnit.isOnLastMeasureOfPageLine || isOnLastMeasureInGeneral) && tiesStack[generatedKeyForTie].leftJunctionPoints.length > 0) {
                      for (let remainedLeftJunctionPointIndex = 0; remainedLeftJunctionPointIndex < tiesStack[generatedKeyForTie].leftJunctionPoints.length; remainedLeftJunctionPointIndex++) {
                        const leftTieJunctionPoint = tiesStack[generatedKeyForTie].leftJunctionPoints[remainedLeftJunctionPointIndex]
                        const determinedTieDirection = tieDirection(leftTieJunctionPoint, null)
                        const drawnTie = tieShape(
                          leftTieJunctionPoint.xPosition,
                          leftTieJunctionPoint.yPosition,
                          voicesBody.right,
                          leftTieJunctionPoint.yPosition,
                          determinedTieDirection,
                          currentSingleUnit,
                          null,
                          tiesStack[generatedKeyForTie].roundCoefficientFactor,
                          styles
                        )
                        addPropertiesToElement(
                          drawnTie,
                          {
                            'ref-ids': `tie-${leftTieJunctionPoint.singleUnit.measureIndexInGeneral + 1}-${leftTieJunctionPoint.singleUnit.staveIndex + 1}-${leftTieJunctionPoint.singleUnit.voiceIndex + 1}-${leftTieJunctionPoint.singleUnit.singleUnitIndex + 1}`
                          }
                        )
                        if (!leftTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                          moveElement(
                            drawnTie,
                            0,
                            determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                          )
                        }
                        drawndTies.push(drawnTie)
                      }
                      tiesStack[generatedKeyForTie].leftJunctionPoints = []
                    }
                    if (tiesStack[generatedKeyForTie].leftJunctionPoints.length === 0) {
                      delete tiesStack[generatedKeyForTie]
                    }
                  }
                  if (currentSingleUnit.tiedBefore) {
                    for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                      const rightTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'right', null, styles)
                      const determinedTieDirection = tieDirection(null, rightTieJunctionPoint)
                      const drawndTie = tieShape(
                        voicesBody.left + styles.leftMarginForConnectionsThatStartBefore,
                        rightTieJunctionPoint.yPosition,
                        rightTieJunctionPoint.xPosition,
                        rightTieJunctionPoint.yPosition,
                        determinedTieDirection,
                        null,
                        currentSingleUnit,
                        currentSingleUnit.tiedBefore.roundCoefficientFactor,
                        styles
                      )
                      addPropertiesToElement(
                        drawndTie,
                        {
                          'ref-ids': `tie-before-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                        }
                      )
                      if (!rightTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                        moveElement(
                          drawndTie,
                          0,
                          determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                        )
                      }
                      drawndTies.push(drawndTie)
                    }
                  }
                  if (currentSingleUnit.tiedAfter) {
                    for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                      const leftTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'left', null, styles)
                      const determinedTieDirection = tieDirection(leftTieJunctionPoint, null)
                      const drawndTie = tieShape(
                        leftTieJunctionPoint.xPosition,
                        leftTieJunctionPoint.yPosition,
                        voicesBody.right,
                        leftTieJunctionPoint.yPosition,
                        determinedTieDirection,
                        currentSingleUnit,
                        null,
                        currentSingleUnit.tiedAfter.roundCoefficientFactor,
                        styles
                      )
                      addPropertiesToElement(
                        drawndTie,
                        {
                          'ref-ids': `tie-after-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                        }
                      )
                      if (!leftTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                        moveElement(
                          drawndTie,
                          0,
                          determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                        )
                      }
                      drawndTies.push(drawndTie)
                    }
                  }
                  if (currentSingleUnit.tiedBeforeMeasure) {
                    let measureIndexThatTieStartsBefore = (currentSingleUnit.tiedBeforeMeasure.index || 1) - 1
                    if (isNaN(measureIndexThatTieStartsBefore)) {
                      measureIndexThatTieStartsBefore = measureIndexOnPageLine
                    }
                    for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                      const rightTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'right', null, styles)
                      const determinedTieDirection = tieDirection(null, rightTieJunctionPoint)
                      const drawndTie = tieShape(
                        ((voicesBodiesOnPageLine[measureIndexThatTieStartsBefore] !== undefined && !voicesBodiesOnPageLine[measureIndexThatTieStartsBefore].isEmpty) ? (voicesBodiesOnPageLine[measureIndexThatTieStartsBefore].left + styles.leftMarginForConnectionsThatStartBefore) : (voicesBody.left + styles.leftMarginForConnectionsThatStartBefore)),
                        rightTieJunctionPoint.yPosition,
                        rightTieJunctionPoint.xPosition,
                        rightTieJunctionPoint.yPosition,
                        determinedTieDirection,
                        null,
                        currentSingleUnit,
                        currentSingleUnit.tiedBeforeMeasure.roundCoefficientFactor,
                        styles
                      )
                      addPropertiesToElement(
                        drawndTie,
                        {
                          'ref-ids': `tie-before-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                        }
                      )
                      if (!rightTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                        moveElement(
                          drawndTie,
                          0,
                          determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                        )
                      }
                      drawndTies.push(drawndTie)
                    }
                  }
                  if (currentSingleUnit.tiedAfterMeasure) {
                    let measureIndexThatTieFinishesAfter = (currentSingleUnit.tiedAfterMeasure.index || 1) - 1
                    if (isNaN(measureIndexThatTieFinishesAfter)) {
                      measureIndexThatTieFinishesAfter = measureIndexOnPageLine
                    }
                    for (let tieJunctionPointIndex = 0; tieJunctionPointIndex < currentSingleUnit.sortedNotes.length; tieJunctionPointIndex++) {
                      const leftTieJunctionPoint = tieJunctionPoint(currentSingleUnit, topOffsetsForEachStave, staveIndex, tieJunctionPointIndex, numberOfStaveLines, 'left', null, styles)
                      const determinedTieDirection = tieDirection(leftTieJunctionPoint, null)
                      const drawndTie = tieShape(
                        leftTieJunctionPoint.xPosition,
                        leftTieJunctionPoint.yPosition,
                        ((voicesBodiesOnPageLine[measureIndexThatTieFinishesAfter] !== undefined && !voicesBodiesOnPageLine[measureIndexThatTieFinishesAfter].isEmpty) ? (voicesBodiesOnPageLine[measureIndexThatTieFinishesAfter].right) : (voicesBody.right)),
                        leftTieJunctionPoint.yPosition,
                        determinedTieDirection,
                        currentSingleUnit,
                        null,
                        currentSingleUnit.tiedAfterMeasure.roundCoefficientFactor,
                        styles
                      )
                      addPropertiesToElement(
                        drawndTie,
                        {
                          'ref-ids': `tie-after-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
                        }
                      )
                      if (!leftTieJunctionPoint.tiedFromTopOrBottomOfNote) {
                        moveElement(
                          drawndTie,
                          0,
                          determinedTieDirection === 'up' ? -styles.tieJunctionPointInMiddleYOffset : +styles.tieJunctionPointInMiddleYOffset
                        )
                      }
                      drawndTies.push(drawndTie)
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
  return drawndTies
}
