'use strict'

import tupletShape from './../tuplet/tupletShape.js'
import topOfStaveForFirstNoteInCurrentSingleUnit from './../stave/topOfStaveForFirstNoteInCurrentSingleUnit.js'
import topOfStaveForLastNoteInCurrentSingleUnit from './../stave/topOfStaveForLastNoteInCurrentSingleUnit.js'

const keyForTupletStack = (staveIndex, voiceIndex) => {
  return `${staveIndex}-${voiceIndex}`
}

const allLeftPointsWithTupletDirectionOfTupletsWithLevelLowerThanOrEqualToSpecifiedOneAreFinished = (leftPointsOfTuplets, tupletDirection, tupletLevel) => leftPointsOfTuplets
  .filter(leftTupletPoint => (leftTupletPoint.tupletDirection === tupletDirection) && ((leftTupletPoint.level <= tupletLevel) || leftTupletPoint.finished))
  .every(leftTupletPoint => leftTupletPoint.finished)

export default function (drawnVoicesOnPageLine, voicesBodiesOnPageLine, styles) {
  const { intervalBetweenStaveLines, tupletNestedVerticalGradient, topOffsetOfTupletWithLevelZero } = styles
  const drawnTuplets = []
  const tupletsStack = {}
  let yByKeyForTupletStackAndDirectionAndLevel = {}
  if (drawnVoicesOnPageLine) {
    for (let measureIndex = 0; measureIndex < drawnVoicesOnPageLine.length; measureIndex++) {
      if (drawnVoicesOnPageLine[measureIndex]) {
        const { drawnSingleUnitsInVoices, voicesBody, withoutVoices, topOffsetsForEachStave, numberOfStaveLines } = drawnVoicesOnPageLine[measureIndex]
        if (!withoutVoices) {
          for (let staveIndex = 0; staveIndex < drawnSingleUnitsInVoices.length; staveIndex++) {
            if (drawnSingleUnitsInVoices[staveIndex]) {
              for (let voiceIndex = 0; voiceIndex < drawnSingleUnitsInVoices[staveIndex].length; voiceIndex++) {
                if (drawnSingleUnitsInVoices[staveIndex][voiceIndex]) {
                  for (let singleUnitIndex = 0; singleUnitIndex < drawnSingleUnitsInVoices[staveIndex][voiceIndex].length; singleUnitIndex++) {
                    const currentSingleUnit = drawnSingleUnitsInVoices[staveIndex][voiceIndex][singleUnitIndex]
                    const generatedKeyForTupletStack = keyForTupletStack(staveIndex, voiceIndex)
                    if (currentSingleUnit.tupletMarks) {
                      for (let tupletMarkIndex = 0; tupletMarkIndex < currentSingleUnit.tupletMarks.length; tupletMarkIndex++) {
                        const currentTupletMark = currentSingleUnit.tupletMarks[tupletMarkIndex]
                        if (!currentTupletMark.finish) {
                          const tupletKey = currentTupletMark.key
                          const tupletDirection = currentTupletMark.direction || 'up'
                          const tupletMustBeWithBrackets = currentTupletMark.withBrackets || false
                          const tupletValue = currentTupletMark.value
                          const tupletIsAboveOrBelowStaveLines = currentTupletMark.aboveBelowOverUnderStaveLines
                          const tupletYCorrection = (currentTupletMark.yCorrection || 0) * intervalBetweenStaveLines
                          if (/^(\d+)(:(\d+))?$/.test(tupletValue)) {
                            if (!tupletsStack[generatedKeyForTupletStack]) {
                              tupletsStack[generatedKeyForTupletStack] = {
                                leftPointsOfTuplets: []
                              }
                            }
                            const nextTupletLeftPoint = {
                              tupletKey,
                              x: currentSingleUnit.stemless
                                ? currentSingleUnit.bodyLeft
                                : (currentSingleUnit.stemDirection === tupletDirection)
                                  ? currentSingleUnit.stemLeft
                                  : currentSingleUnit.bodyLeft,
                              tupletDirection,
                              level: 0,
                              mustBeWithBrackets: tupletMustBeWithBrackets,
                              singleUnits: [ ],
                              tupletValue,
                              tupletYCorrection
                            }
                            if (currentTupletMark.before) {
                              nextTupletLeftPoint.startsBefore = true
                              nextTupletLeftPoint.voicesBodyThatTupletStartsBefore = voicesBody
                            } else {
                              nextTupletLeftPoint.startsBefore = false
                            }
                            tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.push(nextTupletLeftPoint)
                            if (!yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack]) {
                              yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack] = {}
                            }
                            if (!yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][tupletDirection]) {
                              yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][tupletDirection] = []
                            }
                            if (yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][tupletDirection][0] === undefined) {
                              const calculatedTopOfStaveForFirstNoteInCurrentSingleUnit = topOfStaveForFirstNoteInCurrentSingleUnit(staveIndex, currentSingleUnit, topOffsetsForEachStave)
                              const calculatedTopOfStaveForLastNoteInCurrentSingleUnit = topOfStaveForLastNoteInCurrentSingleUnit(staveIndex, currentSingleUnit, topOffsetsForEachStave)
                              const calculatedBottomOfStaveForLastNoteInCurrentSingleUnit = calculatedTopOfStaveForLastNoteInCurrentSingleUnit + (numberOfStaveLines - 1) * (intervalBetweenStaveLines)
                              yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][tupletDirection][0] = tupletDirection === 'up'
                                ? (tupletIsAboveOrBelowStaveLines ? calculatedTopOfStaveForFirstNoteInCurrentSingleUnit : currentSingleUnit.top) - topOffsetOfTupletWithLevelZero
                                : (tupletIsAboveOrBelowStaveLines ? calculatedBottomOfStaveForLastNoteInCurrentSingleUnit : currentSingleUnit.bottom) + topOffsetOfTupletWithLevelZero
                            }
                            if (tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length > 1) {
                              for (let tupletPointIndex = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length - 1; tupletPointIndex > 0; tupletPointIndex--) {
                                const currentTupletLeftPoint = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[tupletPointIndex]
                                const prevTupletLeftPointsWithTheSameDirectionAsForCurrentTupletLeftPoint = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.slice(0, tupletPointIndex).filter(prevTupletLeftPoint => prevTupletLeftPoint.tupletDirection === currentTupletLeftPoint.tupletDirection)
                                const prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint = prevTupletLeftPointsWithTheSameDirectionAsForCurrentTupletLeftPoint[prevTupletLeftPointsWithTheSameDirectionAsForCurrentTupletLeftPoint.length - 1]
                                if (prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint) {
                                  if (prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.level === currentTupletLeftPoint.level) {
                                    prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.level = currentTupletLeftPoint.level + 1
                                    const newTupletLevel = prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.level
                                    if (!yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack]) {
                                      yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack] = {}
                                    }
                                    if (!yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.tupletDirection]) {
                                      yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.tupletDirection] = []
                                    }
                                    if (
                                      yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.tupletDirection][newTupletLevel] === undefined
                                    ) {
                                      yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][prevTupletLeftPointWithTheSameDirectionAsForCurrentTupletLeftPoint.tupletDirection][newTupletLevel] = yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][currentTupletLeftPoint.tupletDirection][currentTupletLeftPoint.level] + (currentTupletLeftPoint.tupletDirection === 'up' ? -1 : +1) * tupletNestedVerticalGradient
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    if (tupletsStack[generatedKeyForTupletStack] && tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets) {
                      for (let tupletPointIndex = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length - 1; tupletPointIndex >= 0; tupletPointIndex--) {
                        const leftTupletPoint = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[tupletPointIndex]
                        if (leftTupletPoint) {
                          if (
                            yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack] &&
                            yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection] &&
                            yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection][leftTupletPoint.level] !== undefined
                          ) {
                            let distanceToMoveTupletsSoTheyCanBeAboveOrBeneathTupletSingleUnits = 0
                            const tupletPointDirectionSign = leftTupletPoint.tupletDirection === 'up' ? -1 : +1
                            distanceToMoveTupletsSoTheyCanBeAboveOrBeneathTupletSingleUnits = leftTupletPoint.tupletDirection === 'up'
                              ? Math.max(0, yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection][leftTupletPoint.level] - currentSingleUnit.top + topOffsetOfTupletWithLevelZero)
                              : Math.max(0, currentSingleUnit.bottom - yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection][leftTupletPoint.level] + topOffsetOfTupletWithLevelZero)
                            if (distanceToMoveTupletsSoTheyCanBeAboveOrBeneathTupletSingleUnits > 0) {
                              for (let levelIndex = 0; levelIndex < yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection].length; levelIndex++) {
                                yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPoint.tupletDirection][levelIndex] += tupletPointDirectionSign * distanceToMoveTupletsSoTheyCanBeAboveOrBeneathTupletSingleUnits
                              }
                            }
                          }
                          if (!leftTupletPoint.finished) {
                            leftTupletPoint.singleUnits.push(currentSingleUnit)
                          }
                        }
                      }
                    }
                    if (currentSingleUnit.tupletMarks) {
                      for (let tupletMarkIndex = 0; tupletMarkIndex < currentSingleUnit.tupletMarks.length; tupletMarkIndex++) {
                        const currentTupletMark = currentSingleUnit.tupletMarks[tupletMarkIndex]
                        if (currentTupletMark.finish && currentTupletMark.after && singleUnitIndex !== drawnSingleUnitsInVoices[staveIndex][voiceIndex].length - 1) {
                          const lastSingleUnitInCurrentVoiceOnCurrentStave = drawnSingleUnitsInVoices[staveIndex][voiceIndex][drawnSingleUnitsInVoices[staveIndex][voiceIndex].length - 1]
                          if (lastSingleUnitInCurrentVoiceOnCurrentStave) {
                            lastSingleUnitInCurrentVoiceOnCurrentStave.tupletMarks = lastSingleUnitInCurrentVoiceOnCurrentStave.tupletMarks || []
                            lastSingleUnitInCurrentVoiceOnCurrentStave.tupletMarks.unshift(currentTupletMark)
                            currentSingleUnit.tupletMarks.splice(tupletMarkIndex, 1)
                            tupletMarkIndex--
                            continue
                          }
                        }
                        if (currentTupletMark.finish) {
                          if (tupletsStack[generatedKeyForTupletStack]) {
                            const leftPointIndexWithTupletKeyAsInCurrentTupletMark = tupletsStack[generatedKeyForTupletStack]
                              .leftPointsOfTuplets
                              .findIndex(leftTupletPoint => leftTupletPoint.tupletKey === currentTupletMark.key)
                            if (leftPointIndexWithTupletKeyAsInCurrentTupletMark !== -1) {
                              const leftPointWithTupletKeyAsInCurrentTupletMark = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[leftPointIndexWithTupletKeyAsInCurrentTupletMark]
                              if (currentTupletMark.after) {
                                leftPointWithTupletKeyAsInCurrentTupletMark.finishesAfter = true
                              } else {
                                leftPointWithTupletKeyAsInCurrentTupletMark.finishesAfter = false
                              }
                              if (leftPointWithTupletKeyAsInCurrentTupletMark && leftPointWithTupletKeyAsInCurrentTupletMark.singleUnits.length > 0) {
                                leftPointWithTupletKeyAsInCurrentTupletMark.finished = true
                                if (allLeftPointsWithTupletDirectionOfTupletsWithLevelLowerThanOrEqualToSpecifiedOneAreFinished(tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets, leftPointWithTupletKeyAsInCurrentTupletMark.tupletDirection, leftPointWithTupletKeyAsInCurrentTupletMark.level)) {
                                  for (let leftTupletPointIndex = 0; leftTupletPointIndex < tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length; leftTupletPointIndex++) {
                                    if (
                                      (tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[leftTupletPointIndex].tupletDirection === leftPointWithTupletKeyAsInCurrentTupletMark.tupletDirection) &&
                                      (
                                        (tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[leftTupletPointIndex].level <= leftPointWithTupletKeyAsInCurrentTupletMark.level) ||
                                        tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[leftTupletPointIndex].finished
                                      )
                                    ) {
                                      const leftTupletPointToBeDrawn = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets[leftTupletPointIndex]
                                      leftTupletPointToBeDrawn.y = yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftTupletPointToBeDrawn.tupletDirection][leftTupletPointToBeDrawn.level]
                                      const belongsToComplexTuplet = tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length > 1
                                      const drawnTupletShape = tupletShape(leftTupletPointToBeDrawn, voicesBody, belongsToComplexTuplet, leftTupletPointToBeDrawn.startsBefore, leftTupletPointToBeDrawn.finishesAfter, styles)
                                      drawnTuplets.push(drawnTupletShape)
                                      tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.splice(leftTupletPointIndex, 1)
                                      leftTupletPointIndex--
                                    }
                                  }
                                  yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack][leftPointWithTupletKeyAsInCurrentTupletMark.tupletDirection].splice(0, leftPointWithTupletKeyAsInCurrentTupletMark.level)
                                  if (tupletsStack[generatedKeyForTupletStack].leftPointsOfTuplets.length === 0) {
                                    delete tupletsStack[generatedKeyForTupletStack]
                                    delete yByKeyForTupletStackAndDirectionAndLevel[generatedKeyForTupletStack]
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    if (currentSingleUnit.isLastSingleUnitInVoiceOnPageLine) {
                      for (const currentTupletStackKey in tupletsStack) {
                        if (currentTupletStackKey === generatedKeyForTupletStack) {
                          const currentMarkedTuplet = tupletsStack[currentTupletStackKey]
                          const initialNumberOfUnfinishedTuplets = currentMarkedTuplet.leftPointsOfTuplets.length
                          const belongsToComplexTuplet = currentMarkedTuplet.leftPointsOfTuplets.length > 1
                          for (let leftTupletPointIndex = 0; leftTupletPointIndex < initialNumberOfUnfinishedTuplets; leftTupletPointIndex++) {
                            const lastLeftTupletPoint = currentMarkedTuplet.leftPointsOfTuplets.shift()
                            if (lastLeftTupletPoint && lastLeftTupletPoint.singleUnits.length > 0) {
                              lastLeftTupletPoint.y = yByKeyForTupletStackAndDirectionAndLevel[currentTupletStackKey][lastLeftTupletPoint.tupletDirection][lastLeftTupletPoint.level]
                              const drawnTupletShape = tupletShape(lastLeftTupletPoint, voicesBody, belongsToComplexTuplet, lastLeftTupletPoint.startsBefore, true, styles)
                              drawnTuplets.push(drawnTupletShape)
                            }
                            delete tupletsStack[currentTupletStackKey]
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
  }
  return drawnTuplets
}
