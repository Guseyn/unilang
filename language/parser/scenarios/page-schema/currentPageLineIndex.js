'use strict'

module.exports = (parserState) => {
  let currentPageLineIndex
  if (parserState.pageSchema.measuresParams) {
    currentPageLineIndex = parserState.numberOfPageLines - 1
  }
  return currentPageLineIndex
}
