import opentype from './drawer/lib/opentype.js'
import parsedUnilang from './language/parser/parsedUnilang.js'
import validatedPageSchema from `./language/schema/validatedPageSchema.js`
import svgAsString from `./drawer/elements/basic/svgAsString.js`
import generatedStyles from `./drawer/generatedStyles.js`
import svg from `./drawer/elements/basic/svg.js`
import page from `./drawer/elements/page/page.js`
import midi from `./midi/midi.js`

// 0. Generate music-js font based on music font (optional)
// 1. Load font object with chord-letters, music, music-js, text
// 3. parse unilang, utilize different outputs
// 4. validate schema (optional)
// 5. generate svg
// 6. generate midi
