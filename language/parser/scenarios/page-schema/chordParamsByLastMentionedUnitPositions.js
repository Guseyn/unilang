'use strict'

const currentPageLineIndex = require('./currentPageLineIndex')

module.exports = (parserState) => {
  const pageSchema = parserState.pageSchema
  const unitPosition = parserState.lastMentionedUnitPosition
  let unitPageLinePosition = parserState.lastMentionedPageLinePosition
  const unitMeasurePosition = parserState.lastMentionedMeasurePosition
  const unitStavePosition = parserState.lastMentionedStavePosition
  const unitVoicePosition = parserState.lastMentionedVoicePosition
  const unitPositionIsNotSpecified = unitPosition === undefined
  let unitPageLinePositionIsNotSpecified = unitPageLinePosition === undefined
  const unitMeasurePositionIsNotSpecified = unitMeasurePosition === undefined
  const unitStavePositionIsNotSpecified = unitStavePosition === undefined
  const unitVoicePositionIsNotSpecified = unitVoicePosition === undefined
  if (unitPageLinePositionIsNotSpecified) {
    unitPageLinePosition = currentPageLineIndex(parserState)
    unitPageLinePositionIsNotSpecified = unitPageLinePosition === undefined
    parserState.calculatedUnitPageLineIndexByLastMentionedPositions = unitPageLinePosition
  } else {
    parserState.calculatedUnitPageLineIndexByLastMentionedPositions = unitPageLinePosition
  }
  if (unitPositionIsNotSpecified) {
    return null
  }
  if (!unitMeasurePositionIsNotSpecified) {
    parserState.calculatedUnitMeasureIndexByLastMentionedPositions = undefined
  }
  if (!unitStavePositionIsNotSpecified) {
    parserState.calculatedUnitStaveIndexByLastMentionedPositions = undefined
  }
  if (!unitVoicePositionIsNotSpecified) {
    parserState.calculatedUnitVoiceIndexByLastMentionedPositions = undefined
  }
  if (pageSchema.measuresParams) {
    if (unitPageLinePositionIsNotSpecified) {
      if (unitMeasurePositionIsNotSpecified) {
        if (unitStavePositionIsNotSpecified) {
          if (unitVoicePositionIsNotSpecified) {
            let unitCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams
                  ) {
                    for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams.length; voiceIndex++) {
                      if (pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex]) {
                        for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex].length; unitIndex++) {
                          if (unitCount === unitPosition) {
                            parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                            parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                            parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                            parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                            return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][unitIndex]
                          }
                          unitCount += 1
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            let unitCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition]
                  ) {
                    for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition].length; unitIndex++) {
                      if (unitCount === unitPosition) {
                        parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                        parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                        parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                        parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                        return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition][unitIndex]
                      }
                      unitCount += 1
                    }
                  }
                }
              }
            }
          }
        } else {
          if (unitVoicePositionIsNotSpecified) {
            let unitCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              if (
                pageSchema.measuresParams[measureIndex].stavesParams &&
                pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams
              ) {
                for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams.length; voiceIndex++) {
                  if (pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex]) {
                    for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex].length; unitIndex++) {
                      if (unitCount === unitPosition) {
                        parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                        parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                        parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                        parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                        return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex][unitIndex]
                      }
                      unitCount += 1
                    }
                  }
                }
              }
            }
          } else {
            let unitCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              if (
                pageSchema.measuresParams[measureIndex].stavesParams &&
                pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams &&
                pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition]
              ) {
                if (pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition]) {
                  for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition].length; unitIndex++) {
                    if (unitCount === unitPosition) {
                      parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                      parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                      parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                      parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                      return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition][unitIndex]
                    }
                    unitCount += 1
                  }
                }
              }
            }
          }
        }
      } else {
        if (unitStavePositionIsNotSpecified) {
          if (unitVoicePositionIsNotSpecified) {
            let unitCount = 0
            if (
              pageSchema.measuresParams[unitMeasurePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams
            ) {
              for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams.length; staveIndex++) {
                if (
                  pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex] &&
                  pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams
                ) {
                  for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams.length; voiceIndex++) {
                    if (pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[voiceIndex]) {
                      for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[voiceIndex].length; unitIndex++) {
                        if (unitCount === unitPosition) {
                          parserState.calculatedUnitMeasureIndexByLastMentionedPositions = unitMeasurePosition
                          parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                          parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                          parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                          return pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[voiceIndex][unitIndex]
                        }
                        unitCount += 1
                      }
                    }
                  }
                }
              }
            }
          } else {
            let unitCount = 0
            if (
              pageSchema.measuresParams[unitMeasurePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams
            ) {
              for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams.length; staveIndex++) {
                if (
                  pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams &&
                  pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[unitVoicePosition]
                ) {
                  for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[unitVoicePosition].length; unitIndex++) {
                    if (unitCount === unitPosition) {
                      parserState.calculatedUnitMeasureIndexByLastMentionedPositions = unitMeasurePosition
                      parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                      parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                      parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                      return pageSchema.measuresParams[unitMeasurePosition].stavesParams[staveIndex].voicesParams[unitVoicePosition][unitIndex]
                    }
                    unitCount += 1
                  }
                }
              }
            }
          }
        } else {
          if (unitVoicePositionIsNotSpecified) {
            let unitCount = 0
            if (
              pageSchema.measuresParams[unitMeasurePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams
            ) {
              for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams.length; voiceIndex++) {
                if (pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[voiceIndex]) {
                  for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[voiceIndex].length; unitIndex++) {
                    if (unitCount === unitPosition) {
                      parserState.calculatedUnitMeasureIndexByLastMentionedPositions = unitMeasurePosition
                      parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                      parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                      parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                      return pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[voiceIndex][unitIndex]
                    }
                    unitCount += 1
                  }
                }
              }
            }
          } else {
            let unitCount = 0
            if (
              pageSchema.measuresParams[unitMeasurePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition] &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams &&
              pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[unitVoicePosition]
            ) {
              for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[unitVoicePosition].length; unitIndex++) {
                if (unitCount === unitPosition) {
                  parserState.calculatedUnitMeasureIndexByLastMentionedPositions = unitMeasurePosition
                  parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                  parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                  parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                  return pageSchema.measuresParams[unitMeasurePosition].stavesParams[unitStavePosition].voicesParams[unitVoicePosition][unitIndex]
                }
                unitCount += 1
              }
            }
          }
        }
      }
    } else {
      if (unitMeasurePositionIsNotSpecified) {
        if (unitStavePositionIsNotSpecified) {
          if (unitVoicePositionIsNotSpecified) {
            let lineCount = 0
            let unitOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams
                  ) {
                    for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams.length; voiceIndex++) {
                      if (pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex]) {
                        for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex].length; unitIndex++) {
                          if (
                            lineCount === unitPageLinePosition &&
                            unitOnLineCount === unitPosition
                          ) {
                            parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                            parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                            parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                            parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                            return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][unitIndex]
                          }
                          unitOnLineCount += 1
                        }
                      }
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                unitOnLineCount = 0
                lineCount += 1
              }
            }
          } else {
            let lineCount = 0
            let unitOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition]
                  ) {
                    for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition].length; unitIndex++) {
                      if (
                        lineCount === unitPageLinePosition &&
                        unitOnLineCount === unitPosition
                      ) {
                        parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                        parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                        parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                        parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                        return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition][unitIndex]
                      }
                      unitOnLineCount += 1
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                unitOnLineCount = 0
                lineCount += 1
              }
            }
          }
        } else {
          if (unitVoicePositionIsNotSpecified) {
            let lineCount = 0
            let unitOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (
                pageSchema.measuresParams[measureIndex].stavesParams
              ) {
                if (
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams
                ) {
                  for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams.length; voiceIndex++) {
                    if (pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex]) {
                      for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex].length; unitIndex++) {
                        if (
                          lineCount === unitPageLinePosition &&
                          unitOnLineCount === unitPosition
                        ) {
                          parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                          parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                          parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                          parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                          return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex][unitIndex]
                        }
                        unitOnLineCount += 1
                      }
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                unitOnLineCount = 0
                lineCount += 1
              }
            }
          } else {
            let lineCount = 0
            let unitOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (
                pageSchema.measuresParams[measureIndex].stavesParams
              ) {
                if (
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition]
                ) {
                  for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition].length; unitIndex++) {
                    if (
                      lineCount === unitPageLinePosition &&
                      unitOnLineCount === unitPosition
                    ) {
                      parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                      parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                      parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                      parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                      return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition][unitIndex]
                    }
                    unitOnLineCount += 1
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                unitOnLineCount = 0
                lineCount += 1
              }
            }
          }
        }
      } else {
        if (unitStavePositionIsNotSpecified) {
          if (unitVoicePositionIsNotSpecified) {
            let lineCount = 0
            let measureOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams
                  ) {
                    for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams.length; voiceIndex++) {
                      if (pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex]) {
                        for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex].length; unitIndex++) {
                          if (
                            lineCount === unitPageLinePosition &&
                            measureOnLineCount === unitMeasurePosition &&
                            unitIndex === unitPosition
                          ) {
                            parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                            parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                            parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                            parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                            return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[voiceIndex][unitIndex]
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                lineCount += 1
                measureOnLineCount = 0
              } else {
                measureOnLineCount += 1
              }
            }
          } else {
            let lineCount = 0
            let measureOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (pageSchema.measuresParams[measureIndex].stavesParams) {
                for (let staveIndex = 0; staveIndex < pageSchema.measuresParams[measureIndex].stavesParams.length; staveIndex++) {
                  if (
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex] &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams &&
                    pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition]
                  ) {
                    for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition].length; unitIndex++) {
                      if (
                        lineCount === unitPageLinePosition &&
                        measureOnLineCount === unitMeasurePosition &&
                        unitIndex === unitPosition
                      ) {
                        parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                        parserState.calculatedUnitStaveIndexByLastMentionedPositions = staveIndex
                        parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                        parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                        return pageSchema.measuresParams[measureIndex].stavesParams[staveIndex].voicesParams[unitVoicePosition][unitIndex]
                      }
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                lineCount += 1
                measureOnLineCount = 0
              } else {
                measureOnLineCount += 1
              }
            }
          }
        } else {
          if (unitVoicePositionIsNotSpecified) {
            let lineCount = 0
            let measureOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (
                pageSchema.measuresParams[measureIndex].stavesParams
              ) {
                if (
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams
                ) {
                  for (let voiceIndex = 0; voiceIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams.length; voiceIndex++) {
                    if (pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex]) {
                      for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex].length; unitIndex++) {
                        if (
                          lineCount === unitPageLinePosition &&
                          measureOnLineCount === unitMeasurePosition &&
                          unitIndex === unitPosition
                        ) {
                          parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                          parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                          parserState.calculatedUnitVoiceIndexByLastMentionedPositions = voiceIndex
                          parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                          return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[voiceIndex][unitIndex]
                        }
                      }
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                lineCount += 1
                measureOnLineCount = 0
              } else {
                measureOnLineCount += 1
              }
            }
          } else {
            let lineCount = 0
            let measureOnLineCount = 0
            for (let measureIndex = 0; measureIndex < pageSchema.measuresParams.length; measureIndex++) {
              const lastMeasureOnPageLine = pageSchema.measuresParams[measureIndex].isLastMeasureOnPageLine ||
                (measureIndex === pageSchema.measuresParams.length - 1)
              if (
                pageSchema.measuresParams[measureIndex].stavesParams
              ) {
                if (
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition] &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams &&
                  pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition]
                ) {
                  for (let unitIndex = 0; unitIndex < pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition].length; unitIndex++) {
                    if (
                      lineCount === unitPageLinePosition &&
                      measureOnLineCount === unitMeasurePosition &&
                      unitIndex === unitPosition
                    ) {
                      parserState.calculatedUnitMeasureIndexByLastMentionedPositions = measureIndex
                      parserState.calculatedUnitStaveIndexByLastMentionedPositions = unitStavePosition
                      parserState.calculatedUnitVoiceIndexByLastMentionedPositions = unitVoicePosition
                      parserState.calculatedUnitIndexByLastMentionedPositions = unitIndex
                      return pageSchema.measuresParams[measureIndex].stavesParams[unitStavePosition].voicesParams[unitVoicePosition][unitIndex]
                    }
                  }
                }
              }
              if (lastMeasureOnPageLine) {
                lineCount += 1
                measureOnLineCount = 0
              } else {
                measureOnLineCount += 1
              }
            }
          }
        }
      }
    }
  }
  return null
}
