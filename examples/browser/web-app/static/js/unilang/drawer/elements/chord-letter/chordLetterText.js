'use strict'

import text from '#unilang/drawer/elements/basic/text.js'
import group from '#unilang/drawer/elements/basic/group.js'
// C♯♭oøΔ
const chordLetterSigns = {
  'sharp': '♯',
  '#': '♯',
  'flat': '♭',
  'half-diminished': 'ø',
  'half-dim': 'ø',
  'half dim': 'ø',
  'halfdim': 'ø',
  'hf dim': 'ø',
  'hfdim': 'ø',
  'diminished': 'o',
  'dim': 'o',
  'major sign': 'Δ',
  'major': 'Δ',
  'maj': 'Δ'
}

const chordLetterRegex = new RegExp(`${Object.keys(chordLetterSigns).join('|')}`, 'ig')

// chord letter format: <>^<>/<>^<>

const parsedChordLetter = (chordLetterTextValue) => {
  const valueWithSigns = chordLetterTextValue.replace(chordLetterRegex, (match) => {
    return chordLetterSigns[match]
  })
  const splittedValue = valueWithSigns.split('/')
  let coreBeforeSlash
  let supBeforeSlash
  let coreAfterSlash
  let supAfterSlash
  if (splittedValue[0]) {
    const coreAndSup = splittedValue[0].split('^')
    coreBeforeSlash = coreAndSup[0]
    supBeforeSlash = coreAndSup[1]
  }
  if (splittedValue[1]) {
    const coreAndSup = splittedValue[1].split('^')
    coreAfterSlash = '/' + coreAndSup[0]
    supAfterSlash = coreAndSup[1]
  }
  return {
    coreBeforeSlash, supBeforeSlash, coreAfterSlash, supAfterSlash
  }
}

export default function (chordLetterTextValue) {
  return (styles, leftOffset, topOffset) => {
    const { chordLetterTextFontOptions, chordLetterSupTextFontOptions, chordLetterSupTextLeftOffset } = styles
    const chordLetter = parsedChordLetter(chordLetterTextValue)
    if (!chordLetter.coreBeforeSlash) {
      chordLetter.coreBeforeSlash = '??'
    }
    const texts = []
    let currentLeftOffset = leftOffset
    const coreBeforeSlashText = text(chordLetter.coreBeforeSlash, chordLetterTextFontOptions)(styles, currentLeftOffset, topOffset)
    texts.push(coreBeforeSlashText)
    currentLeftOffset = coreBeforeSlashText.right
    if (chordLetter.supBeforeSlash) {
      const supBeforeSlashText = text(chordLetter.supBeforeSlash, chordLetterSupTextFontOptions)(styles, currentLeftOffset + chordLetterSupTextLeftOffset, topOffset)
      texts.push(supBeforeSlashText)
      currentLeftOffset = supBeforeSlashText.right
    }
    if (chordLetter.coreAfterSlash) {
      const coreAfterSlashText = text(chordLetter.coreAfterSlash, chordLetterTextFontOptions)(styles, currentLeftOffset, topOffset)
      texts.push(coreAfterSlashText)
      currentLeftOffset = coreAfterSlashText.right
    }
    if (chordLetter.supAfterSlash) {
      const supAfterSlashText = text(chordLetter.supAfterSlash, chordLetterSupTextFontOptions)(styles, currentLeftOffset + chordLetterSupTextLeftOffset, topOffset)
      texts.push(supAfterSlashText)
      currentLeftOffset = supAfterSlashText.right
    }
    return group(
      'chordLetterText',
      texts
    )
  }
}
