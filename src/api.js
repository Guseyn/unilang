import opentype from '#unilang/drawer/lib/opentype/opentype.js'

// ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
//               1. setupFonts
// ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
/*
----------------------------------------------------------------------------------------------------
FONT CONFIGURATION — ENVIRONMENT AWARE

This function loads fonts for three categories:
1. chord-letters — fonts used for chord symbols (e.g., Cm7, G♯, Fmaj7)
2. text — traditional fonts for lyrics, titles, annotations, etc.
3. music — SMuFL music engraving fonts with corresponding JS glyph schemas

The behavior differs drastically depending on the environment:

──────────────────────────────────────────────────────────────────────────────
NODE.JS ENVIRONMENT:
──────────────────────────────────────────────────────────────────────────────
- Local filesystem paths are allowed (./src/.../*.ttf).
- Default font paths are provided so the user doesn't need to supply them.
- fontConfig may override parts of the defaults.

fontConfig structure:

{
  "chord-letters": {
    "<fontName>": "<path-to-font-file.ttf>"
  },

  "text": {
    "<fontFamily>": {
      "regular": "<path-to-regular.ttf>",
      "bold": "<path-to-bold.ttf>"
    }
  },

  "music": {
    "<musicFontName>": {
      "font": "<path-to-music-font.otf>",
      "js":   "<path-to-music-schema-esm-module.js>"
    }
  }
}

Example:

{
  'chord-letters': {
    'gentium plus': './src/drawer/font/chord-letters/GentiumPlus-Regular.ttf',
    'gothic a1': './src/drawer/font/music/Leland.otf'
  },
  'text': {
    'noto-serif': {
      'regular': './src/drawer/font/text/NotoSerif-Regular.ttf',
      'bold': './src/drawer/font/text/NotoSerif-Bold.ttf'
    },
    'noto-sans': {
      'regular': './src/drawer/font/text/NotoSans-Regular.ttf',
      'bold': './src/drawer/font/text/NotoSans-Bold.ttf'
    }
  },
  'music': {
    'bravura': {
      'font': './src/drawer/font/music/Bravura.otf',
      'js': '#unilang/drawer/font/music-js/bravura.js'
    },
    'leland': {
      'font': './src/drawer/font/music/Leland.otf',
      'js': '#unilang/drawer/font/music-js/leland.js'
    }
  }
}

──────────────────────────────────────────────────────────────────────────────
BROWSER ENVIRONMENT:
──────────────────────────────────────────────────────────────────────────────
- Local filesystem paths DO NOT work.
- The user MUST provide fontConfig with full URLs for every font.
- JS glyph schemas must be esm modules
- Default Node.js local paths are NOT used.
- We enforce explicit user configuration to avoid silently broken fonts.

fontConfig structure:

{
  "chord-letters": {
    "<fontName>": "<URL-to-font-file.ttf>"
  },

  "text": {
    "<fontFamily>": {
      "regular": "<URL-to-regular.ttf>",
      "bold": "<URL-to-bold.ttf>"
    }
  },

  "music": {
    "<musicFontName>": {
      "font": "<URL-to-music-font.otf>",
      "js":   "<path-to-music-schema-esm-module.js>"
    }
  }
}

Example:

{
  "chord-letters": {
    "gentium plus": "https://example.com/fonts/GentiumPlus-Regular.ttf",
    "gothic a1":    "https://example.com/fonts/GothicA1-Regular.ttf"
  },

  "text": {
    "noto-serif": {
      "regular": "https://cdn.example.com/fonts/NotoSerif-Regular.ttf",
      "bold":    "https://cdn.example.com/fonts/NotoSerif-Bold.ttf"
    },
    "noto-sans": {
      "regular": "https://cdn.example.com/fonts/NotoSans-Regular.ttf",
      "bold":    "https://cdn.example.com/fonts/NotoSans-Bold.ttf"
    }
  },

  "music": {
    "bravura": {
      "font": "https://example.com/music-fonts/Bravura.otf",
      "js":   "#unilang/drawer/font/music-js/bravura.js"
    },
    "leland": {
      "font": "https://example.com/music-fonts/Leland.otf",
      "js":   "#unilang/drawer/font/music-js/leland.js"
    }
  }
}

----------------------------------------------------------------------------------------------------
The goal: keep Unilang deterministic and reproducible across Node and browser.
----------------------------------------------------------------------------------------------------
*/

export async function setupFonts(fontConfig) {

  /*
  --------------------------------------------------------------------------------------------------
  ENVIRONMENT DETECTION
  --------------------------------------------------------------------------------------------------
  Node.js: no 'window' object
  Browser: window + document exist

  This ensures we do not accidentally use filesystem paths in browser.
  --------------------------------------------------------------------------------------------------
  */
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

  /*
  --------------------------------------------------------------------------------------------------
  DEFAULT FONT CONFIG (NODE.JS ONLY)
  --------------------------------------------------------------------------------------------------
  These local paths only work in Node.js. They must not be used in browser,
  because browsers cannot load './src/.../*.ttf' via opentype.js.
  --------------------------------------------------------------------------------------------------
  */
  const defaultNodeFontConfig = {
    'chord-letters': {
      'gentium plus': './src/drawer/font/chord-letters/GentiumPlus-Regular.ttf',
      'gothic a1': './src/drawer/font/music/Leland.otf'
    },
    'text': {
      'noto-serif': {
        'regular': './src/drawer/font/text/NotoSerif-Regular.ttf',
        'bold': './src/drawer/font/text/NotoSerif-Bold.ttf'
      },
      'noto-sans': {
        'regular': './src/drawer/font/text/NotoSans-Regular.ttf',
        'bold': './src/drawer/font/text/NotoSans-Bold.ttf'
      }
    },
    'music': {
      'bravura': {
        'font': './src/drawer/font/music/Bravura.otf',
        'js': '#unilang/drawer/font/music-js/bravura.js'
      },
      'leland': {
        'font': './src/drawer/font/music/Leland.otf',
        'js': '#unilang/drawer/font/music-js/leland.js'
      }
    }
  }

  /*
  --------------------------------------------------------------------------------------------------
  BUILD THE BASE CONFIG ACCORDING TO ENVIRONMENT
  --------------------------------------------------------------------------------------------------

  - In Node.js:
      Start with defaultNodeFontConfig and then apply user overrides.

  - In Browser:
      User MUST provide full `fontConfig`.
      We start with empty categories because defaults do not apply.
  --------------------------------------------------------------------------------------------------
  */
  let finalFontConfig

  if (isBrowser) {
    // Browser cannot use default local paths
    if (!fontConfig) {
      throw new Error(`
In browser environment you MUST provide a full 'fontConfig'.
Local relative paths such as "./src/drawer/font/*.ttf" cannot be loaded by the browser.

Provide a complete configuration with absolute or server-hosted URLs.
A full example:

{
  "chord-letters": {
    "gentium plus": "https://example.com/fonts/GentiumPlus-Regular.ttf",
    "gothic a1":    "https://example.com/fonts/GothicA1-Regular.ttf"
  },

  "text": {
    "noto-serif": {
      "regular": "https://cdn.example.com/fonts/NotoSerif-Regular.ttf",
      "bold":    "https://cdn.example.com/fonts/NotoSerif-Bold.ttf"
    },
    "noto-sans": {
      "regular": "https://cdn.example.com/fonts/NotoSans-Regular.ttf",
      "bold":    "https://cdn.example.com/fonts/NotoSans-Bold.ttf"
    }
  },

  "music": {
    "bravura": {
      "font": "https://example.com/music-fonts/Bravura.otf",
      "js":   "#unilang/drawer/font/music-js/bravura.js"
    },
    "leland": {
      "font": "https://example.com/music-fonts/Leland.otf",
      "js":   "#unilang/drawer/font/music-js/leland.js"
    }
  }
}

Every path must be a valid URL, not a local filesystem path.
`)
    }

    // Start with completely empty config (browser requires explicit definitions)
    finalFontConfig = {
      'chord-letters': {},
      'text': {},
      'music': {}
    }

  } else {
    // Node.js — initialize with fully working default config
    finalFontConfig = structuredClone(defaultNodeFontConfig)
  }

  /*
  --------------------------------------------------------------------------------------------------
  VALIDATE & APPLY USER CONFIG (if present)
  --------------------------------------------------------------------------------------------------

  The user can override:
    - chord-letters (simple name → path)
    - text (name → {regular, bold})
    - music (name → {font, js})

  Browser: this step fills the empty config.
  Node.js: this merges with defaults.
  --------------------------------------------------------------------------------------------------
  */

  // chord-letters override
  if (fontConfig && fontConfig['chord-letters']) {
    assert(
      isPlainObject(fontConfig['chord-letters']),
      "fontConfig['chord-letters'] must map fontName → URL/path"
    )
    finalFontConfig['chord-letters'] = fontConfig['chord-letters']
  }

  // text override
  if (fontConfig && fontConfig['text']) {
    assert(
      isPlainObject(fontConfig['text']),
      "fontConfig['text'] must map name → {regular, bold}"
    )

    for (const [fontName, fontPaths] of Object.entries(fontConfig['text'])) {
      assert(isPlainObject(fontPaths),
        `fontConfig['text']['${fontName}'] must be {regular, bold}`)
      assert(fontPaths['regular'], `"regular" missing for text font '${fontName}'`)
      assert(fontPaths['bold'], `"bold" missing for text font '${fontName}'`)
    }

    finalFontConfig['text'] = fontConfig['text']
  }

  // music override
  if (fontConfig && fontConfig['music']) {
    assert(
      isPlainObject(fontConfig['music']),
      "fontConfig['music'] must map name → {font, js}"
    )

    for (const [fontName, fontPaths] of Object.entries(fontConfig['music'])) {
      assert(isPlainObject(fontPaths),
        `fontConfig['music']['${fontName}'] must contain {font, js}`)
      assert(fontPaths['font'], `"font" missing for music font '${fontName}'`)
      assert(fontPaths['js'], `"js" missing for music font '${fontName}'`)
    }

    finalFontConfig['music'] = fontConfig['music']
  }

  /*
  --------------------------------------------------------------------------------------------------
  EXTRACT FILE PATHS IN DETERMINISTIC ORDER
  --------------------------------------------------------------------------------------------------
  The loading order is extremely important for deterministic output:

      1. chord-letter fonts
      2. text regular fonts
      3. text bold fonts
      4. music fonts (OpenType)
      5. music JS schemas (loaded separately)

  This guarantees:
  - same font indexes across environments
  - reproducible SVG + MIDI tests
  --------------------------------------------------------------------------------------------------
  */

  const chordLetterFontPaths = Object.values(finalFontConfig['chord-letters'])
  const textRegularFontPaths = Object.values(finalFontConfig['text']).map(f => f['regular'])
  const textBoldFontPaths = Object.values(finalFontConfig['text']).map(f => f['bold'])
  const musicFontPaths = Object.values(finalFontConfig['music']).map(f => f['font'])
  const jsMusicFonts = Object.values(finalFontConfig['music']).map(f => f['js'])

  /*
  --------------------------------------------------------------------------------------------------
  LOAD ALL FONT FILES WITH OPENTYPE.JS
  --------------------------------------------------------------------------------------------------
  opentype.load(pathOrUrl) works in both:
    - Node.js (filesystem)
    - Browser (URLs)

  We load fonts exactly in the order defined above.
  --------------------------------------------------------------------------------------------------
  */

  const fontSources = await Promise.all(
    [
      ...chordLetterFontPaths,
      ...textRegularFontPaths,
      ...textBoldFontPaths,
      ...musicFontPaths
    ].map(p => opentype.load(p))
  )

  /*
  --------------------------------------------------------------------------------------------------
  LOAD MUSIC JS FONT SCHEMA MODULES
  --------------------------------------------------------------------------------------------------
  These modules contain the glyph definition tables used by Unilang's
  engraving engine. They must align 1:1 with musicFontPaths.
  --------------------------------------------------------------------------------------------------
  */

  const jsMusicFontSources = await Promise.all(
    jsMusicFonts.map(f => import(f))
  )

  /*
  --------------------------------------------------------------------------------------------------
  BUILD FINAL FONT SOURCE TREE (OUTPUT STRUCTURE)
  --------------------------------------------------------------------------------------------------
  Shape of return value:

  {
    "chord-letters": { fontName: opentypeFontObject },
    "text": {
       "regular": { familyName: opentypeFontObject },
       "bold":    { familyName: opentypeFontObject }
    },
    "music": { fontName: opentypeFontObject },
    "music-js": { fontName: glyphSchemaObject }
  }

  This structure is what the Unilang drawer/renderer consumes.
  --------------------------------------------------------------------------------------------------
  */

  const supportedFontsSourcesConfig = {
    'chord-letters': {},
    'music': {},
    'music-js': {},
    'text': { 'regular': {}, 'bold': {} }
  }

  const chordLetterFontNames = Object.keys(finalFontConfig['chord-letters'])
  const textFontNames = Object.keys(finalFontConfig['text'])
  const musicFontNames = Object.keys(finalFontConfig['music'])

  let fontSourcesAssignCount = 0

  // Assign chord-letter fonts
  for (let name of chordLetterFontNames) {
    supportedFontsSourcesConfig['chord-letters'][name] =
      fontSources[fontSourcesAssignCount++]
  }

  // Assign text regular
  for (let name of textFontNames) {
    supportedFontsSourcesConfig['text']['regular'][name] =
      fontSources[fontSourcesAssignCount++]
  }

  // Assign text bold
  for (let name of textFontNames) {
    supportedFontsSourcesConfig['text']['bold'][name] =
      fontSources[fontSourcesAssignCount++]
  }

  // Assign music fonts + JS schemas
  let jsIndex = 0
  for (let name of musicFontNames) {
    supportedFontsSourcesConfig['music'][name] =
      fontSources[fontSourcesAssignCount++]

    supportedFontsSourcesConfig['music-js'][name] =
      jsMusicFontSources[jsIndex++].default
  }

  return supportedFontsSourcesConfig
}



// ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
//               HELPERS
// ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆

function isPlainObject(o) {
  return o !== null && typeof o === 'object' && o.constructor === Object
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed")
}
