'use strict'

import withNumbersInsteadOfWords from '#unilang/language/parser/scenarios/token/withNumbersInsteadOfWords.js'
import regexps from '#unilang/language/parser/scenarios/static-objects/regexps.js'

export default function (tokenValues, startsFromZero) {
  const tokensWithNumbersInsteadOfWords = withNumbersInsteadOfWords(tokenValues)
  const noteIndexMatches = regexps.noteIndex.match(tokensWithNumbersInsteadOfWords)
  if (noteIndexMatches && noteIndexMatches[0]) {
    const noteIndex = noteIndexMatches[0] * 1 - (startsFromZero ? 1 : 0)
    return noteIndex
  }
  const indexOfNoteMatches = regexps.indexOfNote.match(tokensWithNumbersInsteadOfWords)
  if (indexOfNoteMatches && indexOfNoteMatches[0]) {
    const noteIndex = indexOfNoteMatches[0] * 1 - (startsFromZero ? 1 : 0)
    return noteIndex
  }
  return 0
}
