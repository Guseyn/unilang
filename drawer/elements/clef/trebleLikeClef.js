'use strict'

const stavePiece = require('./../stave/stavePiece')
const clefShape = require('./clefShape')
const moveElementInTheCenterBetweenPoints = require('./../basic/moveElementInTheCenterBetweenPoints')
const group = require('./../basic/group')

module.exports = (trebleStyleKey) => {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef } = styles
    const numberOfStaveLines = 5
    const trebleShapeWithCoordinates = clefShape(trebleStyleKey)(styles, 0, topOffset)
    moveElementInTheCenterBetweenPoints(trebleShapeWithCoordinates, leftOffset, leftOffset + stavePieceWidthForClef)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'trebleClef',
      [
        stavePieceWithCoordinates,
        trebleShapeWithCoordinates
      ]
    )
  }
}
