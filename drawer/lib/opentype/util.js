function isBrowser() {
  return typeof window !== 'undefined'
}

function isNode() {
  return typeof window === 'undefined'
}

function nodeBufferToArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }

  return ab
}

function arrayBufferToNodeBuffer(ab) {
  const buffer = Buffer.from(ab.byteLength)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }

  return buffer
}

function checkArgument(expression, message) {
  if (!expression) {
    throw message
  }
}

module.exports = { isBrowser, isNode, nodeBufferToArrayBuffer, arrayBufferToNodeBuffer, checkArgument }
