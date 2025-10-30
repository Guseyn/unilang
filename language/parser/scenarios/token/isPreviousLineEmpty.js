'use strict'

module.exports = (parserState, currentLineNumber) => {
  return parserState.emptyLineNumbers.indexOf(currentLineNumber - 1) !== -1
}
