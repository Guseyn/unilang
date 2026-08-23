self['__UNILANG_FONT_SOURCES_STORAGE__'] = {}

import {
  setupFonts,
  isPageSchemaValid,
  generateIntermediateStructuresForSinglePage,
  generateStylesForSinglePage,
  generateSvgForSinglePage
} from '/js/e-repertoire/repertoire-worker/api.js'

const eventHandlers = {
  'fonts.setup': async (event) => {
    const id = event.data.id
    const fontConfig = event.data.fontConfig
    const fontSourcesReference = event.data.fontSourcesReference

    if (!id) {
      self.postMessage({
        id,
        error: 'No id provided'
      })
      return
    }

    if (!fontConfig) {
      self.postMessage({
        id,
        error: 'No fontConfig provided'
      })
      return
    }

    if (!fontSourcesReference) {
      self.postMessage({
        id,
        error: 'No fontSourcesReference provided'
      })
      return
    }

    try {
      const supportedFontSources = await setupFonts(fontConfig)      
      if (self['__UNILANG_FONT_SOURCES_STORAGE__'][fontSourcesReference]) {
        self.postMessage({
          id,
          error: 'No fontSourcesReference provided'
        })
      }
      self['__UNILANG_FONT_SOURCES_STORAGE__'][fontSourcesReference] = supportedFontSources
      self.postMessage({ id, 'status': 'ok' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      self.postMessage({
        id,
        error: errorMessage
      })
    }
  },
  'svg.generate': async (event) => {
    if (!self['__UNILANG_FONT_SOURCES_STORAGE__']) {
      self.postMessage({
        id,
        error: 'Fonts are not configured, please declare <template is="e-repertoire-font-loader"> first'
      })
      return
    }
    const id = event.data.id
    if (!id) {
      self.postMessage({
        id,
        error: 'No id provided'
      })
      return
    }
    const fontSourcesReference = event.data.fontSourcesReference
    if (!fontSourcesReference) {
      self.postMessage({
        id,
        error: 'No fontSourcesReference provided'
      })
      return
    }
    if (!self['__UNILANG_FONT_SOURCES_STORAGE__'][fontSourcesReference]) {
      self.postMessage({
        id,
        error: `Font sources cannot be found by reference (${fontSourcesReference})`
      })
      return
    }
    const supportedFontSources = self['__UNILANG_FONT_SOURCES_STORAGE__'][fontSourcesReference]
    const supportedFontNames = {
      'chord-letters': Object.keys(supportedFontSources['chord-letters']),
      'music': Object.keys(supportedFontSources['music']),
      'text': [
        ...new Set([
          ...Object.keys(supportedFontSources['text']['regular']),
          ...Object.keys(supportedFontSources['text']['bold'])
        ])
      ]
    }
    const inputText = event.data.inputText
    if (!inputText) {
      self.postMessage({
        id,
        error: 'No inputText provided'
      })
      return
    }
    const {
      pageSchema,
      errors,
      customStyles,
    } = generateIntermediateStructuresForSinglePage({
      repertoirePageText: inputText,
      applyHighlighting: false,
      applyOnlyHighlightingWithoutRefIds: false,
      supportedFontNames
    })
    if (!isPageSchemaValid(pageSchema)) {
      self.postMessage({
        id,
        error: 'Page schema is not valid'
      })
    }
    const pageStyles = generateStylesForSinglePage({
      customStyles,
      supportedFontSources
    })
    const svg = generateSvgForSinglePage({
      pageSchema,
      pageStyles
    })
    self.postMessage({
      status: 'ok',
      id,
      svg,
      errors
    })
    return
  }
}

self.onmessage = async (event) => {
  const name = event.data.name
  if (!name || !eventHandlers[name]) {
    throw new Error('event must have a name and it must be supported')
  }
  await eventHandlers[name](event)
}
