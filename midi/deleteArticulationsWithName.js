'use strict'

module.exports = (note, articulationName) => {
  if (!note.articulationParams) {
    return undefined
  }
  const updatedArticulationsParams = note.articulationParams.filter(
    articulationParam => articulationParam.name !== articulationName
  )
  note.articulationParam = updatedArticulationsParams
}
