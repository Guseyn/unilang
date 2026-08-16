'use strict'

import darkNoteBody from '#unilang/drawer/elements/note/darkNoteBody.js'
import halfNoteBody from '#unilang/drawer/elements/note/halfNoteBody.js'
import wholeNoteBody from '#unilang/drawer/elements/note/wholeNoteBody.js'
import doubleWholeNoteBody from '#unilang/drawer/elements/note/doubleWholeNoteBody.js'
import quadrupleWholeNoteBody from '#unilang/drawer/elements/note/quadrupleWholeNoteBody.js'
import ghostNoteBody from '#unilang/drawer/elements/note/ghostNoteBody.js'
import topOffsetOfElementConsideringItsStave from '#unilang/drawer/elements/stave/topOffsetOfElementConsideringItsStave.js'
import scaleElementAroundPoint from '#unilang/drawer/elements/basic/scaleElementAroundPoint.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import group from '#unilang/drawer/elements/basic/group.js'
import elementWithAdditionalInformation from '#unilang/drawer/elements/basic/elementWithAdditionalInformation.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

export default function (measureIndexInGeneral, staveIndex, voiceIndex, singleUnitIndex, numberOfStaveLines, notes, unitDuration, anyWholeTones, stemDirection, isIndented, isGrace) {
  return (styles, leftOffset, topOffset) => {
    const { graceElementsScaleFactor } = styles
    const noteBodiesWithCoordinates = []
    notes.forEach((note, noteIndex) => {
      const topOffsetOfNoteConsideringItsStave = topOffsetOfElementConsideringItsStave(note, numberOfStaveLines, topOffset, styles)
      let currentNoteBody
      if (note.isGhost) {
        currentNoteBody = ghostNoteBody(note.positionNumber, unitDuration)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
      } else {
        if (unitDuration === 4) {
          currentNoteBody = quadrupleWholeNoteBody(note.positionNumber)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
        } else if (unitDuration === 2) {
          currentNoteBody = doubleWholeNoteBody(note.positionNumber)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
        } else if (unitDuration === 1) {
          currentNoteBody = wholeNoteBody(note.positionNumber)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
        } else if (unitDuration === 1 / 2) {
          currentNoteBody = halfNoteBody(note.positionNumber)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
        } else {
          currentNoteBody = darkNoteBody(note.positionNumber)(styles, leftOffset, topOffsetOfNoteConsideringItsStave)
        }
      }
      addPropertiesToElement(
        currentNoteBody,
        {
          'ref-ids': `note-${measureIndexInGeneral + 1}-${staveIndex + 1}-${voiceIndex + 1}-${singleUnitIndex + 1}-${note.id + 1}`
        }
      )
      if (isGrace) {
        if (unitDuration === 1) {
          if (isIndented) {
            scaleElementAroundPoint(
              currentNoteBody,
              graceElementsScaleFactor,
              graceElementsScaleFactor,
              {
                x: (currentNoteBody.left + currentNoteBody.right) / 2,
                y: (currentNoteBody.top + currentNoteBody.bottom) / 2
              }
            )
          } else {
            scaleElementAroundPoint(
              currentNoteBody,
              graceElementsScaleFactor,
              graceElementsScaleFactor,
              {
                x: (currentNoteBody.left + currentNoteBody.right) / 2,
                y: (currentNoteBody.top + currentNoteBody.bottom) / 2
              }
            )
          }
        } else {
          if (stemDirection === 'up') {
            if (isIndented) {
              scaleElementAroundPoint(
                currentNoteBody,
                graceElementsScaleFactor,
                graceElementsScaleFactor,
                {
                  x: currentNoteBody.left,
                  y: (currentNoteBody.top + currentNoteBody.bottom) / 2
                }
              )
            } else {
              scaleElementAroundPoint(
                currentNoteBody,
                graceElementsScaleFactor,
                graceElementsScaleFactor,
                {
                  x: (currentNoteBody.left + currentNoteBody.right) / 2,
                  y: (currentNoteBody.top + currentNoteBody.bottom) / 2
                }
              )
            }
          } else {
            if (isIndented) {
              scaleElementAroundPoint(
                currentNoteBody,
                graceElementsScaleFactor,
                graceElementsScaleFactor,
                {
                  x: (currentNoteBody.left + currentNoteBody.right) / 2,
                  y: (currentNoteBody.top + currentNoteBody.bottom) / 2
                }
              )
            } else {
              scaleElementAroundPoint(
                currentNoteBody,
                graceElementsScaleFactor,
                graceElementsScaleFactor,
                {
                  x: currentNoteBody.left,
                  y: (currentNoteBody.top + currentNoteBody.bottom) / 2
                }
              )
            }
          }
        }
      }
      const isOnAdditionalStaveLines = (note.positionNumber <= -1) || (note.positionNumber >= numberOfStaveLines)
      noteBodiesWithCoordinates.push(
        elementWithAdditionalInformation(
          currentNoteBody,
          {
            positionNumber: note.positionNumber,
            isOnAdditionalStaveLines,
            indented: note.indented,
            isOnTheRightSideOfUnit: note.isOnTheRightSideOfUnit,
            isOnTheLeftSideOfUnit: note.isOnTheLeftSideOfUnit,
            stave: note.stave,
            staveIndexConsideringStavePosition: note.staveIndexConsideringStavePosition,
            isGhost: note.isGhost
          }
        )
      )
      note.isOnAdditionalStaveLines = isOnAdditionalStaveLines
    })
    const singleUnitBody = group(
      'singleUnitBody',
      noteBodiesWithCoordinates
    )
    const allNotesShouldBeAlighedToTheRight = (!isIndented && stemDirection === 'up') || (isIndented && stemDirection === 'down')
    for (let noteIndex = 0; noteIndex < noteBodiesWithCoordinates.length; noteIndex++) {
      if (allNotesShouldBeAlighedToTheRight && (noteBodiesWithCoordinates[noteIndex].right < singleUnitBody.right)) {
        moveElement(
          noteBodiesWithCoordinates[noteIndex],
          singleUnitBody.right - noteBodiesWithCoordinates[noteIndex].right
        )
      } else if (!allNotesShouldBeAlighedToTheRight && (noteBodiesWithCoordinates[noteIndex].left > singleUnitBody.left)) {
        moveElement(
          noteBodiesWithCoordinates[noteIndex],
          noteBodiesWithCoordinates[noteIndex].left - singleUnitBody.left
        )
      }
    }
    return elementWithAdditionalInformation(
      singleUnitBody,
      {
        notes: noteBodiesWithCoordinates
      }
    )
  }
}
