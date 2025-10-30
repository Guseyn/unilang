'use strict'

const withNumbersInsteadOfWords = require('./withNumbersInsteadOfWords')
const regexps = require('./../static-objects/regexps')

module.exports = (tokenValues, startsFromZero) => {
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
