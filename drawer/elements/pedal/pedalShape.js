'use strict'

import text from './../basic/text.js'
import releasePedalShape from './../pedal/releasePedalShape.js'
import path from './../basic/path.js'
import line from './../basic/line.js'
import group from './../basic/group.js'
import moveElement from './../basic/moveElement.js'
import moveElementInTheCenterBetweenPoints from './../basic/moveElementInTheCenterBetweenPoints.js'
import moveElementBeforePointWithInterval from './../basic/moveElementBeforePointWithInterval.js'
import moveElementAfterPointWithInterval from './../basic/moveElementAfterPointWithInterval.js'
import moveElementInTheCenterBetweenPointsAboveAndBelow from './../basic/moveElementInTheCenterBetweenPointsAboveAndBelow.js'
import elementWithAdditionalInformation from './../basic/elementWithAdditionalInformation.js'
import addPropertiesToElement from './../basic/addPropertiesToElement.js'

export default function (pedalStructure, styles) {
  const { intervalBetweenStaveLines, fontColor, pedalLetters, pedalStandAloneTextFontOptions, pedalTextOnVariablePeakFontOptions, pedalBracketStrokeOptions, variablePeakPathPoints, pedalBracketLineXOffset, pedalBracketLineYOffset, pedalMarksYOffsetInCaseIfThereAreTextValuesOnVariablePeaks, wholePedalStructureSrartYOffset, pedalVerticalPartOfBracketHeight, textOnVariablePeakYCorrection, pedalStandAloneTextAfterUnitXOffset, pedalStandAloneTextBeforeUnitXOffset, variablePeakAfterUnitXOffset, variablePeakBeforeUnitXOffset, releasePedalAfterUnitXOffset, releasePedalBeforeUnitXOffset, releasePedalRightOffsetAtEndOfMeasure, emptyPointAsPedalMarkXCorrection, emptyPointAsPedalMarkYCorrection, pedalEmptyPointAfterUnitXOffset, pedalEmptyPointBeforeUnitXOffset, releasePedalYCorrection } = styles
  const standAloneTextsAndPeaksAndReleases = []
  const onlyStandAloneTextsAndEmptyPoints = []
  const onlyVariablePeaks = []
  const onlyReleases = []
  pedalStructure.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.forEach(
    chordWithMark => {
      const currentSingleUnit = chordWithMark.chord
      const xCenterOfSingleUnit = (currentSingleUnit.left + currentSingleUnit.right) / 2
      if (chordWithMark.type === 'emptyPoint') {
        let xPoint = currentSingleUnit.left + emptyPointAsPedalMarkXCorrection
        if (chordWithMark.afterUnit) {
          xPoint = currentSingleUnit.right + pedalEmptyPointAfterUnitXOffset
        } else if (chordWithMark.beforeUnit) {
          xPoint = currentSingleUnit.left - pedalEmptyPointBeforeUnitXOffset
        }
        const emptyPoint = {
          itIsEmptyPoint: true,
          top: 0,
          bottom: 0,
          left: xPoint,
          right: xPoint,
          transformations: []
        }
        moveElement(emptyPoint, 0, pedalStructure.y + emptyPointAsPedalMarkYCorrection)
        standAloneTextsAndPeaksAndReleases.push(
          emptyPoint
        )
        onlyStandAloneTextsAndEmptyPoints.push(
          emptyPoint
        )
      } else if (chordWithMark.type === 'standAloneText') {
        let drawnStandAloneText
        if (pedalLetters[chordWithMark.textValue]) {
          drawnStandAloneText = path(
            pedalLetters[chordWithMark.textValue].points,
            null,
            fontColor,
            xCenterOfSingleUnit,
            0
          )
          moveElementInTheCenterBetweenPointsAboveAndBelow(
            drawnStandAloneText,
            pedalStructure.y,
            pedalStructure.y
          )
        } else {
          drawnStandAloneText = text(
            chordWithMark.textValue,
            pedalStandAloneTextFontOptions
          )(styles, xCenterOfSingleUnit, pedalStructure.y)
        }
        if (chordWithMark.afterUnit) {
          moveElementAfterPointWithInterval(
            drawnStandAloneText,
            currentSingleUnit.right,
            pedalStandAloneTextAfterUnitXOffset
          )
        } else if (chordWithMark.beforeUnit) {
          moveElementBeforePointWithInterval(
            drawnStandAloneText,
            currentSingleUnit.left,
            pedalStandAloneTextBeforeUnitXOffset
          )
        } else {
          moveElementInTheCenterBetweenPoints(
            drawnStandAloneText,
            currentSingleUnit.left,
            currentSingleUnit.right
          )
        }
        addPropertiesToElement(
          drawnStandAloneText,
          {
            'ref-ids': `${pedalStructure.key},${pedalStructure.key.replace('pedal', 'pedal-text')}`
          }
        )
        standAloneTextsAndPeaksAndReleases.push(
          drawnStandAloneText
        )
        onlyStandAloneTextsAndEmptyPoints.push(
          drawnStandAloneText
        )
      } else if (chordWithMark.type === 'variablePeak') {
        const drawnVariablePeak = path(
          variablePeakPathPoints, pedalBracketStrokeOptions, false, xCenterOfSingleUnit, pedalStructure.y
        )
        if (chordWithMark.afterUnit) {
          moveElementAfterPointWithInterval(
            drawnVariablePeak,
            currentSingleUnit.right,
            variablePeakAfterUnitXOffset
          )
        } else if (chordWithMark.beforeUnit) {
          moveElementBeforePointWithInterval(
            drawnVariablePeak,
            currentSingleUnit.left,
            variablePeakBeforeUnitXOffset
          )
        } else {
          moveElementInTheCenterBetweenPoints(
            drawnVariablePeak,
            currentSingleUnit.left,
            currentSingleUnit.right
          )
        }
        drawnVariablePeak.isVariablePeak = true
        standAloneTextsAndPeaksAndReleases.push(
          drawnVariablePeak
        )
        onlyVariablePeaks.push(
          drawnVariablePeak
        )
        addPropertiesToElement(
          drawnVariablePeak,
          {
            'ref-ids': `variable-peak-${currentSingleUnit.measureIndexInGeneral + 1}-${currentSingleUnit.staveIndex + 1}-${currentSingleUnit.voiceIndex + 1}-${currentSingleUnit.singleUnitIndex + 1}`
          }
        )
        chordWithMark.drawnVariablePeak = drawnVariablePeak
      } else if (chordWithMark.type === 'releasePedal') {
        const drawnReleasePedal = releasePedalShape()(
          styles,
          (
            chordWithMark.atEndOfMeasure
              ? (chordWithMark.measure.right - releasePedalRightOffsetAtEndOfMeasure)
              : xCenterOfSingleUnit
          ),
          0
        )
        moveElementInTheCenterBetweenPointsAboveAndBelow(
          drawnReleasePedal,
          pedalStructure.y,
          pedalStructure.y
        )
        if (!chordWithMark.atEndOfMeasure) {
          if (chordWithMark.afterUnit) {
            moveElementAfterPointWithInterval(
              drawnReleasePedal,
              currentSingleUnit.right,
              releasePedalAfterUnitXOffset
            )
          } else if (chordWithMark.beforeUnit) {
            moveElementBeforePointWithInterval(
              drawnReleasePedal,
              currentSingleUnit.left,
              releasePedalBeforeUnitXOffset
            )
          } else {
            moveElementInTheCenterBetweenPoints(
              drawnReleasePedal,
              currentSingleUnit.left,
              currentSingleUnit.right
            )
          }
        }
        drawnReleasePedal.isReleasePedal = true
        standAloneTextsAndPeaksAndReleases.push(
          drawnReleasePedal
        )
        onlyReleases.push(
          drawnReleasePedal
        )
        addPropertiesToElement(
          drawnReleasePedal,
          {
            'ref-ids': pedalStructure.key.replace('pedal', 'release')
          }
        )
      }
    }
  )
  const drawnPedalBracketLines = []
  if (pedalStructure.withBrackets) {
    for (let index = 0; index < standAloneTextsAndPeaksAndReleases.length; index++) {
      if (index < standAloneTextsAndPeaksAndReleases.length - 1) {
        const drawnCurrentPedalMark = standAloneTextsAndPeaksAndReleases[index]
        const drawnNextPedalMark = standAloneTextsAndPeaksAndReleases[index + 1]
        const leftPointOfBracketLine = drawnCurrentPedalMark.right + (drawnCurrentPedalMark.isVariablePeak ? 0 : pedalBracketLineXOffset)
        const rightPointOfBracketLine = drawnNextPedalMark.left - (drawnNextPedalMark.isVariablePeak ? 0 : pedalBracketLineXOffset)
        if (leftPointOfBracketLine < rightPointOfBracketLine) {
          drawnPedalBracketLines.push(
            line(
              leftPointOfBracketLine,
              pedalStructure.y + pedalBracketLineYOffset,
              rightPointOfBracketLine,
              pedalStructure.y + pedalBracketLineYOffset, pedalBracketStrokeOptions
            )
          )
        }
      }
    }
    const firstStandAloneTextOrPeakOrRelease = standAloneTextsAndPeaksAndReleases[0]
    if (firstStandAloneTextOrPeakOrRelease && firstStandAloneTextOrPeakOrRelease.itIsEmptyPoint) {
      drawnPedalBracketLines.push(
        line(
          firstStandAloneTextOrPeakOrRelease.left + pedalBracketLineXOffset,
          pedalStructure.y + pedalBracketLineYOffset,
          firstStandAloneTextOrPeakOrRelease.left + pedalBracketLineXOffset,
          pedalStructure.y + pedalBracketLineYOffset - pedalVerticalPartOfBracketHeight,
          pedalBracketStrokeOptions
        )
      )
    }
    const lastStandAloneTextOrPeakOrRelease = standAloneTextsAndPeaksAndReleases[standAloneTextsAndPeaksAndReleases.length - 1]
    if (lastStandAloneTextOrPeakOrRelease && !lastStandAloneTextOrPeakOrRelease.isReleasePedal) {
      drawnPedalBracketLines.push(
        line(
          lastStandAloneTextOrPeakOrRelease.right + (lastStandAloneTextOrPeakOrRelease.isVariablePeak ? 0 : pedalBracketLineXOffset),
          pedalStructure.y + pedalBracketLineYOffset,
          pedalStructure.rightPoint + pedalBracketLineXOffset,
          pedalStructure.y + pedalBracketLineYOffset, pedalBracketStrokeOptions
        )
      )
    }
    if (pedalStructure.finish && pedalStructure.withBracketClosure && !lastStandAloneTextOrPeakOrRelease.isReleasePedal) {
      const drawnReleaseBracket = line(
        pedalStructure.rightPoint + pedalBracketLineXOffset,
        pedalStructure.y + pedalBracketLineYOffset,
        pedalStructure.rightPoint + pedalBracketLineXOffset,
        pedalStructure.y + pedalBracketLineYOffset - pedalVerticalPartOfBracketHeight,
        pedalBracketStrokeOptions
      )
      drawnPedalBracketLines.push(
        drawnReleaseBracket
      )
      addPropertiesToElement(
        drawnReleaseBracket,
        {
          'ref-ids': pedalStructure.key.replace('pedal', 'release')
        }
      )
    }
  }
  const drawnGroupedStandAloneTextsAndEmptyPoints = group(
    'standAloneTextAndEmptyPoints',
    onlyStandAloneTextsAndEmptyPoints
  )
  const drawnGroupedVariablePeaks = group(
    'variablePeaks',
    onlyVariablePeaks
  )
  const drawnGroupedReleases = group(
    'releases',
    onlyReleases
  )
  const drawnGroupedPedalBracketLines = group(
    'pedalBrackets',
    drawnPedalBracketLines
  )
  addPropertiesToElement(
    drawnGroupedPedalBracketLines,
    {
      'ref-ids': pedalStructure.key.replace('pedal', 'pedal-line')
    }
  )
  if (drawnPedalBracketLines.length > 0) {
    if (onlyVariablePeaks.length > 0) {
      moveElement(
        drawnGroupedPedalBracketLines,
        0,
        drawnGroupedVariablePeaks.bottom - drawnGroupedPedalBracketLines.bottom
      )
    } else if (onlyStandAloneTextsAndEmptyPoints.length > 0) {
      moveElement(
        drawnGroupedPedalBracketLines,
        0,
        drawnGroupedStandAloneTextsAndEmptyPoints.bottom - drawnGroupedPedalBracketLines.bottom
      )
    }
    onlyStandAloneTextsAndEmptyPoints.forEach(standAloneTextOrEmptyPoint => {
      moveElement(
        standAloneTextOrEmptyPoint,
        0,
        drawnGroupedPedalBracketLines.bottom - standAloneTextOrEmptyPoint.bottom + pedalBracketStrokeOptions.width / 2
      )
    })
    onlyReleases.forEach(release => {
      moveElement(
        release,
        0,
        drawnGroupedPedalBracketLines.bottom - (release.top + release.bottom) / 2
      )
    })
  } else {
    onlyReleases.forEach(release => {
      moveElement(
        release,
        0,
        releasePedalYCorrection
      )
    })
  }
  let drawnPedalMarksWithLines = group(
    'pedalMarksWithLines',
    [
      drawnGroupedStandAloneTextsAndEmptyPoints,
      drawnGroupedVariablePeaks,
      drawnGroupedReleases,
      drawnGroupedPedalBracketLines
    ]
  )
  const drawnTextsOnVariablePeaks = []
  if (pedalStructure.hasTextValuesOnVariablePeaks) {
    moveElement(
      drawnPedalMarksWithLines,
      0,
      pedalMarksYOffsetInCaseIfThereAreTextValuesOnVariablePeaks + textOnVariablePeakYCorrection
    )
    const chordsWithVariablePeaksAndTextsOnThem = pedalStructure.chordsWithStandAloneTextsAndVariablePeaksAndReleasePedals.filter(
      chordWithMark => chordWithMark.type === 'variablePeak' && chordWithMark.textValue
    )
    chordsWithVariablePeaksAndTextsOnThem.forEach(
      chordWithMark => {
        if (chordWithMark.drawnVariablePeak) {
          let xPoint = (chordWithMark.drawnVariablePeak.left + chordWithMark.drawnVariablePeak.right) / 2
          let drawnTextOnVariablePeak
          if (pedalLetters[chordWithMark.textValue]) {
            drawnTextOnVariablePeak = path(
              pedalLetters[chordWithMark.textValue].points,
              null,
              fontColor,
              xPoint,
              0
            )
          } else {
            drawnTextOnVariablePeak = text(
              chordWithMark.textValue,
              pedalTextOnVariablePeakFontOptions
            )(styles, xPoint, 0)
          }
          moveElementInTheCenterBetweenPoints(
            drawnTextOnVariablePeak,
            xPoint,
            xPoint
          )
          moveElementInTheCenterBetweenPointsAboveAndBelow(
            drawnTextOnVariablePeak,
            pedalStructure.y + textOnVariablePeakYCorrection,
            pedalStructure.y + textOnVariablePeakYCorrection
          )
          addPropertiesToElement(
            drawnTextOnVariablePeak,
            {
              'ref-ids': `variable-peak-text-${chordWithMark.chord.measureIndexInGeneral + 1}-${chordWithMark.chord.staveIndex + 1}-${chordWithMark.chord.voiceIndex + 1}-${chordWithMark.chord.singleUnitIndex + 1}`
            }
          )
          drawnTextsOnVariablePeaks.push(
            drawnTextOnVariablePeak
          )
        }
      }
    )
  }
  const wholePedalStructure = group(
    'wholePedalStructure',
    [
      drawnPedalMarksWithLines,
      ...drawnTextsOnVariablePeaks
    ]
  )
  moveElement(
    wholePedalStructure,
    0,
    wholePedalStructureSrartYOffset + (pedalStructure.yCorrection || 0) * intervalBetweenStaveLines
  )
  const wholePedalStructureWithAdditionalInformation = elementWithAdditionalInformation(
    wholePedalStructure,
    {
      chords: pedalStructure.chords
    }
  )
  addPropertiesToElement(
    wholePedalStructureWithAdditionalInformation,
    {
      'ref-ids': pedalStructure.key
    }
  )
  return wholePedalStructureWithAdditionalInformation
}
