import opentype from '#unilang/drawer/lib/opentype/opentype.js'
import parsedUnilang from '#unilang/language/parser/parsedUnilang.js'
import generatedStyles from '#unilang/drawer/generatedStyles.js'
import svgAsString from '#unilang/drawer/elements/basic/svgAsString.js'
import svg from '#unilang/drawer/elements/basic/svg.js'
import page from '#unilang/drawer/elements/page/page.js'
import midi from '#unilang/midi/midi.js'

/**
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *                1. setupFonts
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *
 * Load and initialize fonts for Unilang (music, text, and chord-letter fonts),
 * with strict differentiation between **Node.js** and **browser** environments.
 *
 * This function guarantees:
 * - deterministic load order
 * - reproducibility across environments
 * - consistent SVG & MIDI rendering
 *
 * -----------------------------------------------------------------------------------------------
 * @function setupFonts
 * @async
 * @param {Object} fontConfig
 *        User-provided font configuration. Required in browser, optional in Node.
 *
 * -----------------------------------------------------------------------------------------------
 * @overview ENVIRONMENT BEHAVIOR
 * -----------------------------------------------------------------------------------------------
 * **Node.js**
 * - Local filesystem paths are supported.
 * - Default font paths are automatically included.
 * - User `fontConfig` may override the defaults.
 *
 * **Browser**
 * - Local paths (./src/...) do NOT work.
 * - User MUST provide full URLs for every font.
 * - Default Node paths are completely ignored.
 * - JS glyph schemas must be valid ESM modules.
 *
 * -----------------------------------------------------------------------------------------------
 * @typedef {Object} FontConfig
 * @property {Object.<string,string>} chord-letters
 *        Map: fontName → path/URL to `.ttf` font.
 *
 * @property {Object.<string,TextFontEntry>} text
 *        Map: fontFamily → { regular, bold } paths.
 *
 * @property {Object.<string,MusicFontEntry>} music
 *        Map: musicFont → { font, js } where `js` is an ESM module path.
 *
 * -----------------------------------------------------------------------------------------------
 * @typedef {Object} TextFontEntry
 * @property {string} regular  Path/URL to regular `.ttf`.
 * @property {string} bold     Path/URL to bold `.ttf`.
 *
 * -----------------------------------------------------------------------------------------------
 * @typedef {Object} MusicFontEntry
 * @property {string} font  Path/URL to `.otf` SMuFL music font.
 * @property {string} js    Path/URL to music JS schema (ESM).
 *
 * -----------------------------------------------------------------------------------------------
 * @example Node.js fontConfig
 * {
 *   "chord-letters": {
 *     "gentium plus": "./src/drawer/font/chord-letters/GentiumPlus-Regular.ttf",
 *     "gothic a1":     "./src/drawer/font/music/Leland.otf"
 *   },
 *   "text": {
 *     "noto-serif": {
 *       "regular": "./src/drawer/font/text/NotoSerif-Regular.ttf",
 *       "bold":    "./src/drawer/font/text/NotoSerif-Bold.ttf"
 *     }
 *   },
 *   "music": {
 *     "bravura": {
 *       "font": "./src/drawer/font/music/Bravura.otf",
 *       "js":   "#unilang/drawer/font/music-js/bravura.js"
 *     }
 *   }
 * }
 *
 * -----------------------------------------------------------------------------------------------
 * @example Browser fontConfig
 * {
 *   "chord-letters": {
 *     "gentium plus": "https://cdn.example.com/fonts/GentiumPlus-Regular.ttf"
 *   },
 *   "text": {
 *     "noto-serif": {
 *       "regular": "https://cdn.example.com/fonts/NotoSerif-Regular.ttf",
 *       "bold":    "https://cdn.example.com/fonts/NotoSerif-Bold.ttf"
 *     }
 *   },
 *   "music": {
 *     "leland": {
 *       "font": "https://example.com/music/Leland.otf",
 *       "js":   "#unilang/drawer/font/music-js/leland.js"
 *     }
 *   }
 * }
 *
 * -----------------------------------------------------------------------------------------------
 * @returns {Promise<SupportedFonts>}
 * A fully resolved, deterministic font structure used by the Unilang renderer.
 *
 * -----------------------------------------------------------------------------------------------
 * @typedef {Object} SupportedFonts
 * @property {Object.<string,OpentypeFont>} chord-letters
 * @property {Object} text
 * @property {Object.<string,OpentypeFont>} text.regular
 * @property {Object.<string,OpentypeFont>} text.bold
 * @property {Object.<string,OpentypeFont>} music
 * @property {Object.<string,Object>} music-js Parsed JS glyph schema modules
 *
 * -----------------------------------------------------------------------------------------------
 * @description
 * Loading order is strictly enforced:
 *
 * 1. chord-letter fonts
 * 2. text regular fonts
 * 3. text bold fonts
 * 4. music fonts (OpenType)
 * 5. music JS schemas
 *
 * This ensures:
 * - stable font indexing
 * - reproducible SVG/MIDI output
 * - deterministic hash-based tests across environments
 *
 * -----------------------------------------------------------------------------------------------
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

/**
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *                            2. generatePageModels
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *
 * High-level convenience wrapper around the low-level `parsedUnilang()` engine.
 * It prepares the Unilang text, invokes the parser with correct defaults, and
 * extracts only the per-page rendering-related intermediate structures needed
 * by the drawer (SVG renderer), highlighting engine, and MIDI generator.
 *
 * This function is intentionally minimal: it does **not** produce SVG or MIDI.
 * Instead, it returns the *intermediate page IR*, which downstream components
 * (drawer, styles, MIDI engine, tests) can consume.
 *
 * ---------------------------------------------------------------------------
 * @async
 * @function generatePageModels
 *
 * @param {Object} params
 * @param {string} params.unilangPageText
 *        Unilang text for a single page. Multi-page inputs must already be
 *        split before calling this function.
 *
 * @param {boolean} [params.applyHighlighting=true]
 *        Controls whether highlighting instructions should be produced.
 *
 *        - `true`: highlighting is enabled
 *        - `false`: no highlighting logic is executed; the raw text is returned
 *                   as a single highlight block
 *
 * @param {boolean} [params.applyOnlyHighlightingWithoutRefIds=false]
 *        Enables “highlight-only mode” from inside `parsedUnilang()`:
 *
 *        - only `actionOnlyForHighlightingWithoutRefIds` of scenarios are run
 *        - NO reference IDs
 *        - NO pageSchema modifications
 *        - NO MIDI settings
 *        - NO command progression effects
 *
 *        This is perfect for editors or live preview UIs that want markup
 *        but not engraving/musical semantics.
 *
 * @param {Array<string>} [params.progressionOfCommandsFromScenarios=[]]
 *        Optional scenario progression seed.
 *
 *        This is normally left empty. It is primarily used by:
 *          - multi-page audio/visual tests
 *          - very advanced internal tooling
 *
 * @param {Object} [params.supportedFontNames]
 *        A stable list of supported font family names that `parsedUnilang()`
 *        attaches to `parserState.pageSchema.fonts`.
 *
 *        These are *names*, not loaded font sources.
 *
 *        Defaults match audio test expectations:
 *
 *        {
 *          'chord-letters': ['gentium plus', 'gothic a1'],
 *          'music': ['bravura', 'leland'],
 *          'text': ['noto-sans', 'noto-serif']
 *        }
 *
 *        Actual font loading is handled separately:
 *             setupFonts() → generatedStyles() → page() renderer
 *
 * ---------------------------------------------------------------------------
 * @returns {Promise<GeneratePageModelsResult>}
 *
 * Returns an object containing the **intermediate representation (IR)** for
 * a fully parsed Unilang page:
 *
 *   {
 *     pageSchema,           // engraving layout model
 *     highlightsHtmlBuffer, // highlighting fragments
 *     errors,               // parser/semantic errors
 *     customStyles,         // page-level style overrides
 *     midiSettings          // Unilang musical semantics
 *   }
 *
 * ---------------------------------------------------------------------------
 * @typedef {Object} GeneratePageModelsResult
 *
 * @property {Object} pageSchema
 *          The rendering/engraving model built by parsedUnilang:
 *            - measure & stave geometry
 *            - symbols, durations, directions
 *            - key/time signatures
 *            - connections, slurs, tuplets
 *            - positioning indexes
 *
 *          This structure is consumed by drawer/pages/page.js to produce SVG.
 *
 * @property {string[]} highlightsHtmlBuffer
 *          An array of HTML-safe fragments used for editor/highlighting layers.
 *          Must usually be `.join("")` before inserting.
 *
 * @property {Object[]} errors
 *          Structural, parsing, or semantic errors encountered while parsing.
 *          The pipeline is fault-tolerant: errors do not abort parsing.
 *
 * @property {Object} customStyles
 *          Any inline styling commands encountered in Unilang that override
 *          engraving parameters, spacing, fonts, color, etc. These feed into
 *          generatedStyles().
 *
 * @property {Object} midiSettings
 *          All musical-performance metadata extracted from Unilang commands:
 *            - tempo, pedal, dynamics
 *            - slurs, tuplets
 *            - staccato, accents
 *            - per-voice parameters
 *          These feed directly into the MIDI engine.
 *
 * ---------------------------------------------------------------------------
 * @description
 *
 * ### What generatePageModels() actually does
 * 1. Normalizes trailing newline behavior (required by parser mechanics).
 * 2. Passes configuration flags directly into parsedUnilang().
 * 3. Returns only the subset of the parsed output needed for:
 *      - SVG generation
 *      - highlight overlays
 *      - test comparisons
 *      - MIDI generation
 *
 * ### What is *not* done here
 *  - No SVG rendering
 *  - No MIDI file generation
 *  - No font loading
 *  - No multi-page splitting
 *
 * ### Why this exists
 * It provides a clean public API that hides the dozens of parser state fields,
 * command-progression internals, tokenizer behavior, and scenario engine
 * complexity inside parsedUnilang().
 *
 * What you get is the **stable, simplified IR** for one page.
 *
 * ---------------------------------------------------------------------------
 */
export async function generatePageModels({
  unilangPageText,
  applyHighlighting,
  applyOnlyHighlightingWithoutRefIds,
  progressionOfCommandsFromScenarios,
  supportedFontNames
}) {
  const {
    pageSchema,
    highlightsHtmlBuffer,
    errors,
    customStyles,
    midiSettings
  } = parsedUnilang(
    normalizeUnilangText(
      unilangPageText
    ),
    progressionOfCommandsFromScenarios || [],
    applyHighlighting || true,
    applyOnlyHighlightingWithoutRefIds || false,
    supportedFontNames || {
      'chord-letters': ['gentium plus', 'gothic a1'],
      'music': ['bravura', 'leland'],
      'text': ['noto-sans', 'noto-serif']
    }
  )
  return {
    pageSchema,
    highlightsHtmlBuffer,
    errors,
    customStyles,
    midiSettings
  }
} 

/**
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *                     3. generatePageStyles — Public API
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *
 * Build the complete engraving style environment for a Unilang page.
 *
 * This function is **synchronous**.
 *
 * It takes the `customStyles` produced earlier by `generatePageModels()`  
 * and merges them with the resolved font sources returned by `setupFonts()`.  
 *
 * The result is a deterministic, renderer-ready style configuration.
 *
 * ----------------------------------------------------------------------------
 * @function generatePageStyles
 *
 * @param {Object} params
 * @param {Object} params.customStyles
 *        Style block generated inside `generatePageModels()`.
 *        Typically contains:
 *        - chosen font names
 *        - page layout values
 *        - spacing multipliers
 *        - color overrides
 *        - engraving preferences
 *
 * @param {SupportedFonts} params.supportedFontsSourcesConfig
 *        Fully loaded font source tree returned by `setupFonts()`.
 *        Required structure:
 *        {
 *          music:      { fontName: opentypeFont },
 *          "music-js": { fontName: glyphSchemaModule },
 *          text: {
 *            regular:  { familyName: opentypeFont },
 *            bold:     { familyName: opentypeFont }
 *          },
 *          "chord-letters": {
 *            fontName: opentypeFont
 *          }
 *        }
 *
 * ----------------------------------------------------------------------------
 * @returns {Object} PageStyles
 *
 * A fully constructed engraving style dictionary containing:
 * - spacing constants
 * - stroke options
 * - text/chord/dynamic font settings
 * - engraving rules for ties, beams, slurs, tuplets, octave marks
 * - all distances derived proportionally from stave-line spacing
 * - glyph metrics from the selected SMuFL font
 *
 * This object is consumed directly by:
 *   - the SVG drawer (`page()`, `svg()`)
 *   - the MIDI module (tempo/dynamic rules)
 *
 * ----------------------------------------------------------------------------
 * @example Node.js usage with generatePageModels()
 *
 * const fonts = await setupFonts()
 *
 * const { customStyles } = await generatePageModels({
 *   unilangPageText
 * })
 *
 * const pageStyles = generatePageStyles({
 *   customStyles,
 *   supportedFontsSourcesConfig: fonts
 * })
 *
 * ----------------------------------------------------------------------------
 * @example Browser usage with generatePageModels()
 *
 * const fonts = await setupFonts({
 *   music: {
 *     leland: {
 *       font: "https://cdn/fonts/Leland.otf",
 *       js:   "#unilang/drawer/font/music-js/leland.js"
 *     }
 *   },
 *   text: {
 *     "noto-serif": {
 *       regular: "https://cdn/fonts/NotoSerif-Regular.ttf",
 *       bold:    "https://cdn/fonts/NotoSerif-Bold.ttf"
 *     }
 *   },
 *   "chord-letters": {
 *     "gentium plus": "https://cdn/fonts/GentiumPlus-Regular.ttf"
 *   }
 * })
 *
 * const { customStyles } = await generatePageModels({
 *   unilangPageText
 * })
 *
 * const pageStyles = generatePageStyles({
 *   customStyles,
 *   supportedFontsSourcesConfig: fonts
 * })
 *
 * ----------------------------------------------------------------------------
 * @description
 *
 * `generatePageStyles()` is **Stage 3** of the high-level Unilang API.
 * It transforms the `customStyles` produced by `generatePageModels()`
 * into the complete engraving style environment using the font sources
 * loaded by `setupFonts()`.
 *
 * The high-level pipeline is:
 *
 *   1. **Font setup → `setupFonts()`**  
 *      Loads fonts and returns a fully resolved
 *      `supportedFontsSourcesConfig`.
 *
 *   2. **Model generation → `generatePageModels()`**  
 *      Parses Unilang text and produces:
 *      - `pageSchema`
 *      - `customStyles`
 *      - `midiSettings`
 *      - `highlightsHtmlBuffer`
 *      - `errors`
 *
 *   3. **Style generation → `generatePageStyles()` (this function)**  
 *      Combines:
 *      - `customStyles` from Stage 2  
 *      - `supportedFontsSourcesConfig` from Stage 1  
 *      to produce the final engraving style object containing spacing rules,
 *      font assignments, stroke options, text sizes, offsets, and all
 *      rendering-related measurements.
 *
 *   4. **Rendering (SVG)**  
 *      See the rendering functions in the next section.
 *
 *   5. **MIDI generation**  
 *      See MIDI output functions further in the documentation.
 *
 * In short:  
 *   `setupFonts()` prepares fonts →  
 *   `generatePageModels()` prepares content →  
 *   `generatePageStyles()` prepares engraving.
 *
 * It does not perform rendering.  
 * It only consolidates layout, typographic, and engraving rules into one object.
 * 
 * ### Purpose
 * 
 * While `generatePageModels()` defines *what* to draw,  
 * `generatePageStyles()` defines *how* it should look.
 *
 * ----------------------------------------------------------------------------
 */
export function generatePageStyles({
  customStyles,
  supportedFontsSourcesConfig
}) {
  const cofiguratedStyles = generatedStyles({
    ...customStyles,
    fontSources: supportedFontsSources
  })
  return cofiguratedStyles
}

/**
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *                            4. generateSvgPage
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *
 * @function generateSvgPage
 *
 * @description
 * `generateSvgPage()` is **Stage 4** of the high-level Unilang API.
 * It takes the logical page structure from `generatePageModels()` (Stage 2)
 * and the engraving styles from `generatePageStyles()` (Stage 3), and
 * produces a **fully rendered SVG page**.
 *
 * This is the main entry point for turning Unilang page data
 * into a final, display-ready SVG string.
 *
 * Pipeline context:
 *
 *   1. Fonts → `setupFonts()`
 *   2. Models → `generatePageModels()`
 *   3. Styles → `generatePageStyles()`
 *   4. **SVG Rendering → `generateSvgPage()` ← this function**
 *   5. MIDI Rendering → see MIDI API section
 *
 *
 * @param {Object} params
 * @param {Object} params.pageSchema
 *        The structured musical layout produced by `generatePageModels()`.
 *        Contains all page lines, measures, units, symbol coordinates, etc.
 *
 * @param {Object} params.pageStyles
 *        The engraving style object returned by `generatePageStyles()`,
 *        containing spacing rules, font sources, stroke rules, offsets,
 *        line thicknesses, and all geometry required for drawing.
 *
 * @param {number} [params.top=0]
 *        Top offset (in SVG units). Useful when positioning multiple pages
 *        inside a larger SVG or a combined score.
 *
 * @param {number} [params.left=0]
 *        Left offset (in SVG units).
 *
 *
 * @returns {string}
 *          A complete SVG string representing the fully engraved page.
 *
 *
 * @example
 * // High-level rendering pipeline:
 *
 * const fonts = await setupFonts()
 *
 * const {
 *   pageSchema,
 *   customStyles
 * } = generatePageModels({ unilangPageText, supportedFontNames: fonts })
 *
 * const pageStyles = generatePageStyles({
 *   customStyles,
 *   supportedFontsSourcesConfig: fonts
 * })
 *
 * const svgPage = generateSvgPage({
 *   pageSchema,
 *   pageStyles,
 *   top: 0,
 *   left: 0
 * })
 *
 * // svgPage now contains a full SVG of the rendered score page.
 */
export function generateSvgPage({
  pageSchema,
  pageStyles,
  top,
  left
}) {
  return svgAsString(
    svg(
      page(
        pageSchema
      )(pageStyles, top, left)
    )
  )
}

/**
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *                            5. generatePageMidi
 * ⟅━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⟆
 *
 * @function generatePageMidi
 *
 * @description
 * `generatePageMidi()` is **Stage 5** of the high-level Unilang rendering API.
 * It receives the musical structure (`pageSchema`) created by
 * `generatePageModels()` along with per-page MIDI configuration
 * (`midiSettings`) and converts them into a **MIDI playback object**.
 *
 * This is the final step in the Unilang pipeline that produces
 * machine-readable audio data suitable for playback, exporting, syncing with
 * notation, or feeding into other applications.
 *
 * High-level API pipeline:
 *
 *   1. Fonts → `setupFonts()`
 *   2. Models → `generatePageModels()`
 *   3. Styles → `generatePageStyles()`
 *   4. SVG Rendering → `generateSvgPage()` (see SVG docs)
 *   5. **MIDI Rendering → `generatePageMidi()` ← this function**
 *
 *
 * @param {Object} params
 *
 * @param {Object} params.pageSchema
 *        The structured musical model for the page — measures, voices, units,
 *        durations, articulations, and all temporal information needed to
 *        compute final audio playback. Produced by `generatePageModels()`.
 *
 * @param {Object} params.midiSettings
 *        MIDI metadata extracted during `generatePageModels()`: tempo defaults,
 *        pedal behavior, articulation overrides, playback options, and
 *        per-page MIDI parameters.
 *
 *
 * @returns {Object}
 *          A MIDI result object produced by the low-level internal `midi()`
 *          engine. It provides raw MIDI bytes **plus lookup maps** for audio ↔
 *          engraving synchronization.
 *
 *          Properties:
 *
 *          - **data**  
 *            A `Uint8Array` (browser) or `Buffer` (Node.js) containing the raw
 *            MIDI binary. This is the actual audio payload that can be saved
 *            as `.mid`, streamed, or passed directly to a MIDI player.
 *
 *          - **timeStampsMappedWithRefsOn**  
 *            A forward-lookup map:  
 *            `{ [timestampInSeconds]: string[] }`  
 *            For each playback timestamp, lists all Unilang reference IDs
 *            (note heads) that *become active* at that
 *            moment.  
 *            Used for:
 *            - cursor-following  
 *            - real-time highlighting  
 *            - synchronizing SVG engraving with audio
 *
 *          - **refsOnMappedWithTimeStamps**  
 *            A reverse-lookup map:  
 *            `{ [refId: string]: timestampInSeconds }`  
 *            For any engraved element (notehead, articulation, slur), tells you
 *            precisely *when* it starts sounding.  
 *            Used for:
 *            - clicking notation → jumping audio  
 *            - selecting a note in UI and auto-scrolling the player  
 *            - building interactive practice tools
 *
 *          Both maps allow the UI to maintain **perfect bidirectional sync**
 *          between SVG engraving and the generated MIDI playback.
 *
 *
 * @example
 * // High-level pipeline example
 *
 * const fonts = await setupFonts();
 *
 * const {
 *   pageSchema,
 *   midiSettings,
 *   customStyles
 * } = generatePageModels({ unilangPageText, supportedFontNames: fonts });
 *
 * const pageStyles = generatePageStyles({
 *   customStyles,
 *   supportedFontsSourcesConfig: fonts
 * });
 *
 * const svgPage = generateSvgPage({
 *   pageSchema,
 *   pageStyles
 * });
 *
 * const midiPage = generatePageMidi({
 *   pageSchema,
 *   midiSettings
 * });
 *
 * // midiPage.data → raw MIDI bytes (Uint8Array/Buffer)
 * // midiPage.timeStampsMappedWithRefsOn → audio → engraving sync
 * // midiPage.refsOnMappedWithTimeStamps → engraving → audio sync
 */
export function generatePageMidi({
  pageSchema,
  midiSettings
}) {
  return midi(
    pageSchema,
    [ midiSettings ]
  )
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

function normalizeUnilangText(unilangText) {
  if (unilangText[unilangText.length - 1] === NEW_LINE) {
    unilangText += NEW_LINE
  }
  return unilangText
}
