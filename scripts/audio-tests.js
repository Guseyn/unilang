import fs from 'fs/promises'
import path from 'path'
import assert from 'assert'

import colors from 'ansi-colors'

import parsedUnilang from '#unilang/language/parser/parsedUnilang.js'
import validatedPageSchema from '#unilang/language/schema/validatedPageSchema.js'
import svgAsString from '#unilang/drawer/elements/basic/svgAsString.js'
import generatedStyles from '#unilang/drawer/generatedStyles.js'
import svg from '#unilang/drawer/elements/basic/svg.js'
import page from '#unilang/drawer/elements/page/page.js'
import midi from '#unilang/midi/midi.js'

import opentype from '#unilang/drawer/lib/opentype/opentype.js'

const PAGE_DELIMITER = '====next page===='
const NEW_LINE = '\n'
const EMPTY_STRING = ''

import bravuraJS from '#unilang/drawer/font/music-js/bravura.js'
import lelandJS from '#unilang/drawer/font/music-js/leland.js'

function normalizeUnilangText(unilangText) {
  if (unilangText[unilangText.length - 1] === NEW_LINE) {
    unilangText += NEW_LINE
  }
  return unilangText
}

;(async function() {
  const audioTests = (
    await fs.readdir(
      'audio-tests',
      { withFileTypes: true }
    )
  ).filter(vt => {
    return vt.isDirectory()
  }).map(vt => vt.name)

  await runAudioTest()

  async function runAudioTest() {
    const listOfUnilangInputFiles = await fs.readdir(`audio-tests/unilang`)
    const listOfFailedTests = []
    const listOfPassedTests = []
    console.time('Total time spent for audio tests')

    const supportedFonts = {
      'chord-letters': ['gentium plus', 'gothic a1'],
      'music': ['bravura', 'leland'],
      'text': ['noto-sans', 'noto-serif']
    }

    const [
      bravura,
      leland,
      gentiumPlus,
      gothicA1,
      notoSansRegular,
      notoSansBold,
      notoSerifRegular,
      notoSerifBold
    ] = await Promise.all([
      opentype.load('./drawer/font/music/Bravura.otf'),
      opentype.load('./drawer/font/music/Leland.otf'),
      opentype.load('./drawer/font/chord-letters/GentiumPlus-Regular.ttf'),
      opentype.load('./drawer/font/chord-letters/GothicA1-Regular.ttf'),
      opentype.load('./drawer/font/text/NotoSans-Regular.ttf'),
      opentype.load('./drawer/font/text/NotoSans-Bold.ttf'),
      opentype.load('./drawer/font/text/NotoSerif-Regular.ttf'),
      opentype.load('./drawer/font/text/NotoSerif-Bold.ttf')
    ])

    const supportedFontsSources = {
      'chord-letters': {
        'gentium plus': gentiumPlus,
        'gothic a1': gothicA1
      },
      'music': {
        'bravura': bravura,
        'leland': leland
      },
      'music-js': {
        'bravura': bravuraJS,
        'leland': lelandJS
      },
      'text': {
        'regular': {
          'noto-serif': notoSerifRegular,
          'noto-sans': notoSansRegular
        },
        'bold': {
          'noto-serif': notoSerifBold,
          'noto-sans': notoSansBold
        }
      }
    }

    for (const unilangInputFile of listOfUnilangInputFiles) {
      const testName = path.basename(unilangInputFile).split('.')[0]
      const unilangInputFileFullPath = `audio-tests/unilang/${unilangInputFile}`
      const unilangText = (await fs.readFile(unilangInputFileFullPath, 'utf-8'))

      const unilangTextSplittedInPages = unilangText.split(PAGE_DELIMITER)

      const measuresParamsForAllPages = []
      const midiSettingsForEachPage = []
      const allSvgPages = []
      let currentPageTopOffset = 0
      const verticalDistanceBetweenPages = 15
      const htmlHighlightsForAllPages = []
      const errorsForAllPages = []

      unilangTextSplittedInPages.forEach((unilangTextForCurrentPage, pageIndex) => {
        const thisIsLastPage = pageIndex === unilangTextSplittedInPages.length - 1
        const unilangText = normalizeUnilangText(
          unilangTextForCurrentPage
        )

        const { pageSchema, highlightsHtmlBuffer, errors, customStyles, midiSettings } = parsedUnilang(
          unilangText,
          [],
          true,
          false,
          supportedFonts
        )

        try {
          assert.ok(
            validatedPageSchema(pageSchema),
            `Failed for ${unilangInputFileFullPath} test`
          )
        } catch (error) {
          process.stdout.write('\n')
          throw new Error(`page schema for "${unilangInputFileFullPath}" is not valid`)
        }

        if (pageSchema && pageSchema.measuresParams) {
          pageSchema.measuresParams.forEach((measureParams, measureIndex) => {
            measureParams.pageIndex = pageIndex
            measureParams.measureIndexOnPage = measureIndex
          })
          measuresParamsForAllPages.push(...pageSchema.measuresParams)
          midiSettingsForEachPage.push(midiSettings)
        }
        const cofiguratedStyles = generatedStyles({
          ...customStyles,
          fontSources: supportedFontsSources
        })
        const svgPage = page(
          pageSchema
        )(cofiguratedStyles, 0, currentPageTopOffset)
        currentPageTopOffset = svgPage.bottom + verticalDistanceBetweenPages
        allSvgPages.push(svgPage)
        htmlHighlightsForAllPages.push(
          highlightsHtmlBuffer.join(EMPTY_STRING)
        )
        if (!thisIsLastPage) {
          htmlHighlightsForAllPages.push(
            PAGE_DELIMITER
          )
        }
        errorsForAllPages.push(errors)
      })

      const pageSchemaForAllPages = {
        measuresParams: measuresParamsForAllPages
      }
      const svgPagesAsString = svgAsString(
        svg(...allSvgPages)
      )
      const joinedHtmlHighlightsForAllPages = htmlHighlightsForAllPages.join(EMPTY_STRING)
      const midiForAllPages = midi(
        pageSchemaForAllPages,
        midiSettingsForEachPage
      )

      const stringifiedPageSchema = JSON.stringify(pageSchemaForAllPages)
      const stringifiedHtmlHighlights = joinedHtmlHighlightsForAllPages
      const stringifiedErrors = JSON.stringify(errorsForAllPages)
      const midiData = midiForAllPages.data

      const [
        expectedSvgAsString,
        expectedStringifiedPageSchema,
        expectedStringifiedHtmlHighlights,
        expectedStringifiedErrors,
        expectedMidiData
      ] = await Promise.all(
        [
          fs.readFile(`audio-tests/svg/expected/${testName}.svg`, 'utf-8'),
          fs.readFile(`audio-tests/page-schema/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`audio-tests/html-highlights/expected/${testName}.html`, 'utf-8'),
          fs.readFile(`audio-tests/errors/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`audio-tests/midi/expected/${testName}.mid`, { encoding: null })
        ]
      )

      let testType
      try {
        testType = 'svg'
        assert.strictEqual(
          svgPagesAsString,
          expectedSvgAsString,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType}\n`)
        testType = 'html highlights'
        assert.strictEqual(
          stringifiedHtmlHighlights,
          expectedStringifiedHtmlHighlights,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType}\n`)
        testType = 'page schema'
        assert.strictEqual(
          stringifiedPageSchema,
          expectedStringifiedPageSchema,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType}\n`)
        testType = 'errors'
        assert.strictEqual(
          stringifiedErrors,
          expectedStringifiedErrors,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType}\n`)
        testType = 'midi'
        assert.strictEqual(
          Buffer.compare(
            midiData,
            expectedMidiData
          ),
          0,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType}\n`)
        await Promise.race(
          [
            fs.writeFile(`audio-tests/svg/actual/${testName}.svg`, svgPagesAsString),
            fs.writeFile(`audio-tests/page-schema/actual/${testName}.json`, stringifiedPageSchema),
            fs.writeFile(`audio-tests/html-highlights/actual/${testName}.html`, stringifiedHtmlHighlights),
            fs.writeFile(`audio-tests/errors/actual/${testName}.json`, stringifiedErrors),
            fs.writeFile(`audio-tests/midi/actual/${testName}.mid`, midiData)
          ]
        )
        listOfPassedTests.push({
          name: testName
        })
      } catch (error) {
        process.stdout.write(`"${testName}" ${colors.red('failed')} for ${testType}\n\n`)
        listOfFailedTests.push({
          name: testName
        })
      }
    }
    console.timeEnd(`Total time spent for audio tests`)
    await fs.writeFile(
      `audio-tests/list-of-failed-tests.json`,
      JSON.stringify(listOfFailedTests)
    )
    await fs.writeFile(
      `audio-tests/list-of-passed-tests.json`,
      JSON.stringify(listOfPassedTests)
    )
    if (listOfFailedTests.length > 0) {
      throw new Error(
        `There are (${listOfFailedTests.length})  failed audio tests. Please check http://127.0.0.1:8000/audio-tests/all-audio-tests.html\n\n`
      )
    } else {
      process.stdout.write(`All aduio tests passed. Please check http://127.0.0.1:8000/audio-tests/all-aduio-tests.html\n\n`)
    }
  }
})()
