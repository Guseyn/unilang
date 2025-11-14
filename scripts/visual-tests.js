import fs from 'fs/promises'
import path from 'path'
import assert from 'assert'

import parsedUnilang from '#unilang/language/parser/parsedUnilang.js'
import validatedPageSchema from '#unilang/language/schema/validatedPageSchema.js'
import svgAsString from '#unilang/drawer/elements/basic/svgAsString.js'
import generatedStyles from '#unilang/drawer/generatedStyles.js'
import svg from '#unilang/drawer/elements/basic/svg.js'
import page from '#unilang/drawer/elements/page/page.js'

import opentype from '#unilang/drawer/lib/opentype/opentype.js'

const NEW_LINE = '\n'

function normalizeUnilangText(unilangText) {
  if (unilangText[unilangText.length - 1] === NEW_LINE) {
    unilangText += NEW_LINE
  }
  return unilangText
}

import bravuraJS from '#unilang/drawer/font/music-js/bravura.js'
import lelandJS from '#unilang/drawer/font/music-js/leland.js'

;(async function() {
  const visualTestsForEachFont = (
    await fs.readdir(
      'visual-tests',
      { withFileTypes: true }
    )
  ).filter(vt => {
    return vt.isDirectory()
  }).map(vt => vt.name)

  for (const visualTestDirForFont of visualTestsForEachFont) {
    await runVisualTestForFont(visualTestDirForFont)
  }

  async function runVisualTestForFont(visualTestDirForFont) {
    const listOfUnilangInputFiles = await fs.readdir(`visual-tests/${visualTestDirForFont}/unilang`)
    const listOfFailedTests = []
    const listOfPassedTests = []
    console.time(`Total time spent for ${visualTestDirForFont}`)

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
      const unilangInputFileFullPath = `visual-tests/${visualTestDirForFont}/unilang/${unilangInputFile}`
      const unilangText = normalizeUnilangText(
        (await fs.readFile(unilangInputFileFullPath, 'utf-8'))
      )
      const {
        pageSchema,
        highlightsHtmlBuffer,
        errors,
        customStyles,
        comments,
        mapOfCharIndexesWithProgressionOfCommandsFromScenarios
      } = parsedUnilang(
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
      const constructedSvgAsString = svgAsString(
        svg(
          page(pageSchema)(
            generatedStyles(
              {
                ...customStyles,
                fontSources: supportedFontsSources
              }
            ), 0, 0
          )
        )
      )
      const stringifiedPageSchema = JSON.stringify(pageSchema)
      const stringifiedHtmlHighlights = highlightsHtmlBuffer.join('')
      const stringifiedErrors = JSON.stringify(errors)
      const stringifiedCustomStyles = JSON.stringify(customStyles)
      const stringifiedComments = JSON.stringify(comments)
      const stringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios = JSON.stringify(mapOfCharIndexesWithProgressionOfCommandsFromScenarios)

      const [
        expectedSvgAsString,
        expectedStringifiedPageSchema,
        expectedStringifiedHtmlHighlights,
        expectedStringifiedErrors,
        expectedStringifiedCustomStyles,
        expectedStringifiedComments,
        expectedStringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios
      ] = await Promise.all(
        [
          fs.readFile(`visual-tests/${visualTestDirForFont}/svg/expected/${testName}.svg`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/page-schema/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/html-highlights/expected/${testName}.html`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/errors/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/custom-styles/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/comments/expected/${testName}.json`, 'utf-8'),
          fs.readFile(`visual-tests/${visualTestDirForFont}/char-progressions/expected/${testName}.json`, 'utf-8')
        ]
      )

      let testType
      try {
        testType = 'svg'
        assert.strictEqual(
          constructedSvgAsString,
          expectedSvgAsString,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'html highlights'
        assert.strictEqual(
          stringifiedHtmlHighlights,
          expectedStringifiedHtmlHighlights,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'page schema'
        assert.strictEqual(
          stringifiedPageSchema,
          expectedStringifiedPageSchema,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'errors'
        assert.strictEqual(
          stringifiedErrors,
          expectedStringifiedErrors,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'custom styles'
        assert.strictEqual(
          stringifiedCustomStyles,
          expectedStringifiedCustomStyles,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'comments'
        assert.strictEqual(
          stringifiedComments,
          expectedStringifiedComments,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'map of char indexes with progression of commands from scenarios'
        assert.strictEqual(
          stringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios,
          expectedStringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" passed for ${testType} in ${visualTestDirForFont}\n\n`)
        listOfPassedTests.push({
          name: testName
        })
      } catch (error) {
        process.stdout.write(`"${testName}" failed for ${testType} in ${visualTestDirForFont}\n\n`)
        listOfFailedTests.push({
          name: testName
        })
      } finally {
        await Promise.race(
          [
            fs.writeFile(`visual-tests/${visualTestDirForFont}/svg/actual/${testName}.svg`, constructedSvgAsString),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/page-schema/actual/${testName}.json`, stringifiedPageSchema),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/html-highlights/actual/${testName}.html`, stringifiedHtmlHighlights),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/errors/actual/${testName}.json`, stringifiedErrors),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/custom-styles/actual/${testName}.json`, stringifiedCustomStyles),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/comments/actual/${testName}.json`, stringifiedComments),
            fs.writeFile(`visual-tests/${visualTestDirForFont}/char-progressions/actual/${testName}.json`, stringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios)
          ]
        )
      }
    }
    console.timeEnd(`Total time spent for ${visualTestDirForFont}`)
    await fs.writeFile(
      `visual-tests/${visualTestDirForFont}/list-of-failed-tests.json`,
      JSON.stringify(listOfFailedTests)
    )
    await fs.writeFile(
      `visual-tests/${visualTestDirForFont}/list-of-passed-tests.json`,
      JSON.stringify(listOfPassedTests)
    )
    if (listOfFailedTests.length > 0) {
      throw new Error(
        `There are (${listOfFailedTests.length}) failed visual tests for the ${visualTestDirForFont} font. Please check http://127.0.0.1:8000/visual-tests/${visualTestDirForFont}/all-visual-tests.html\n\n`
      )
    } else {
      process.stdout.write(`All visual tests passed for the ${visualTestDirForFont} font. Please check http://127.0.0.1:8000/visual-tests/${visualTestDirForFont}/all-visual-tests.html\n\n`)
    }
  }
})()
