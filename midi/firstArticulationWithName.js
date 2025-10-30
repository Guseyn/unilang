'use strict'

module.exports = (note, articulationName) => {
  if (!note.articulationParams) {
    return undefined
  }
  return note.articulationParams.find(
    articulationParam => articulationParam.name === articulationName
  )
}
