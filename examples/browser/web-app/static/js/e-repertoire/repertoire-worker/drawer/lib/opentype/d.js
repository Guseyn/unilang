'use strict'

const width = (font, text, options) => {
  const fontSize = options.fontSize || 72
  const kerning = 'kerning' in options ? options.kerning : true
  const fontScale = 1 / font.unitsPerEm * fontSize

  let width = 0
  const glyphs = font.stringToGlyphs(text)
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i]

    if (glyph.advanceWidth) {
      width += glyph.advanceWidth * fontScale
    }

    if (kerning && i < glyphs.length - 1) {
      const kerningValue = font.getKerningValue(glyph, glyphs[i + 1])
      width += kerningValue * fontScale
    }

    if (options.letterSpacing) {
      width += options.letterSpacing * fontSize
    } else if (options.tracking) {
      width += (options.tracking / 1000) * fontSize
    }
  }
  return width
}

const height = (font, fontSize) => {
  const fontScale = 1 / font.unitsPerEm * fontSize
  return (font.ascender - font.descender) * fontScale
}

const anchor = (match, defaultValue) => {
  return match ? match[0].toLowerCase() : 'left'
}

const metrics = (font, text, options) => {
  const fontSize = options.fontSize || 72
  const horizontalAnchor = anchor(options.anchor.match(/left|center|right/gi), 'left')
  const verticalAnchor = anchor(options.anchor.match(/baseline|top|bottom|middle/gi), 'baseline')

  const calculatedWidth = width(font, text, options)
  const calculatedHeight = height(font, fontSize)

  const fontScale = 1 / font.unitsPerEm * fontSize
  const ascender = font.ascender * fontScale
  const descender = font.descender * fontScale

  let x = options.x || 0
  switch (horizontalAnchor) {
    case 'left':
      x -= 0
      break
    case 'center':
      x -= calculatedWidth / 2
      break
    case 'right':
      x -= calculatedWidth
      break
    default:
      throw new Error(`Unknown anchor option: ${horizontalAnchor}`)
  }

  let y = options.y || 0
  switch (verticalAnchor) {
    case 'baseline':
      y -= ascender
      break
    case 'top':
      y -= 0
      break
    case 'middle':
      y -= calculatedHeight / 2
      break
    case 'bottom':
      y -= calculatedHeight
      break
    default:
      throw new Error(`Unknown anchor option: ${verticalAnchor}`)
  }

  const baseline = y + ascender

  return {
    x,
    y,
    baseline,
    width: calculatedWidth,
    height: calculatedHeight,
    ascender,
    descender,
  }
}

export default function (font, text, options = {}) {
  const fontSize = options.fontSize || 72
  const kerning = options.kerning || true
  const letterSpacing = options.letterSpacing || false
  const tracking = options.tracking || false
  const calculatedMetrics = metrics(font, text, options)
  const path = font.getPath(text, calculatedMetrics.x, calculatedMetrics.baseline, fontSize, { kerning, letterSpacing, tracking })

  return path.toPathData()
}
