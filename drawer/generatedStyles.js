'use strict'

const opentype = require('./lib/opentype/opentype')

const musicFonts = {
  bravura: require('./font/music-js/bravura'),
  leland: require('./font/music-js/leland')
}

const textFontFilePaths = {
  'noto-serif': './drawer/font/text/NotoSerif-Regular.ttf',
  'noto-sans': './drawer/font/text/NotoSans-Regular.ttf'
}

const textBoldFontFilePaths = {
  'noto-serif': './drawer/font/text/NotoSerif-Bold.ttf',
  'noto-sans': './drawer/font/text/NotoSans-Bold.ttf'
}

const chordLettersFontFilePaths = {
  'gentium plus': './drawer/font/chord-letters/GentiumPlus-Regular.ttf',
  'gothic a1': './drawer/font/chord-letters/GothicA1-Regular.ttf'
}

let textFontSources = Object.keys(textFontFilePaths).reduce((sources, fontName) => {
  sources[fontName] = opentype.loadSyncIfOnlyItIsNodeJSEnv(textFontFilePaths[fontName])
  return sources
}, {})

let textBoldFontSources = Object.keys(textBoldFontFilePaths).reduce((sources, fontName) => {
  sources[fontName] = opentype.loadSyncIfOnlyItIsNodeJSEnv(textBoldFontFilePaths[fontName])
  return sources
}, {})

let chordLettersFontSources = Object.keys(chordLettersFontFilePaths).reduce((sources, fontName) => {
  sources[fontName] = opentype.loadSyncIfOnlyItIsNodeJSEnv(chordLettersFontFilePaths[fontName])
  return sources
}, {})

module.exports = (
  {
    pageFormat,
    pageHeight,
    backgroundColor,
    musicFont,
    textFont,
    chordLettersFont,
    fontColor,
    staveLinesColor,
    pageBorderStrokeColor,
    intervalBetweenStaveLines,
    intervalBetweenStaves,
    intervalBetweenPageLines,
    pageLeftAndRightPadding,
    pageLineMaxWidth,
    pageTopPadding,
    pageBottomPadding,
    pageLinesTopOffset,
    pageNumberOffsetFromBottomOfThePage,
    titleTopOffset,
    subtitleTopOffset,
    leftAndRightSubtitlesTopOffset,
    pageBorderStrokeWidth,
    titleFontSize,
    subtitleFontSize,
    leftSubtitleFontSize,
    rightSubtitleFontSize,
    pageNumberFontSize,
    instrumentTitleFontSize,
    emptyMeasureWidth
  },
  defaultIntervalBetweenStaveLines = 8.5
) => {
  pageFormat = pageFormat || 'none'
  pageHeight = pageHeight * 1 || null
  backgroundColor = backgroundColor || '#FDF5E6'
  musicFont = musicFont ? musicFont.toLowerCase() : 'bravura'
  fontColor = fontColor || '#121212'
  staveLinesColor = staveLinesColor || '#343434'
  pageBorderStrokeColor = pageBorderStrokeColor || 'transparent' // '#1F3659'
  intervalBetweenStaveLines = intervalBetweenStaveLines * 1 || defaultIntervalBetweenStaveLines
  intervalBetweenStaves = intervalBetweenStaves * intervalBetweenStaveLines || 13 * intervalBetweenStaveLines
  intervalBetweenPageLines = intervalBetweenPageLines * intervalBetweenStaveLines || 10 * intervalBetweenStaveLines
  pageLeftAndRightPadding = pageLeftAndRightPadding * intervalBetweenStaveLines || 8 * intervalBetweenStaveLines
  pageLineMaxWidth = pageLineMaxWidth * 1 || 844
  pageTopPadding = pageTopPadding * intervalBetweenStaveLines || 9 * intervalBetweenStaveLines
  pageBottomPadding = pageBottomPadding * intervalBetweenStaveLines || 9 * intervalBetweenStaveLines
  pageLinesTopOffset = pageLinesTopOffset * intervalBetweenStaveLines || 10 * intervalBetweenStaveLines
  titleTopOffset = titleTopOffset * intervalBetweenStaveLines || 0 * intervalBetweenStaveLines
  subtitleTopOffset = subtitleTopOffset * intervalBetweenStaveLines || 1.5 * intervalBetweenStaveLines
  leftAndRightSubtitlesTopOffset = leftAndRightSubtitlesTopOffset * intervalBetweenStaveLines || 4 * intervalBetweenStaveLines
  pageBorderStrokeWidth = pageBorderStrokeWidth * intervalBetweenStaveLines || 0.05 * intervalBetweenStaveLines
  titleFontSize = titleFontSize * intervalBetweenStaveLines || 5.4 * intervalBetweenStaveLines
  subtitleFontSize = subtitleFontSize * intervalBetweenStaveLines || 3.8 * intervalBetweenStaveLines
  leftSubtitleFontSize = leftSubtitleFontSize * intervalBetweenStaveLines || 3.2 * intervalBetweenStaveLines
  rightSubtitleFontSize = rightSubtitleFontSize * intervalBetweenStaveLines || 3.2 * intervalBetweenStaveLines
  pageNumberFontSize = pageNumberFontSize * intervalBetweenStaveLines || 3.2 * intervalBetweenStaveLines
  pageNumberOffsetFromBottomOfThePage = pageNumberOffsetFromBottomOfThePage * intervalBetweenStaveLines || 3 * intervalBetweenStaveLines
  emptyMeasureWidth = emptyMeasureWidth * intervalBetweenStaveLines || 10 * intervalBetweenStaveLines
  instrumentTitleFontSize = instrumentTitleFontSize * intervalBetweenStaveLines || 3.4 * intervalBetweenStaveLines

  textFontSources = Object.keys(textFontFilePaths).reduce((sources, fontName) => {
    sources[fontName] = opentype.accessPreloadedSourceInBrowser(textFontFilePaths[fontName], 'fontSourcesForRenderingSVG') || sources[fontName]
    return sources
  }, textFontSources)

  textBoldFontSources = Object.keys(textBoldFontFilePaths).reduce((sources, fontName) => {
    sources[fontName] = opentype.accessPreloadedSourceInBrowser(textBoldFontFilePaths[fontName], 'fontSourcesForRenderingSVG') || sources[fontName]
    return sources
  }, textBoldFontSources)

  chordLettersFontSources = Object.keys(chordLettersFontFilePaths).reduce((sources, fontName) => {
    sources[fontName] = opentype.accessPreloadedSourceInBrowser(chordLettersFontFilePaths[fontName], 'fontSourcesForRenderingSVG') || sources[fontName]
    return sources
  }, chordLettersFontSources)

  const warningColor = '#E23D28'
  const textFontSource = textFont ? textFontSources[textFont.toLowerCase()] : textFontSources['noto-serif']
  const textBoldFontSource =  textFont ? textBoldFontSources[textFont.toLowerCase()] : textBoldFontSources['noto-serif']
  const chordLettersFontSource = chordLettersFont ? chordLettersFontSources[chordLettersFont.toLowerCase()] : chordLettersFontSources['gentium plus']
  const mainFontFamily = 'ZenKurenaido'
  const logoColor = '#ED4C67'
  const logoSize = 1.1
  const graceElementsScaleFactor = 0.65

  const musicFontStyles = musicFonts[musicFont]({
    defaultIntervalBetweenStaveLines,
    intervalBetweenStaveLines
  })

  const {
    stemWidth
  } = musicFontStyles

  return {
    // Fixed
    defaultIntervalBetweenStaveLines,

    // Configurable
    pageFormat,
    pageHeight,
    mainFontFamily,
    intervalBetweenStaveLines,
    intervalBetweenStaves,
    intervalBetweenPageLines,
    pageLeftAndRightPadding,
    pageTopPadding,
    pageBottomPadding,
    pageLinesTopOffset,
    titleTopOffset,
    subtitleTopOffset,
    leftAndRightSubtitlesTopOffset,
    pageNumberOffsetFromBottomOfThePage,
    pageLineMaxWidth,
    pageBorderStrokeColor,
    pageBorderStrokeWidth,
    backgroundColor,
    fontColor,
    staveLinesColor,
    warningColor,
    logoColor,
    logoSize,
    emptyMeasureWidth,

    // From music font
    ...musicFontStyles,

    // Grace
    graceElementsScaleFactor,

    // Others(common)
    logoStrokeOptions: { width: 4.4 * logoSize, color: logoColor, linecap: 'round', linejoin: 'round' },
    noteLetterKeysFontOptions: { source: textFontSource, color: fontColor, size: 2 * intervalBetweenStaveLines, anchor: 'left middle', outlinePadding: 0.25 * intervalBetweenStaveLines, outlineColor: backgroundColor, outlineRadius: 0.5 * intervalBetweenStaveLines },
    noteLetterArticulationFontOptions: { source: textFontSource, color: fontColor, size: 2.1 * intervalBetweenStaveLines, anchor: 'center middle', outlinePadding: 0.25 * intervalBetweenStaveLines, outlineColor: backgroundColor, outlineRadius: 0.5 * intervalBetweenStaveLines },
    dynamicTextFontOptions: { source: textFontSource, color: fontColor, size: 2.4 * intervalBetweenStaveLines, anchor: 'center middle', weight: 'regular' },
    octaveSignHorizontalLineStrokeOptions: { width: 0.2 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'bevel', dasharray: `${intervalBetweenStaveLines},${0.45 * intervalBetweenStaveLines}` },
    octaveSignVerticalLineStrokeOptions: { width: 0.2 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'bevel' },
    chordLetterTextFontOptions: { source: chordLettersFontSource, color: fontColor, size: 3.0 * intervalBetweenStaveLines, anchor: 'left middle' },
    chordLetterSupTextFontOptions: { source: chordLettersFontSource, color: fontColor, size: 2.0 * intervalBetweenStaveLines, anchor: 'left bottom' },
    lyricsFontOptions: { source: textFontSource, color: fontColor, size: 1.8 * intervalBetweenStaveLines, anchor: 'center top' },
    lyricsLastDashFontOptions: { source: textFontSource, color: fontColor, size: 1.7 * intervalBetweenStaveLines, anchor: 'left top' },
    lyricsUnderscoreStrokeOptions: { width: 0.15 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    titleFontOptions: { source: textFontSource, color: fontColor, size: titleFontSize, anchor: 'center top' },
    subtitleFontOptions: { source: textFontSource, color: fontColor, size: subtitleFontSize, anchor: 'center top' },
    leftSubtitleFontOptions: { source: textFontSource, color: fontColor, size: leftSubtitleFontSize, anchor: 'center top' },
    rightSubtitleFontOptions: { source: textFontSource, color: fontColor, size: rightSubtitleFontSize, anchor: 'center top' },
    pageNumberFontOptions: { source: textFontSource, color: fontColor, size: pageNumberFontSize, anchor: 'center middle' },
    fontOptionsForMeasureNumberText: { source: textFontSource, size: 2.0 * intervalBetweenStaveLines, color: fontColor, anchor: 'middle', strokeColor: fontColor, strokeWidth: 0.06 * intervalBetweenStaveLines },
    pedalStandAloneTextFontOptions: { source: textFontSource, color: fontColor, size: 2.6 * intervalBetweenStaveLines, anchor: 'center middle' },
    pedalTextOnVariablePeakFontOptions: { source: textFontSource, color: fontColor, size: 2.2 * intervalBetweenStaveLines, anchor: 'center middle' },
    pedalBracketStrokeOptions: { width: 0.2 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    tupletStrokeOptions: { width: 0.2 * intervalBetweenStaveLines, color: fontColor, linecap: 'butt', linejoin: 'bevel' },
    voltaStrokeOptions: { width: 0.2 * intervalBetweenStaveLines, color: fontColor, linecap: 'butt', linejoin: 'bevel' },
    voltaValueFontOptions: { source: textFontSource, size: 1.7 * intervalBetweenStaveLines, weight: 'regural', color: fontColor, anchor: 'middle', strokeColor: fontColor, strokeWidth: 0.06 * intervalBetweenStaveLines },
    clefShapeNameByClefName: {
      treble: 'treble',
      bass: 'bass',
      alto: 'alto',
      baritone: 'alto',
      mezzoSoprano: 'alto',
      soprano: 'alto',
      tenor: 'alto',
      octaveEightUp: 'trebleOctaveEightUp',
      octaveEightDown: 'trebleOctaveEightDown',
      octaveFifteenUp: 'trebleOctaveFifteenUp',
      octaveFifteenDown: 'trebleOctaveFifteenDown'
    },
    dynamicChangeLinesStrokeOptions: { width: 0.21 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'bevel' },
    multiMeasureRestNumberFontOptions: { source: textBoldFontSource, size: 2.2 * intervalBetweenStaveLines, color: fontColor },
    instrumentTitleFontOptions: { source: textFontSource, size: instrumentTitleFontSize, color: fontColor, strokeColor: fontColor },
    simileCountNumberFontOptions: { source: textBoldFontSource, size: 2.6 * intervalBetweenStaveLines, color: fontColor, strokeColor: fontColor, outlinePadding: 0.25 * intervalBetweenStaveLines, outlineColor: backgroundColor, outlineRadius: 0.5 * intervalBetweenStaveLines },
    repetitionNoteFontOptions: { source: textBoldFontSource, size: 2.8 * intervalBetweenStaveLines, color: fontColor },
    tempoMarkFontOptions: { source: textBoldFontSource, size: 2.2 * intervalBetweenStaveLines, color: fontColor, anchor: 'left middle' },
    additionalStaveLinesStrokeOptions: { width: 0.17 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    noteStemStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'round', linejoin: 'round' },
    noteSquareStemStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'butt', linejoin: 'miter' },
    noteBeamColumnStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'butt', linejoin: 'bevel' },
    noteBeamStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'butt', linejoin: 'bevel' },
    beamBackgroundStrokeOptions: { width: 0.25 * intervalBetweenStaveLines, color: backgroundColor, linecap: 'butt', linejoin: 'miter' },
    verticalLineForQuadrupleWholeNoteStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'round', linejoin: 'round' },
    tieStrokeOptions: { width: 0.135 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    doubleVerticalLinesForDoubleWholeNoteBodyStrokeOptions: { width: stemWidth, color: fontColor, linecap: 'round', linejoin: 'round' },
    doubleVerticalLinesForDoubleWholeNoteBodyShape: [
      'M',
      0, -0.6 * intervalBetweenStaveLines,
      'L',
      0, 0.6 * intervalBetweenStaveLines,
      'M',
      2 * stemWidth, -0.6 * intervalBetweenStaveLines,
      'L',
      2 * stemWidth, 0.6 * intervalBetweenStaveLines
    ],
    slurStrokeOptions: { width: 0.125 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    sShapeSlurStrokeOptions: { width: 0.215 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    parenthesesStrokeOptions: { width: 0.12 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    tremoloStrokeOptions: { width: 0.05 * intervalBetweenStaveLines, color: fontColor, linecap: 'butt', linejoin: 'bevel' },
    crushGraceLineStrokeOptions: { width: 0.17 * intervalBetweenStaveLines, color: fontColor, linecap: 'round', linejoin: 'round' },
    pageColumnStrokeOptions: { width: 0.001 * intervalBetweenStaveLines, color: backgroundColor, linecap: 'butt', linejoin: 'bevel' },
    pageMaxWidthLineStrokeOptions: { width: 0.18 * intervalBetweenStaveLines, color: warningColor, linecap: 'butt', linejoin: 'bevel', dasharray: `${intervalBetweenStaveLines},${0.25 * intervalBetweenStaveLines}` },

    // Others(common), based only on intervalBetweenStaveLines
    additionalSpaceForBreakingConnectionsThatStartBeforeCrossStaveUnitWithCrossStaveElementsBefore: 0.5 * intervalBetweenStaveLines,
    leftMarginForConnectionsThatStartBefore: 0.65 * intervalBetweenStaveLines,
    leftMarginForConnectionsThatStartBeforeMeasureWithEmptyVoicesBody: 1.65 * intervalBetweenStaveLines,
    rightMarginForConnectionsThatFinishAfterMeasureWithEmptyVoicesBody: 1.65 * intervalBetweenStaveLines,
    distanceBetweenInstrumentTitleAndConnectionLine: 1 * intervalBetweenStaveLines,
    barLineWidth: 0.23 * intervalBetweenStaveLines,
    boldBarLineWidth: 0.42 * intervalBetweenStaveLines,
    dottedBarLineWidth: 0.23 * intervalBetweenStaveLines,
    emptyMeasuresHeight: 6.0 * intervalBetweenStaveLines,
    noteLetterArticulationOffsetY: 0.6 * intervalBetweenStaveLines,
    dynamicYOffset: 1.0 * intervalBetweenStaveLines,
    octaveSignYOffset: 1.0 * intervalBetweenStaveLines,
    octaveSignXCorrection: 1.05 * intervalBetweenStaveLines,
    twoOctavesSignXCorrection: 1.55 * intervalBetweenStaveLines,
    octaveSignHorizontalLineLeftOffset: 0.5 * intervalBetweenStaveLines,
    octaveSignHorizontalLineRightOffset: 0.5 * intervalBetweenStaveLines,
    chordLetterSupTextLeftOffset: 0.1 * intervalBetweenStaveLines,
    chordLetterUpYOffset: 2.2 * intervalBetweenStaveLines,
    chordLetterDownYOffset: 2.2 * intervalBetweenStaveLines,
    minXDistanceBetweenChordLetters: 1.0 * intervalBetweenStaveLines,
    lyricsFirstYOffset: 0.2 * intervalBetweenStaveLines,
    lyricsYOffset: 2.4 * intervalBetweenStaveLines,
    lastDashOfLyricsXOffset: 0.25 * intervalBetweenStaveLines,
    underscoreOfLyricsXOffset: 0.4 * intervalBetweenStaveLines,
    lyricsUnderscoreDefaultLength: 2.5 * intervalBetweenStaveLines,
    lyricsEmptyTextHeight: 2.0 * intervalBetweenStaveLines,
    measureNumberTextPadding: 0.35 * intervalBetweenStaveLines,
    measureNumberTextVerticalOffset: 0.8 * intervalBetweenStaveLines,
    variablePeakPathPoints: [
      'M',
      -1.0 * intervalBetweenStaveLines, 1.1 * intervalBetweenStaveLines,
      'L',
      -1.0 * intervalBetweenStaveLines, 1.1 * intervalBetweenStaveLines,
      'L',
      0.0 * intervalBetweenStaveLines, -0.5 * intervalBetweenStaveLines,
      'L',
      1.0 * intervalBetweenStaveLines, 1.1 * intervalBetweenStaveLines,
      'L',
      1.0 * intervalBetweenStaveLines, 1.1 * intervalBetweenStaveLines
    ],
    pedalBracketLineXOffset: 0.5 * intervalBetweenStaveLines,
    pedalBracketLineYOffset: 0 * intervalBetweenStaveLines,
    pedalMarksYOffsetInCaseIfThereAreTextValuesOnVariablePeaks: 2.0 * intervalBetweenStaveLines,
    wholePedalStructureSrartYOffset: 2.3 * intervalBetweenStaveLines,
    pedalVerticalPartOfBracketHeight: 1.5 * intervalBetweenStaveLines,
    textOnVariablePeakYCorrection: -0.35 * intervalBetweenStaveLines,
    pedalStandAloneTextAfterUnitXOffset: 0.0 * intervalBetweenStaveLines,
    pedalStandAloneTextBeforeUnitXOffset: 0.0 * intervalBetweenStaveLines,
    pedalEmptyPointAfterUnitXOffset: 0.0 * intervalBetweenStaveLines,
    pedalEmptyPointBeforeUnitXOffset: 0.0 * intervalBetweenStaveLines,
    variablePeakAfterUnitXOffset: 0.0 * intervalBetweenStaveLines,
    variablePeakBeforeUnitXOffset: 0.0 * intervalBetweenStaveLines,
    releasePedalAfterUnitXOffset: 0.0 * intervalBetweenStaveLines,
    releasePedalBeforeUnitXOffset: 0.0 * intervalBetweenStaveLines,
    releasePedalYCorrection: 0.5 * intervalBetweenStaveLines,
    pedalBracketRightOffsetFinishesBeforeEndOfMeasure: 1.5 * intervalBetweenStaveLines,
    releasePedalRightOffsetAtEndOfMeasure: 2.0 * intervalBetweenStaveLines,
    emptyPointAsPedalMarkXCorrection: -1.0 * intervalBetweenStaveLines,
    emptyPointAsPedalMarkYCorrection: 0.5 * intervalBetweenStaveLines,
    pedalBracketVerticalLineFinishesBeforeOrAfterUnitXOffset: 2.0 * intervalBetweenStaveLines,
    tupletColumnsHeight: 0.8 * intervalBetweenStaveLines,
    tupletNestedVerticalGradient: 2.5 * intervalBetweenStaveLines,
    tupletValueSymbolLeftOffset: 0.1 * intervalBetweenStaveLines,
    topOffsetOfTupletWithLevelZero: 1.5 * intervalBetweenStaveLines,
    tupletSidePadding: 0.45 * intervalBetweenStaveLines,
    tupletValueTextYCorrection: -0.25 * intervalBetweenStaveLines,
    tupletMarginFromMeasureRightPoint: 0.5 * intervalBetweenStaveLines,
    tupletMarginFromMeasureLeftPoint: 0.5 * intervalBetweenStaveLines,
    tupletValueTextSideMargin: 0.6 * intervalBetweenStaveLines,
    yOffsetOfVolta: 0.5 * intervalBetweenStaveLines,
    voltaColumnHeight: 3.0 * intervalBetweenStaveLines,
    voltaValueLeftOffset: 0.6 * intervalBetweenStaveLines,
    voltaValueTopOffset: 0.6 * intervalBetweenStaveLines,
    spaceAfterMidMeasureClefs: 1.0 * intervalBetweenStaveLines,
    spaceAfterMidMeasureClefsForMidMeasureKeySignatures: 0.5 * intervalBetweenStaveLines,
    spaceAfterMidMeasureKeySignaturesForBreathMark: 0.5 * intervalBetweenStaveLines,
    dynamicChangeYOffset: 1.5 * intervalBetweenStaveLines,
    dynamicChangeSignOffsetFromDynamicText: 0.8 * intervalBetweenStaveLines,
    dynamicChangeSignDefaultHeight: 2.8 * intervalBetweenStaveLines,
    spaceAfterBreathMark: 1.0 * intervalBetweenStaveLines,
    minXDistanceBetweenLyricsWords: 0.85 * intervalBetweenStaveLines,
    minXDistanceBetweenLyricsWordsWithDashOrUnderscoreBetweenThem: 1.55 * intervalBetweenStaveLines,
    timeSignatureXPaddingAfterKeySignature: 0.9 * intervalBetweenStaveLines,
    timeSignatureXPaddingAfterClef: 0.4 * intervalBetweenStaveLines,
    timeSignatureXPaddingIfThereIsNoClefAndNoKeySignatureBefore: 0.5 * intervalBetweenStaveLines,
    timeSignatureXPaddingAfterItself: 0.5 * intervalBetweenStaveLines,
    timeSignatureDigitLeftOffset: 0.2 * intervalBetweenStaveLines,
    multiMeasureRestTextTopMarginOffset: -1.6 * intervalBetweenStaveLines,
    repetitionNoteXOffset: 1.0 * intervalBetweenStaveLines,
    repetitionNoteBottomOffset: 1.0 * intervalBetweenStaveLines,
    tempoMarkFontDefaultScale: 2.1 * intervalBetweenStaveLines,
    tempoSpaceOfNoteAfterText: 0.55 * intervalBetweenStaveLines,
    tempoSpaceOfNoteAfterNote: 0.55 * intervalBetweenStaveLines,
    tempoSpaceOfNoteAfterOpeningBracket: 0.1 * intervalBetweenStaveLines,
    tempoSpaceOfTextAfterText: 0.65 * intervalBetweenStaveLines,
    tempoSpaceOfTextThatStartsWithClosingBracketAfterNote: 0.35 * intervalBetweenStaveLines,
    tempoSpaceOfTextAfterNote: 0.65 * intervalBetweenStaveLines,
    tempoMarkYOffset: -0.75 * intervalBetweenStaveLines,
    trillWaveOffsetFromText: 0.35 * intervalBetweenStaveLines,
    trillWaveOffsetFromNextSingleUnit: 1 * intervalBetweenStaveLines,
    trillMinWaveLength: 2 * intervalBetweenStaveLines,
    glissandoOffsetFromNoteBody: 0.6 * intervalBetweenStaveLines,
    glissandoOffsetFromNoteBodyOnAdditionalLines: 1.0 * intervalBetweenStaveLines,
    glissandoStrokeWidth: 0.225 * intervalBetweenStaveLines,
    spaceAfterArpeggiatedWaveForCrossStaveUnit: 0.6 * intervalBetweenStaveLines,
    spaceAfterArpeggiatedWaveForCrossStaveUnitWithNotesOnAdditionalStaveLines: 1.1 * intervalBetweenStaveLines,
    spaceAfterArpeggiatedWaveAndBeforeKeysForCrossStaveUnit: 0.35 * intervalBetweenStaveLines,
    additionalStaveLinesRadiusFromNoteBody: 0.52 * intervalBetweenStaveLines,
    beamWidth: 0.46 * intervalBetweenStaveLines,
    heightOfBeamColumn: 0.46 * intervalBetweenStaveLines,
    additionalOffsetForIndentedPartOfUnitWithQuadrupleDuration: 0.4 * intervalBetweenStaveLines,
    additionalOffsetForIndentedPartOfUnitWithDoubleDuration: 0.4 * intervalBetweenStaveLines,
    additionalOffsetForIndentedPartOfUnitWithWholeDuration: 0.0 * intervalBetweenStaveLines,
    additionalOffsetForIndentedPartOfUnitWithAllGhostNotes: 0.07 * intervalBetweenStaveLines,
    xDistanceBetweenVerticalsInCrossStaveUnitsSoTheyDontCollide: 0.24 * intervalBetweenStaveLines,
    additionalXDistanceBetweenVerticalsInCrossStaveUnitsSoTheyDontCollideForVerticalsWithDots: 0.56 * intervalBetweenStaveLines,
    defaultStemHeightForBeamedLikeConnectedWithTremoloSingleUnitsWithDurationIsHalfOrQuarter: 2.7 * intervalBetweenStaveLines,
    defaultStemHeightForBeamedSingleUnits: 2.2 * intervalBetweenStaveLines,
    minDefaultStemHeightForBeamedSingleUnits: 1.2 * intervalBetweenStaveLines,
    maxDefaultStemHeightForBeamedSingleUnits: 7.8 * intervalBetweenStaveLines,
    maxDifferenceBetweenStemEndsOfFirstAndLastBeamedSingleUnitWithDifferentStemDirections: 2.5 * intervalBetweenStaveLines,
    defaultStemHeightForSingleUnit: 3.05 * intervalBetweenStaveLines,
    defaultStemHeightForHalfSingleUnit: 3.05 * intervalBetweenStaveLines,
    defaultStemHeightForQuadrupleSingleUnit: 2.8 * intervalBetweenStaveLines,
    yDistanceFromNoteBodyForStem: 0.75 * intervalBetweenStaveLines,
    stavePieceWidthForClef: 4.2 * intervalBetweenStaveLines,
    leftOffsetMarginForNonEmptyKeySignature: 0.2 * intervalBetweenStaveLines,
    spaceWidthAfterKeySignature: 0.05 * intervalBetweenStaveLines,
    topOffsetMarginForBaritoneClef: -2 * intervalBetweenStaveLines,
    topOffsetMarginForMezzoSopranoClef: 1 * intervalBetweenStaveLines,
    topOffsetMarginForSopranoClef: 2 * intervalBetweenStaveLines,
    topOffsetMarginForTenorClef: -1 * intervalBetweenStaveLines,
    stavePieceWidthForBarLine: 0.6 * intervalBetweenStaveLines,
    intervalBetweenBarLineAndBoldLine: 0.3 * intervalBetweenStaveLines,
    stavePieceWidthForBoldDoubleBarLine: 0.6 * intervalBetweenStaveLines,
    stavePieceWidthForDottedBarLine: 0.6 * intervalBetweenStaveLines,
    intervalBetweenDotsInDottedBarLine: 0.3 * intervalBetweenStaveLines,
    dotLengthInDottedBarLine: 0.4 * intervalBetweenStaveLines,
    intervalBetweenBarLines: 0.25 * intervalBetweenStaveLines,
    stavePieceWidthForDoubleBarLine: 0.75 * intervalBetweenStaveLines,
    verticalLineForQuadrupleWholeNoteShape: [
      'M',
      0.0 * intervalBetweenStaveLines, -0.8 * intervalBetweenStaveLines,
      'L',
      0.0 * intervalBetweenStaveLines, 0.8 * intervalBetweenStaveLines
    ],
    doubleVerticalLinesForDoubleWholeNoteBodyShapeWidth: 0.49 * intervalBetweenStaveLines,
    cutBeamLength: 1.2 * intervalBetweenStaveLines,
    minSpaceReservedAfterCrossStaveChordAndBeforeCrossStaveMidMeasureClefsAndBreathMarks: 2.0 * intervalBetweenStaveLines,
    minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWaves: 1.62 * intervalBetweenStaveLines,
    minSpaceReservedAfterCrossStaveChordAndBeforeArpeggiatedWavesForGraceCrossStaveUnit: 1.62 * intervalBetweenStaveLines,
    minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElements: 1.1 * intervalBetweenStaveLines,
    minSpaceReservedAfterCrossStaveChordAndBeforeOtherCrossStaveElementsForGraceCrossStaveUnit: 1.1 * intervalBetweenStaveLines,
    minSpaceAtTheEndOfMeasure: 1.0 * intervalBetweenStaveLines,
    spaceRangesAfterCrossStaveUnitsAccordingMinUnitDurationOnPageLineTheyBelongTo: {
      'min <= 1 / 32': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1 / 32
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 1 / 16
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 1 / 8
        1.62 * 4.24 * intervalBetweenStaveLines, // <= 1 / 4
        1.62 * 6.85 * intervalBetweenStaveLines, // <= 1 / 2
        1.62 * 11.1 * intervalBetweenStaveLines, // <= 1
        1.62 * 18.0 * intervalBetweenStaveLines, // <= 2
        1.62 * 29.03 * intervalBetweenStaveLines, // <= 4
        1.62 * 47.0 * intervalBetweenStaveLines // > 4
      ],
      'min <= 1 / 16': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1 / 16
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 1 / 8
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 1 / 4
        1.62 * 4.24 * intervalBetweenStaveLines, // <= 1 / 2
        1.62 * 6.85 * intervalBetweenStaveLines, // <= 1
        1.62 * 11.1 * intervalBetweenStaveLines, // <= 2
        1.62 * 18.0 * intervalBetweenStaveLines, // <= 4
        1.62 * 29.03 * intervalBetweenStaveLines // > 4
      ],
      'min <= 1 / 8': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1 / 8
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 1 / 4
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 1 / 2
        1.62 * 4.24 * intervalBetweenStaveLines, // <= 1
        1.62 * 6.85 * intervalBetweenStaveLines, // <= 2
        1.62 * 11.1 * intervalBetweenStaveLines, // <= 4
        1.62 * 18.0 * intervalBetweenStaveLines // > 4
      ],
      'min <= 1 / 4': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1 / 4
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 1 / 2
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 1
        1.62 * 4.24 * intervalBetweenStaveLines, // <= 2
        1.62 * 6.85 * intervalBetweenStaveLines, // <= 4
        1.62 * 11.1 * intervalBetweenStaveLines // > 4
      ],
      'min <= 1 / 2': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1 / 2
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 1
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 2
        1.62 * 4.24 * intervalBetweenStaveLines, // <= 4
        1.62 * 6.85 * intervalBetweenStaveLines // > 4
      ],
      'min <= 1': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 1
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 2
        1.62 * 2.62 * intervalBetweenStaveLines, // <= 4
        1.62 * 4.24 * intervalBetweenStaveLines // > 4
      ],
      'min <= 2': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 2
        1.62 * 1.62 * intervalBetweenStaveLines, // <= 4
        1.62 * 2.62 * intervalBetweenStaveLines // > 4
      ],
      'min <= 4': [
        1.62 * intervalBetweenStaveLines, // === 0

        // 1.62 ^ index (golden ratio), let's imagine that 1 = 1.62, then:
        1.62 * 1.0 * intervalBetweenStaveLines, // <= 4
        1.62 * 1.62 * intervalBetweenStaveLines // > 4
      ]
    },
    leftOffsetOfFirstCrossStaveUnit: 1.5 * intervalBetweenStaveLines,
    spaceAfterOnlyLettersForArpeggiatedWaves: 0.9 * intervalBetweenStaveLines,
    tieJunctionPointXOffset: 0.3 * intervalBetweenStaveLines,
    tieJunctionPointXOffsetFromStem: 0.4 * intervalBetweenStaveLines,
    tieJunctionPointXOffsetFromStemForNotesOnAdditionalStaveLines: 1.0 * intervalBetweenStaveLines,
    tieJunctionPointForAdditionalLinesXOffset: 0.8 * intervalBetweenStaveLines,
    tieJunctionPointInMiddleYOffset: 0.2 * intervalBetweenStaveLines,
    tieJunctionPointYOffset: 0.2 * intervalBetweenStaveLines,
    tieJunctionPointOfTieWithUpDirectionThatIsOnTopFirstNoteInSingleUnitYOffset: 0.25 * intervalBetweenStaveLines,
    tieJunctionPointOfTieWithDownDirectionThatIsOnBottomOfLastNoteInSingleUnitYOffset: 0.25 * intervalBetweenStaveLines,
    slurYOffsetForItsSidesWhenItBreakingForNextLine: 0.5 * intervalBetweenStaveLines,
    sShapeSlurYOffsetForItsSidesWhenItBreakingForNextLine: 0.0 * intervalBetweenStaveLines,
    sShapeSlurPartMiddleJunctionPointXOffset: 1.1 * intervalBetweenStaveLines,
    sShapeSlurPartMiddleJunctionPointYOffset: 1.0 * intervalBetweenStaveLines,
    slurRoundCoefficientByXRangeOfSlurStep: 0.00058824 * intervalBetweenStaveLines,
    slurRoundCoefficientByXRangeOfSShapeSlurStepForLogisticFunction: 0.0004 * intervalBetweenStaveLines,
    slurJunctionPhantomPointXCoefficient: 0.1 * intervalBetweenStaveLines,
    slurJunctionPhantomPointYCoefficient: 0.15 * intervalBetweenStaveLines,
    spaceForBreakingConnectionsThatStartBefore: 2.5 * intervalBetweenStaveLines,
    correlationIntervalOfXRangeForSlurRoundCoefficient: 4.5 * intervalBetweenStaveLines,
    minSpaceBetweenSingleUnitExtremePointAndSlur: 0.7 * intervalBetweenStaveLines,
    minSpaceBetweenSingleUnitExtremePointAndSShapeSlur: 1.5 * intervalBetweenStaveLines,
    slurBulkCoefficient: 0.2 * intervalBetweenStaveLines,
    slurJunctionPointForSingleUnitYOffset: 0.35 * intervalBetweenStaveLines,
    slurJunctionPointForSingleUnitYOffsetWithAttributesAboveOrBelow: -0.2 * intervalBetweenStaveLines,
    slurJunctionPointForSingleUnitAtStemYOffset: 0.15 * intervalBetweenStaveLines,
    slurJunctionPointForSingleUnitAtStemWithFlagsYOffset: -0.3 * intervalBetweenStaveLines,
    slurJunctionPointForSingleUnitAtStemXOffset: 0.4 * intervalBetweenStaveLines,
    distanceBetweenSlurLayers: 1.2 * intervalBetweenStaveLines,
    xDistanceToMoveForPhantomSingleUnitThatIsInSlurThatFinishesInTheMomentItChangesItsStave: -1.0 * intervalBetweenStaveLines,
    yDistanceToMoveForPhantomSingleUnitThatIsInSlurThatFinishesInTheMomentItChangesItsStave: 1.0 * intervalBetweenStaveLines,
    articulationYAdditionalOffset: 0.5 * intervalBetweenStaveLines,
    articulationOutlinePadding: 0.25 * intervalBetweenStaveLines,
    articulationOutlineRadius: 0.25 * intervalBetweenStaveLines,
    spaceForMeasureFermata: 1.5 * intervalBetweenStaveLines,
    yDistanceBetweenSingleTremoloStrokes: 0.35 * intervalBetweenStaveLines,
    singleTremoloStrokeNormalWidth: 1.2 * intervalBetweenStaveLines,
    singleTremoloStrokeWithFlagsNormalWidth: 0.8 * intervalBetweenStaveLines,
    singleTremoloStrokeNormalVerticalWidth: 0.45 * intervalBetweenStaveLines,
    tremoloStrokeLineAngleHeight: 0.2 * intervalBetweenStaveLines,
    singleTremoloStrokesYStartOffsetFromStemEdgeInBeamedSingleUnits: 0.3 * intervalBetweenStaveLines,
    singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithTopFlags: 0.15 * intervalBetweenStaveLines,
    singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneTopFlag: 0.3 * intervalBetweenStaveLines,
    singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithBottomFlags: 0.3 * intervalBetweenStaveLines,
    singleTremoloStrokesYStartOffsetFromSingleUnitBodyWithOneBottomFlag: 0.3 * intervalBetweenStaveLines,
    singleTremoloStrokesStartOffsetFromBody: 0.7 * intervalBetweenStaveLines,
    negativeXOffsetOfTremoloBeams: 0.5 * intervalBetweenStaveLines,
    negativeXOffsetOfTremoloBeamsForUnitWithNotesOnAdditionalStaveLines: 0.95 * intervalBetweenStaveLines,
    additionalStemHeightForUnitWithConnectedTwoStrokesTremoloAndUnitDurationIsQuarterOrHalf: 0.95 * intervalBetweenStaveLines,
    additionalStemHeightForUnitWithConnectedThreeStrokesTremoloAndUnitDurationIsQuarterOrHalf: 0.95 * intervalBetweenStaveLines,
    additionalStemHeightForUnitWithThreeTremoloStrokes: 0.8 * intervalBetweenStaveLines,
    additionalStemHeightForUnitWithTwoTremoloStrokes: 0.5 * intervalBetweenStaveLines,
    additionalStemHeightForUnitWithOneTremoloStroke: 0.0 * intervalBetweenStaveLines,
    additionalDownStemHeightForUnitWithOneTremoloStrokeAndWaves: 1.5 * intervalBetweenStaveLines,
    similePreviousMeasureTextTopMarginOffset: -2.0 * intervalBetweenStaveLines,
    offsetForNoteParenthesesFromBothSides: 0.45 * intervalBetweenStaveLines,
    offsetForNoteParenthesesFromRightSideOfWave: -0.0 * intervalBetweenStaveLines,
    offsetForNoteParenthesesThatAreOnAdditionalLinesFromBothSides: 0.85 * intervalBetweenStaveLines,
    offsetForKeyParenthesesFromBothSides: {
      'doubleFlatKey': {
        left: 0.36 * intervalBetweenStaveLines,
        right: 0.16 * intervalBetweenStaveLines
      },
      'doubleSharpKey': {
        left: 0.24 * intervalBetweenStaveLines,
        right: 0.24 * intervalBetweenStaveLines
      },
      'flatKey': {
        left: 0.36 * intervalBetweenStaveLines,
        right: 0.16 * intervalBetweenStaveLines
      },
      'naturalKey': {
        left: 0.24 * intervalBetweenStaveLines,
        right: 0.24 * intervalBetweenStaveLines
      },
      'sharpKey': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      },
      'demiflatKey': {
        left: 0.16 * intervalBetweenStaveLines,
        right: 0.34 * intervalBetweenStaveLines
      },
      'sesquiflatKey': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      },
      'demisharpKey': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      },
      'sesquisharpKey': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      },
      'noteLetter': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      },
      'default': {
        left: 0.2 * intervalBetweenStaveLines,
        right: 0.2 * intervalBetweenStaveLines
      }
    },
    keyParenthesesYPadding: 0.1 * intervalBetweenStaveLines,
    correlationIntervalOfYRangeForParenthesesRoundCoefficient: 1.0 * intervalBetweenStaveLines,
    parenthesesBulkCoefficient: 0.16 * intervalBetweenStaveLines,
    parenthesesYCorrection: -0.5 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLine: 0.3 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove: 0.8 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLines: 0.3 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: 0.3 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLine: -0.15 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove: -0.15 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLines: -0.25 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: 0.3 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLine: -0.4 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow: -0.4 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLines: -0.7 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: -0.7 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLine: -0.15 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow: -0.15 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLines: -0.15 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: 0.15 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLine: -0.0 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLineAndThereAreDrawnStaveLinesAbove: -0.1 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLines: -0.0 * intervalBetweenStaveLines,
    additionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: 0.34 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLine: -0.1 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLineAndThereAreDrawnStaveLinesBelow: -0.15 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLines: -0.1 * intervalBetweenStaveLines,
    additionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: 0.15 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLine: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove: -0.4 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLines: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: 0.4 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLine: 0.1 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesAbove: 0.15 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLines: -0.25 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: -0.75 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLine: 0.45 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLines: -0.15 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: -0.2 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLine: 0.1 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndOnStaveLineAndThereAreDrawnStaveLinesBelow: 0.1 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLines: 0.1 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsNotIndentedAndBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: 0.4 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteIsOnStaveLine: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWavesWhereFirstNoteIsOnStaveLineAndThereAreDrawnStaveLinesAbove: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLines: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForUpStemWithFlagsWhereFirstNoteBetweenStaveLinesAndThereAreDrawnStaveLinesAbove: 0.3 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLine: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteIsOnStaveLineAndThereAreDrawnStaveLinesBelow: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLines: 0.0 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForDownStemWithFlagsWhereLastNoteBetweenStaveLinesAndThereAreDrawnStaveLinesBelow: 0.3 * intervalBetweenStaveLines,
    graceStemAdjustmentForAdditionalHeightForStemOfGraceSingleUnit: 0.0 * intervalBetweenStaveLines,
    crushGraceLineXPaddingForUnitwithFlagsAndStemUp: 1 * intervalBetweenStaveLines,
    crushGraceLineXPaddingForUnitwithFlagsAndStemDown: 0.85 * intervalBetweenStaveLines,
    crushGraceLineXPaddingForUnitWithoutWaves: 0.5 * intervalBetweenStaveLines,
    crushGraceLineXPaddingForBeamedUnit: 0.7 * intervalBetweenStaveLines,
    crushGraceLineStemUpHeightForUnitWithFlags: 1.0 * intervalBetweenStaveLines,
    crushGraceLineStemUpHeightForUnitWithoutWaves: 1.0 * intervalBetweenStaveLines,
    crushGraceLineStemUpHeightForBeamedUnit: 1.4 * intervalBetweenStaveLines,
    crushGraceLineStemDownHeightForUnitWithFlags: 1.0 * intervalBetweenStaveLines,
    crushGraceLineStemDownHeightForUnitWithoutWaves: 1.2 * intervalBetweenStaveLines,
    crushGraceLineStemDownHeightForBeamedUnit: 1.7 * intervalBetweenStaveLines,
    crushGraceYMarginForStemUp: 0.8 * intervalBetweenStaveLines,
    crushGraceYMarginForStemUpWithoutFlags: 0.4 * intervalBetweenStaveLines,
    crushGraceYMarginForStemDown: 0.6 * intervalBetweenStaveLines,
    crushGraceYMarginForStemDownWithoutFlags: 0.4 * intervalBetweenStaveLines,
    crushGraceYMarginForBeamedStemUp: -0.45 * intervalBetweenStaveLines,
    crushGraceYMarginForBeamedStemDown: -0.4 * intervalBetweenStaveLines
  }
}
