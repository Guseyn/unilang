'use strict'

const stavePiece = require('./../stave/stavePiece')
const clefShape = require('./clefShape')
const moveElement = require('./../basic/moveElement')
const group = require('./../basic/group')

module.exports = () => {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef } = styles
    const numberOfStaveLines = 5
    const altoShapeWithCoordinates = clefShape('alto')(styles, 0, topOffset)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (altoShapeWithCoordinates.right + altoShapeWithCoordinates.left) / 2
    moveElement(altoShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfStaveLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'altoClef',
      [
        stavePieceWithCoordinates,
        altoShapeWithCoordinates
      ]
    )
  }
}
