'use strict'

module.exports = (note, articulationNames) => {
  return note.articulationParams && note.articulationParams.some(
    articulationParam =>  articulationNames.indexOf(articulationParam.name) !== -1
  )
}
