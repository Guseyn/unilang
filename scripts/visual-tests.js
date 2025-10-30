const fs = require('fs/promises')
const path = require('path')
const assert = require('assert')

const colors = require('ansi-colors')

const parsedUnilang = require(`./../language/parser/parsedUnilang`)
const validatedPageSchema = require(`./../language/schema/validatedPageSchema`)
const svgAsString = require(`./../drawer/elements/basic/svgAsString`)
const generatedStyles = require(`./../drawer/generatedStyles`)
const svg = require(`./../drawer/elements/basic/svg`)
const page = require(`./../drawer/elements/page/page`)

const NEW_LINE = '\n'

function normalizeUnilangText(unilangText) {
  if (unilangText[unilangText.length - 1] === NEW_LINE) {
    unilangText += NEW_LINE
  }
  return unilangText
}

(async function() {
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
        false
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
              customStyles
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

      await Promise.all(
        [
          fs.writeFile(`visual-tests/${visualTestDirForFont}/svg/actual/${testName}.svg`, constructedSvgAsString),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/page-schema/actual/${testName}.json`, stringifiedPageSchema),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/html-highlights/actual/${testName}.html`, stringifiedHtmlHighlights),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/errors/actual/${testName}.json`, errors),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/custom-styles/actual/${testName}.json`, stringifiedCustomStyles),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/comments/actual/${testName}.json`, stringifiedComments),
          fs.writeFile(`visual-tests/${visualTestDirForFont}/char-progressions/actual/${testName}.json`, stringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios)
        ]
      )

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
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'html highlights'
        assert.strictEqual(
          stringifiedHtmlHighlights,
          expectedStringifiedHtmlHighlights,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'page schema'
        assert.strictEqual(
          stringifiedPageSchema,
          expectedStringifiedPageSchema,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'errors'
        assert.strictEqual(
          stringifiedErrors,
          expectedStringifiedErrors,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'custom styles'
        assert.strictEqual(
          stringifiedCustomStyles,
          expectedStringifiedCustomStyles,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'comments'
        assert.strictEqual(
          stringifiedComments,
          expectedStringifiedComments,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n`)
        testType = 'map of char indexes with progression of commands from scenarios'
        assert.strictEqual(
          stringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios,
          expectedStringifiedMapOfCharIndexesWithProgressionOfCommandsFromScenarios,
          `Failed for "${testName}" test`
        )
        process.stdout.write(`"${testName}" ${colors.cyan('passed')} for ${testType} in ${visualTestDirForFont}\n\n`)
        listOfPassedTests.push({
          name: testName
        })
      } catch (error) {
        process.stdout.write(`"${testName}" ${colors.red('failed')} for ${testType} in ${visualTestDirForFont}\n\n`)
        listOfFailedTests.push({
          name: testName
        })
      }
    }
    console.timeEnd(`Total time spent for ${visualTestDirForFont}`)
    if (listOfFailedTests.length > 0) {
      fs.writeFile(
        `visual-tests/${visualTestDirForFont}/list-of-failed-tests.json`,
        JSON.stringify(listOfFailedTests)
      )
    } else {
      fs.writeFile(
        `visual-tests/${visualTestDirForFont}/list-of-failed-tests.json`,
        JSON.stringify([])
      )
    }
    if (listOfPassedTests.length > 0) {
      fs.writeFile(
        `visual-tests/${visualTestDirForFont}/list-of-passed-tests.json`,
        JSON.stringify(listOfPassedTests)
      )
    } else {
      fs.writeFile(
        `visual-tests/${visualTestDirForFont}/list-of-passed-tests.json`,
        JSON.stringify([])
      )
    }
    if (listOfFailedTests.length > 0) {
      throw new Error(
        `There are some failed visual tests for the ${visualTestDirForFont} font. Please check http://127.0.0.1:8000/visual-tests/${visualTestDirForFont}/all-visual-tests.html\n\n`
      )
    } else {
      process.stdout.write(`All visual tests passed for the ${visualTestDirForFont} font. Please check http://127.0.0.1:8000/visual-tests/${visualTestDirForFont}/all-visual-tests.html\n\n`)
    }
  }
})()
