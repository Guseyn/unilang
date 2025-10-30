'use strict'

const topOffsetOfElementConsideringItsStave = require('./../stave/topOffsetOfElementConsideringItsStave')
const parenthesesSpline = require('./../bracket/parenthesesSpline')
const moveSingleUnit = require('./../unit/moveSingleUnit')
const elementWithAdditionalInformation = require('./../basic/elementWithAdditionalInformation')
const group = require('./../basic/group')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (singleUnit, additionalInformation, numberOfStaveLines, parentheses, topOffset, styles) => {
  const { intervalBetweenStaveLines, offsetForNoteParenthesesFromBothSides, offsetForNoteParenthesesFromRightSideOfWave, offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides, parenthesesYCorrection } = styles
  const drawnParentheses = []
  const drawnOpenBrackets = []
  const drawnCloseBrackets = []
  for (let parenthesesIndex = 0; parenthesesIndex < parentheses.length; parenthesesIndex++) {
    const currentParentheses = parentheses[parenthesesIndex]
    if (currentParentheses.appliedToWholeUnit) {
      currentParentheses.fromNoteIndex = 0
      currentParentheses.toNoteIndex = singleUnit.sortedNotes.length - 1
    }
    if (currentParentheses.fromNoteIndex === undefined) {
      currentParentheses.fromNoteIndex = 0
    }
    if (currentParentheses.toNoteIndex === undefined) {
      currentParentheses.toNoteIndex = singleUnit.sortedNotes.length - 1
    }
    if (currentParentheses.fromNoteIndex < 0) {
      currentParentheses.fromNoteIndex = 0
    }
    if (currentParentheses.toNoteIndex > singleUnit.sortedNotes.length - 1) {
      currentParentheses.toNoteIndex = singleUnit.sortedNotes.length - 1
    }
    if (currentParentheses.toNoteIndex < currentParentheses.fromNoteIndex) {
      currentParentheses.toNoteIndex = currentParentheses.fromNoteIndex
    }
    currentParentheses.startPositionNumber = singleUnit.sortedNotesPositionNumbers[currentParentheses.fromNoteIndex]
    currentParentheses.endPositionNumber = singleUnit.sortedNotesPositionNumbers[currentParentheses.toNoteIndex]
    currentParentheses.startStave = singleUnit.sortedNotes[currentParentheses.fromNoteIndex].stave
    currentParentheses.endStave = singleUnit.sortedNotes[currentParentheses.toNoteIndex].stave
    const startPositionNumberIndex = currentParentheses.fromNoteIndex
    const endPositionNumberIndex = currentParentheses.toNoteIndex
    const anyIndentedNotesBetweenStartAndEndPositionNumbers = singleUnit.sortedNotes.slice(startPositionNumberIndex, endPositionNumberIndex + 1).some(note => note.indented)
    const anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide = singleUnit.sortedNotes.slice(startPositionNumberIndex, endPositionNumberIndex + 1).some(note => note.isOnAdditionalStaveLines && note.isOnTheLeftSideOfUnit)
    const anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnRightSide = singleUnit.sortedNotes.slice(startPositionNumberIndex, endPositionNumberIndex + 1).some(note => note.isOnAdditionalStaveLines && note.isOnTheRightSideOfUnit)
    const yParenthesesPaddingCoefficient = 0.25
    const topOfStartPositionNumber = topOffsetOfElementConsideringItsStave({ stave: currentParentheses.startStave }, numberOfStaveLines, topOffset, styles) + ((currentParentheses.startPositionNumber || singleUnit.sortedNotesPositionNumbers[0]) - yParenthesesPaddingCoefficient) * intervalBetweenStaveLines + parenthesesYCorrection
    const bottomOfEndPositionNumber = topOffsetOfElementConsideringItsStave({ stave: currentParentheses.endStave }, numberOfStaveLines, topOffset, styles) + ((currentParentheses.endPositionNumber || singleUnit.sortedNotesPositionNumbers[singleUnit.sortedNotesPositionNumbers.length - 1]) + 1 + yParenthesesPaddingCoefficient) * intervalBetweenStaveLines + parenthesesYCorrection
    let leftPositionOfParentheses
    let rightPositionOfParentheses
    if (singleUnit.numberOfDots > 0) {
      leftPositionOfParentheses = singleUnit.left - (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
      rightPositionOfParentheses = singleUnit.right + offsetForNoteParenthesesFromBothSides
    } else {
      if (singleUnit.stemDirection === 'up') {
        if (singleUnit.withFlags && startPositionNumberIndex === 0) {
          leftPositionOfParentheses = singleUnit.left - (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
          rightPositionOfParentheses = singleUnit.flagsRight + offsetForNoteParenthesesFromRightSideOfWave
        } else {
          leftPositionOfParentheses = singleUnit.left - (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
          rightPositionOfParentheses = singleUnit.right + (
            anyIndentedNotesBetweenStartAndEndPositionNumbers
              ? (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnRightSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
              : (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
          )
        }
      } else {
        leftPositionOfParentheses = singleUnit.stemLeft - (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
        rightPositionOfParentheses = singleUnit.right + (
          anyIndentedNotesBetweenStartAndEndPositionNumbers
            ? (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnRightSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
            : (anyNotesBetweenStartAndEndPositionNumbersOnAdditionalStaveLinesOnLeftSide ? offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides : offsetForNoteParenthesesFromBothSides)
        )
      }
    }
    const openBracket = parenthesesSpline(
      {
        x: leftPositionOfParentheses,
        y: topOfStartPositionNumber
      },
      {
        x: leftPositionOfParentheses,
        y: bottomOfEndPositionNumber
      },
      'left',
      styles
    )
    const closedBracket = parenthesesSpline(
      {
        x: rightPositionOfParentheses,
        y: topOfStartPositionNumber
      },
      {
        x: rightPositionOfParentheses,
        y: bottomOfEndPositionNumber
      },
      'right',
      styles
    )
    if (currentParentheses.id !== undefined) {
      addPropertiesToElement(
        openBracket,
        {
          'ref-ids': `note-parentheses-${singleUnit.measureIndexInGeneral + 1}-${singleUnit.staveIndex + 1}-${singleUnit.voiceIndex + 1}-${singleUnit.singleUnitIndex + 1}-${currentParentheses.id + 1}`
        }
      )
      addPropertiesToElement(
        closedBracket,
        {
          'ref-ids': `note-parentheses-${singleUnit.measureIndexInGeneral + 1}-${singleUnit.staveIndex + 1}-${singleUnit.voiceIndex + 1}-${singleUnit.singleUnitIndex + 1}-${currentParentheses.id + 1}`
        }
      )
    }
    addPropertiesToElement(
      openBracket,
      {
        'ref-ids': `unit-parentheses-${singleUnit.measureIndexInGeneral + 1}-${singleUnit.staveIndex + 1}-${singleUnit.voiceIndex + 1}-${singleUnit.singleUnitIndex + 1}-${parenthesesIndex + 1}`
      }
    )
    addPropertiesToElement(
      closedBracket,
      {
        'ref-ids': `unit-parentheses-${singleUnit.measureIndexInGeneral + 1}-${singleUnit.staveIndex + 1}-${singleUnit.voiceIndex + 1}-${singleUnit.singleUnitIndex + 1}-${parenthesesIndex + 1}`
      }
    )
    drawnParentheses.push(
      openBracket,
      closedBracket
    )
    drawnOpenBrackets.push(
      openBracket
    )
    drawnCloseBrackets.push(
      closedBracket
    )
  }
  const allOpenBrackets = group(
    'allOpenBrackets',
    drawnOpenBrackets
  )
  const allCloseBrackets = group(
    'allOpenBrackets',
    drawnCloseBrackets
  )
  additionalInformation.parenthesesLeft = allOpenBrackets.left
  additionalInformation.parenthesesRight = allCloseBrackets.right
  const drawnSingleUnitWithParentheses = elementWithAdditionalInformation(
    group(
      'withParentheses',
      [
        singleUnit,
        ...drawnParentheses
      ]
    ),
    additionalInformation
  )
  moveSingleUnit(
    drawnSingleUnitWithParentheses,
    singleUnit.left - allOpenBrackets.left
  )
  return drawnSingleUnitWithParentheses
}
