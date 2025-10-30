'use strict'

const stavePiece = require('./../stave/stavePiece')
const clefShape = require('./clefShape')
const moveElement = require('./../basic/moveElement')
const group = require('./../basic/group')

module.exports = () => {
  return (styles, leftOffset, topOffset) => {
    const { stavePieceWidthForClef, topOffsetMarginForSopranoClef } = styles
    const numberOfLines = 5
    const altoShapeWithCoordinates = clefShape('alto')(styles, 0, topOffset + topOffsetMarginForSopranoClef)
    const xCorrection = (leftOffset + leftOffset + stavePieceWidthForClef) / 2 - (altoShapeWithCoordinates.right + altoShapeWithCoordinates.left) / 2
    moveElement(altoShapeWithCoordinates, xCorrection)
    const stavePieceWithCoordinates = stavePiece(numberOfLines, stavePieceWidthForClef)(styles, leftOffset, topOffset)
    return group(
      'sopranoClef',
      [
        stavePieceWithCoordinates,
        altoShapeWithCoordinates
      ]
    )
  }
}
