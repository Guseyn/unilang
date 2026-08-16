'use strict'

const opentype = require('./../drawer/lib/opentype/opentype')
const adjustTextareaValueToKeepScrollingAlignedWhenItsValueEndsWithNewline = require('./adjustTextareaValueToKeepScrollingAlignedWhenItsValueEndsWithNewline')
const parsedUnilang = require('./../language/parser/parsedUnilang')
const generatedStyles = require('./../drawer/generatedStyles')
const page = require('./../drawer/elements/page/page')
const svg = require('./../drawer/elements/basic/svg')
const svgAsString = require('./../drawer/elements/basic/svgAsString')
const midi = require('./../midi/midi')
const base64FromUint8 = require('./../midi/base64FromUint8')
const fontUrls = require('./../drawer/font-urls')

const actionHandlers = {
  loadingFontsForRenderingSVGs: (actionOnResponse, input = null) => {
    self.fontSourcesForRenderingSVG = {}
    const urlsOfFontToUploadForRenderingSVG = input || fontUrls

    let numberOfFontsUploaded = 0

    for (let fontIndex = 0; fontIndex < urlsOfFontToUploadForRenderingSVG.length; fontIndex++) {
      const urlParts = urlsOfFontToUploadForRenderingSVG[fontIndex].split('/')
      const fontKey = urlParts[urlParts.length - 1]
      opentype.load(urlsOfFontToUploadForRenderingSVG[fontIndex], (error, result) => {
        if (error) {
          throw error
        }
        numberOfFontsUploaded += 1
        self.fontSourcesForRenderingSVG[fontKey] = result
        if (numberOfFontsUploaded ===  urlsOfFontToUploadForRenderingSVG.length) {
          self.postMessage({ actionOnResponse })
        }
      })
    }
  },
  unilangOutput: (actionOnResponse, input, applyHighlighting, generateSVG, generateMIDI, id) => {
    const unilangInputPages = input
    const output = {}
    if (id) {
      output.id = id
    }
    const onlyToGenerateSVG = generateSVG && !applyHighlighting && !generateMIDI
    const unilangOutputsForEachPage = unilangInputPages.map(unilangInputPage => {
      const unilangInputText = unilangInputPage.unilangInputText
      const isRenderedWithLatestUnilangInputText = unilangInputPage.isRenderedWithLatestUnilangInputText
      const {
        pageSchema,
        errors,
        customStyles,
        midiSettings,
        comments,
        highlightsHtmlBuffer,
        mapOfCharIndexesWithProgressionOfCommandsFromScenarios
      } = isRenderedWithLatestUnilangInputText
        ? parsedUnilang(
          adjustTextareaValueToKeepScrollingAlignedWhenItsValueEndsWithNewline(
            unilangInputText
          ),
          [],
          false,
          true
        )
        : parsedUnilang(
          adjustTextareaValueToKeepScrollingAlignedWhenItsValueEndsWithNewline(
            unilangInputText
          ),
          [],
          applyHighlighting,
          false
        )
      const unilangOutput = onlyToGenerateSVG
        ? {
          customStyles
        }
        : {
          pageSchema,
          errors,
          customStyles,
          midiSettings,
          comments
        }
      if (!isRenderedWithLatestUnilangInputText && applyHighlighting) {
        unilangOutput.highlightsHtmlBuffer = highlightsHtmlBuffer
        unilangOutput.mapOfCharIndexesWithProgressionOfCommandsFromScenarios = mapOfCharIndexesWithProgressionOfCommandsFromScenarios
      }
      if (!isRenderedWithLatestUnilangInputText && generateSVG) {
        const renderedSvg = svgAsString(
          svg(
            page(
              pageSchema
            )(
              generatedStyles(
                customStyles
              ), 0, 0
            )
          )
        )
        // if (!onlyToGenerateSVG) {
        //   unilangOutput.svg = renderedSvg
        // }
        unilangOutput.svg = renderedSvg
        unilangOutput.svgDataSrc = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(renderedSvg)))}`
      }
      return unilangOutput
    })
    output.unilangOutputsForEachPage = unilangOutputsForEachPage
    if (generateMIDI) {
      const measuresParamsForAllPages = []
      const midiSettingsForEachPage = []
      unilangOutputsForEachPage.forEach((unilangOutput, pageIndex) => {
        if (unilangOutput.pageSchema && unilangOutput.pageSchema.measuresParams) {
          unilangOutput.pageSchema.measuresParams.forEach((measureParams, measureIndex) => {
            measureParams.pageIndex = pageIndex
            measureParams.measureIndexOnPage = measureIndex
          })
          measuresParamsForAllPages.push(...unilangOutput.pageSchema.measuresParams)
          midiSettingsForEachPage.push(unilangOutput.midiSettings)
        }
      })
      const pageSchemaForAllPages = {
        measuresParams: measuresParamsForAllPages
      }
      const midiForAllPages = midi(
        pageSchemaForAllPages,
        midiSettingsForEachPage
      )
      midiForAllPages.dataSrc = `data:audio/mpeg;base64,${base64FromUint8(midiForAllPages.data)}`
      output.midiForAllPages = midiForAllPages
    }
    output.id = id
    self.postMessage({ actionOnResponse, output })
  }
}

self.onmessage = (event) => {
  const action = event.data.action
  const actionOnResponse = event.data.actionOnResponse
  const input = event.data.input
  if (action === 'loadingFontsForRenderingSVGs') {
    actionHandlers[action](actionOnResponse, input)
  } else if (action === 'unilangOutput') {
    const applyHighlighting = event.data.applyHighlighting
    const generateSVG = event.data.generateSVG
    const generateMIDI = event.data.generateMIDI
    const id = event.data.id
    actionHandlers[action](actionOnResponse, input, applyHighlighting, generateSVG, generateMIDI, id)
  }
}
