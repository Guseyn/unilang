'use strict'

const group = require('./../basic/group')
const rect = require('./../basic/rect')
const text = require('./../basic/text')
const moveElement = require('./../basic/moveElement')
const moveElementAbovePointWithInterval = require('./../basic/moveElementAbovePointWithInterval')
const moveElementBelowPointWithInterval = require('./../basic/moveElementBelowPointWithInterval')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')
const measures = require('./../measure/measures')

const pageFormats = {
  'c4': [ 9, 12.8 ],
  'a3': [ 11.7, 16.5 ],
  'b4': [ 9.8, 13.9 ],
  'a4': [ 8.3, 11.7 ]
}

const CSS_INCH_IN_PIXELS = 96

module.exports = (pageParamsOnInput) => {
  return (styles, leftOffset, topOffset) => {
    const pageParams = JSON.parse(JSON.stringify(pageParamsOnInput))
    const { pageFormat, pageHeight, intervalBetweenStaveLines, fontColor, pageLeftAndRightPadding, pageColumnStrokeOptions, pageTopPadding, pageBottomPadding, pageLinesTopOffset, titleFontOptions, subtitleFontOptions, leftSubtitleFontOptions, rightSubtitleFontOptions, titleTopOffset, subtitleTopOffset, leftAndRightSubtitlesTopOffset, pageLineMaxWidth, backgroundColor, pageBorderStrokeColor, pageBorderStrokeWidth, emptyMeasuresHeight, pageNumberFontOptions, pageNumberOffsetFromBottomOfThePage } = styles
    const { measuresParams, showMeasureNumbers, directionOfMeasureNumbers, lyricsUnderStaveIndex, compressUnitsByNTimes, stretchUnitsByNTimes, compressUnitsByNTimesInLines, stretchUnitsByNTimesInLines, hideLastMeasure } = pageParams

    const pageLineMaxWidthConsideringFormat = (pageFormat === 'none')
      ? pageLineMaxWidth
      : ((pageFormats[pageFormat][0] * CSS_INCH_IN_PIXELS) - 2 * pageLeftAndRightPadding)

    /* Assigning some page properties to each measure. */
    if (measuresParams) {
      for (let measureIndex = 0; measureIndex < measuresParams.length; measureIndex++) {
        const isLastMeasureInGeneral = measureIndex === measuresParams.length - 1
        measuresParams[measureIndex].lyricsUnderStaveIndex = lyricsUnderStaveIndex || 0
        measuresParams[measureIndex].compressUnitsByNTimes = (compressUnitsByNTimesInLines && compressUnitsByNTimesInLines[measuresParams[measureIndex].pageLineNumber - 1]) ? compressUnitsByNTimesInLines[measuresParams[measureIndex].pageLineNumber - 1] : compressUnitsByNTimes
        measuresParams[measureIndex].stretchUnitsByNTimes = (stretchUnitsByNTimesInLines && stretchUnitsByNTimesInLines[measuresParams[measureIndex].pageLineNumber - 1]) ? stretchUnitsByNTimesInLines[measuresParams[measureIndex].pageLineNumber - 1] : stretchUnitsByNTimes
        if (hideLastMeasure && isLastMeasureInGeneral) {
          measuresParams[measureIndex].isHidden = true
        }
        if (showMeasureNumbers && measureIndex > 0) {
          if (showMeasureNumbers === 'all') {
            measuresParams[measureIndex].showMeasureNumber = true
            measuresParams[measureIndex].directionOfMeasureNumber = directionOfMeasureNumbers || 'up'
          } else {
            if (measuresParams[measureIndex - 1].isLastMeasureOnPageLine) {
              if (showMeasureNumbers === 'first' || showMeasureNumbers === 'first&last') {
                measuresParams[measureIndex].showMeasureNumber = true
                measuresParams[measureIndex].directionOfMeasureNumber = directionOfMeasureNumbers || 'up'
              }
            }
            if (measuresParams[measureIndex].isLastMeasureOnPageLine || isLastMeasureInGeneral) {
              if (showMeasureNumbers === 'last' || showMeasureNumbers === 'first&last') {
                measuresParams[measureIndex].showMeasureNumber = true
                measuresParams[measureIndex].directionOfMeasureNumber = directionOfMeasureNumbers || 'up'
              }
            }
          }
        }
      }
    }

    const pageElements = []
    const xPageCenter = (leftOffset + 2 * pageLeftAndRightPadding + pageLineMaxWidthConsideringFormat) / 2
    let bottomOfMetaInfoOnPage = topOffset + pageTopPadding

    /* Let's draw title if it's specified. */
    if (pageParams.title) {
      const lines = pageParams.title.split(/\\n/)
      const drawnTitleElements = []
      lines.forEach((line, index) => {
        const drawnTitleLine = text(
          line.trim(), titleFontOptions
        )(styles, xPageCenter, ((index === 0) ? 0 : drawnTitleElements[index - 1].bottom))
        drawnTitleElements.push(
          drawnTitleLine
        )
      })
      const drawnTitle = group(
        'title',
        drawnTitleElements
      )
      moveElementBelowPointWithInterval(
        drawnTitle,
        bottomOfMetaInfoOnPage,
        titleTopOffset
      )
      bottomOfMetaInfoOnPage = drawnTitle.bottom
      addPropertiesToElement(
        drawnTitle, {
          'ref-ids': 'title'
        }
      )
      pageElements.push(
        drawnTitle
      )
    }

    /* Let's draw subtitle if it's specified. */
    if (pageParams.subtitle) {
      const lines = pageParams.subtitle.split(/\\n/)
      const drawnSubtitleElements = []
      lines.forEach((line, index) => {
        const drawnSubtitleLine = text(
          line.trim(), subtitleFontOptions
        )(styles, xPageCenter, ((index === 0) ? 0 : drawnSubtitleElements[index - 1].bottom))
        drawnSubtitleElements.push(
          drawnSubtitleLine
        )
      })
      const drawnSubtitle = group(
        'subtitle',
        drawnSubtitleElements
      )
      moveElementBelowPointWithInterval(
        drawnSubtitle,
        bottomOfMetaInfoOnPage,
        subtitleTopOffset
      )
      bottomOfMetaInfoOnPage = drawnSubtitle.bottom
      addPropertiesToElement(
        drawnSubtitle, {
          'ref-ids': 'subtitle'
        }
      )
      pageElements.push(
        drawnSubtitle
      )
    }

    /* Let's draw left subtitle if it's specified. */
    if (pageParams.leftSubtitle) {
      const lines = pageParams.leftSubtitle.split(/\\n/)
      let maxLineWidth = 0
      const drawnLines = []
      lines.forEach((line, index) => {
        const leftSubtitleLine = text(
          line.trim(), leftSubtitleFontOptions
        )(styles, leftOffset + pageLeftAndRightPadding, ((index === 0) ? 0 : drawnLines[index - 1].bottom))
        drawnLines.push(
          leftSubtitleLine
        )
        if (maxLineWidth < (leftSubtitleLine.right - leftSubtitleLine.left)) {
          maxLineWidth = leftSubtitleLine.right - leftSubtitleLine.left
        }
      })
      drawnLines.forEach((line) => {
        moveElement(
          line,
          maxLineWidth / 2
        )
      })
      const leftSubtitle = group(
        'left-subtitle',
        drawnLines
      )
      moveElementBelowPointWithInterval(
        leftSubtitle,
        bottomOfMetaInfoOnPage,
        leftAndRightSubtitlesTopOffset
      )
      if (!pageParams.rightSubtitle) {
        bottomOfMetaInfoOnPage = leftSubtitle.bottom
      }
      addPropertiesToElement(
        leftSubtitle, {
          'ref-ids': 'leftSubtitle'
        }
      )
      pageElements.push(
        leftSubtitle
      )
    }

    /* Let's draw right subtitle if it's specified. */
    if (pageParams.rightSubtitle) {
      const lines = pageParams.rightSubtitle.split(/\\n/)
      let maxLineWidth = 0
      const drawnLines = []
      lines.forEach((line, index) => {
        let rightSubtitleLine = text(
          line.trim(), rightSubtitleFontOptions
        )(styles, leftOffset + pageLeftAndRightPadding + pageLineMaxWidthConsideringFormat, ((index === 0) ? 0 : drawnLines[index - 1].bottom))
        drawnLines.push(
          rightSubtitleLine
        )
        if (maxLineWidth < (rightSubtitleLine.right - rightSubtitleLine.left)) {
          maxLineWidth = rightSubtitleLine.right - rightSubtitleLine.left
        }
      })
      drawnLines.forEach((line) => {
        moveElement(
          line,
          -maxLineWidth / 2
        )
      })
      const rightSubtitle = group(
        'right-subtitle',
        drawnLines
      )
      moveElementBelowPointWithInterval(
        rightSubtitle,
        bottomOfMetaInfoOnPage,
        leftAndRightSubtitlesTopOffset
      )
      bottomOfMetaInfoOnPage = rightSubtitle.bottom
      addPropertiesToElement(
        rightSubtitle, {
          'ref-ids': 'rightSubtitle'
        }
      )
      pageElements.push(
        rightSubtitle
      )
    }

    /* Let's draw measures if they're are specified, otherwise let's draw empty rect. */
    let drawnMeasures
    const pageContainsMetaInfo = pageParams.title || pageParams.subtitle || pageParams.leftSubtitle || pageParams.rightSubtitle
    if (measuresParams && measuresParams.length > 0) {
      drawnMeasures = measures(measuresParams, pageLineMaxWidthConsideringFormat)(styles, leftOffset, bottomOfMetaInfoOnPage + (pageContainsMetaInfo ? pageLinesTopOffset : 0))
      moveElement(
        drawnMeasures,
        pageLeftAndRightPadding
      )
    } else {
      drawnMeasures = rect(
        pageLineMaxWidthConsideringFormat,
        emptyMeasuresHeight,
        {
          color: backgroundColor,
          width: 0
        },
        backgroundColor,
        leftOffset,
        bottomOfMetaInfoOnPage + (pageContainsMetaInfo ? pageLinesTopOffset : 0)
      )
      moveElement(
        drawnMeasures,
        pageLeftAndRightPadding
      )
      drawnMeasures.topOfFirstStave = drawnMeasures.top
      drawnMeasures.bottomOfLastPageLineConsideringOnlyStaves = drawnMeasures.bottom
    }
    pageElements.push(drawnMeasures)

    /* Let's draw rectangles that give us left and right paddings. */
    const measuresHeightAccordingToStaves = drawnMeasures.bottomOfLastPageLineConsideringOnlyStaves - drawnMeasures.topOfFirstStave
    const leftColumn = rect(pageLeftAndRightPadding, measuresHeightAccordingToStaves, pageColumnStrokeOptions, 'none', 0, drawnMeasures.topOfFirstStave)
    const rightColumn = rect(pageLeftAndRightPadding, measuresHeightAccordingToStaves, pageColumnStrokeOptions, 'none', drawnMeasures.right, drawnMeasures.topOfFirstStave)
    pageElements.push(
      leftColumn,
      rightColumn
    )

    const pageWidth = (leftColumn.right - leftColumn.left) + pageLineMaxWidthConsideringFormat + (rightColumn.right - rightColumn.left)
    const finalPageHeight = (pageFormat === 'none')
      ? (pageHeight !== null)
        ? pageHeight
        : ((drawnMeasures.bottomOfLastPageLineConsideringOnlyStaves - topOffset) + pageBottomPadding)
      : (pageFormats[pageFormat][1] * CSS_INCH_IN_PIXELS)

    /* Let's draw page numbers (if needed). */
    if (pageParams.pageNumber !== undefined) {
      const pageNumberText = text(
        pageParams.pageNumber.trim(),
        pageNumberFontOptions
      )(
        styles,
        xPageCenter,
        0
      )
      moveElementAbovePointWithInterval(
        pageNumberText,
        topOffset + finalPageHeight,
        pageNumberOffsetFromBottomOfThePage
      )
      addPropertiesToElement(
        pageNumberText, {
          'ref-ids': 'pageNumber'
        }
      )
      pageElements.push(
        pageNumberText
      )
    }

    /* Let's draw background for the page to give it background color and borders (if needed) */
    const drawnPageWithoutBorder = group(
      'pageWithoutBorder',
      pageElements
    )
    moveElement(drawnPageWithoutBorder, 0, 0)
    const pageBackground = rect(
      pageWidth,
      finalPageHeight,
      {
        color: pageBorderStrokeColor,
        width: pageBorderStrokeWidth
      },
      backgroundColor,
      drawnPageWithoutBorder.left,
      topOffset
    )
    addPropertiesToElement(
      pageBackground,
      { 'data-name': 'page-background' }
    )
    const groupedPage = group(
      'page',
      [
        pageBackground,
        drawnPageWithoutBorder
      ]
    )
    addPropertiesToElement(
      groupedPage,
      {
        'data-interval-between-stave-lines': intervalBetweenStaveLines,
        'data-font-color': fontColor
      }
    )
    return groupedPage
  }
}
