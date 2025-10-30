'use strict'

const text = require('./../basic/text')
const path = require('./../basic/path')
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const scaleElementAroundPoint = require('./../basic/scaleElementAroundPoint')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

const drawnTempoElementsByTheirTextValue = (tempoTextValueParts, measureIndex) => {
  return (styles, leftOffset, topOffset) => {
    const { tempoLetters, fontColor, tempoMarkFontOptions, tempoSpaceOfTextAfterText, tempoSpaceOfTextThatStartsWithClosingBracketAfterNote, tempoSpaceOfTextAfterNote, tempoSpaceOfNoteAfterOpeningBracket, tempoSpaceOfNoteAfterText, tempoSpaceOfNoteAfterNote, tempoMarkFontDefaultScale } = styles
    const drawnTempoElementes = []
    let currentLeftOffset = leftOffset
    let lastTextChar
    let lastElementIsNote = false
    let tempoDurationTextIndex = 0
    const scaleNoteSizeToFontSize = tempoMarkFontOptions.size / tempoMarkFontDefaultScale
    for (let index = 0; index < tempoTextValueParts.length; index++) {
      if (tempoTextValueParts[index]) {
        if (tempoLetters[tempoTextValueParts[index]]) {
          const drawnTempoNote = path(
            tempoLetters[tempoTextValueParts[index]].points,
            null,
            fontColor,
            currentLeftOffset,
            topOffset + tempoLetters[tempoTextValueParts[index]].yCorrection
          )
          scaleElementAroundPoint(drawnTempoNote, scaleNoteSizeToFontSize, scaleNoteSizeToFontSize)
          addPropertiesToElement(
            drawnTempoNote,
            {
              'ref-ids': `tempo-duration-part-${measureIndex + 1}-${++tempoDurationTextIndex}`
            }
          )
          if (drawnTempoNote.noteDot) {
            addPropertiesToElement(
              drawnTempoNote.noteDot,
              {
                'ref-ids': `tempo-duration-part-${measureIndex + 1}-${++tempoDurationTextIndex}`
              }
            )
          }
          moveElement(
            drawnTempoNote,
            currentLeftOffset - drawnTempoNote.left + (
              lastElementIsNote
                ? tempoSpaceOfNoteAfterNote * scaleNoteSizeToFontSize
                : (
                  lastTextChar === '('
                    ? tempoSpaceOfNoteAfterOpeningBracket * scaleNoteSizeToFontSize
                    : tempoSpaceOfNoteAfterText * scaleNoteSizeToFontSize
                )
            ),
            0
          )
          drawnTempoElementes.push(drawnTempoNote)
          currentLeftOffset = drawnTempoNote.right
          lastElementIsNote = true
        } else {
          if (tempoTextValueParts[index].trim().length > 0) {
            let justText = text(tempoTextValueParts[index], tempoMarkFontOptions)(styles, currentLeftOffset, topOffset)
            moveElement(
              justText,
              currentLeftOffset - justText.left + (
                lastElementIsNote
                  ? (
                    tempoTextValueParts[index].startsWith(')')
                      ? tempoSpaceOfTextThatStartsWithClosingBracketAfterNote * scaleNoteSizeToFontSize
                      : tempoSpaceOfTextAfterNote * scaleNoteSizeToFontSize
                  )
                  : tempoSpaceOfTextAfterText * scaleNoteSizeToFontSize
              )
            )
            lastTextChar = tempoTextValueParts[index][tempoTextValueParts[index].length - 1]
            drawnTempoElementes.push(justText)
            currentLeftOffset = justText.right
            lastElementIsNote = false
          }
        }
      }
    }
    return drawnTempoElementes
  }
}

module.exports = (measure, measureIndex, voicesBody, styles) => {
  const { intervalBetweenStaveLines, tempoMarkYOffset } = styles
  const drawnTempoMarkElements = drawnTempoElementsByTheirTextValue(measure.tempoMark.textValueParts, measureIndex)(
    styles,
    (voicesBody && !voicesBody.isEmpty) ? voicesBody.left : (measure.stavesLeft || measure.left),
    0
  )
  let drawnTempoMark = group(
    'tempoMark',
    drawnTempoMarkElements
  )
  moveElement(
    drawnTempoMark,
    0,
    (measure.top - drawnTempoMark.bottom) + tempoMarkYOffset + (measure.tempoMark.yCorrection || 0) * intervalBetweenStaveLines
  )
  measure.top = Math.min(measure.top, drawnTempoMark.top)
  return drawnTempoMark
}
