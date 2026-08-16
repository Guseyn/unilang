self.onmessage = async (event) => {
  const { setupFonts } = await import('#unilang/api.js')
  const fontConfig = event.data.fontConfig

  if (!fontConfig) {
    const errorMsg = 'No fontConfig provided'
    self.postMessage({
      error: errorMsg,
      stack: new Error(errorMsg).stack
    })
    return
  }

  try {
    const supportedFontSources = await setupFonts(fontConfig)
    console.log(supportedFontSources)
    self.postMessage({ supportedFontSources })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : new Error(errorMessage).stack
    self.postMessage({
      error: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown'
    })
  }
}

self.onerror = (event) => {
  self.postMessage({
    error: event.message,
    stack: event.filename + ':' + event.lineno + ':' + event.colno,
    name: 'UncaughtError'
  })
}
