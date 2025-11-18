'use strict'

export default function (parserState, currentLineNumber) {
  return parserState.emptyLineNumbers.indexOf(currentLineNumber - 1) !== -1
}
