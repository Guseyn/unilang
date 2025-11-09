import opentype from '#unilang/drawer/lib/opentype.js'
import parsedUnilang from '#unilang/language/parser/parsedUnilang.js'
import validatedPageSchema from '#unilang/language/schema/validatedPageSchema.js'
import svgAsString from '#unilang/drawer/elements/basic/svgAsString.js'
import generatedStyles from '#unilang/drawer/generatedStyles.js'
import svg from '#unilang/drawer/elements/basic/svg.js'
import page from '#unilang/drawer/elements/page/page.js'
import midi from '#unilang/midi/midi.js'

// 0. Generate music-js font based on music font (optional)
// 1. Load font object with chord-letters, music, music-js, text
// 3. parse unilang, utilize different outputs
// 4. validate schema (optional)
// 5. generate svg
// 6. generate midi
