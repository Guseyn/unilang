self['__UNILANG_FONT_SOURCES_STORAGE__'] = {}

const eventHandlers = {
  'fonts.setup': async (event) => {
    const { setupFonts } = await import('#unilang/api.js')
    const id = event.data.id
    const fontConfig = event.data.fontConfig
    const fontSourcesReference = event.data.fontSourcesReference

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

  }
}

self.onmessage = async (event) => {
  const name = event.data.name
  if (!name || !eventHandlers[name]) {
    throw new Error('event must have a name and it must be supported')
  }
  await eventHandlers[name](event)
}
