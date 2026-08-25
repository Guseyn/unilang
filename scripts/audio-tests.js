import fs from 'fs/promises'
import path from 'path'
import assert from 'assert'

// API
import {
  setupFonts,
  generateIntermediateStructuresForMultiplePages,
  areAllPageSchemasValid,
  generateStylesForMultiplePages,
  generateMidiForMultiplePages,
  generateSvgForMultiplePages,
} from '#msq/api.js'

const PAGE_DELIMITER = '====next page===='
const EMPTY_STRING = ''

const audioTests = (
  await fs.readdir(
    'audio-tests',
    { withFileTypes: true }
  )
).filter(at => {
  return at.isDirectory()
}).map(at => at.name)

await runAudioTest()

function green(str) {
  return `\x1b[32m${str}\x1b[0m`
}

function red(str) {
  return `\x1b[31m${str}\x1b[0m`
}

async function runAudioTest() {
  const listOfMSQInputFiles = await fs.readdir(`audio-tests/msq`)
  const listOfFailedTests = []
  const listOfPassedTests = []
  console.time('Total time spent for audio tests')

  const supportedFontSources = await setupFonts()

  const supportedFontNames = {
    'chord-letters': Object.keys(supportedFontSources['chord-letters']),
    'music': Object.keys(supportedFontSources['music']),
    'text': [
      ...new Set([
        ...Object.keys(supportedFontSources['text']['regular']),
        ...Object.keys(supportedFontSources['text']['bold'])
      ])
    ]
  }

  for (const msqInputFile of listOfMSQInputFiles) {
    const testName = path.basename(msqInputFile).split('.')[0]
    const msqInputFileFullPath = `audio-tests/msq/${msqInputFile}`
    const text = (await fs.readFile(msqInputFileFullPath, 'utf-8'))

    const multiplePagesText = text.split(PAGE_DELIMITER)

    const {
      pageSchemaForEachPage,
      htmlHighlightsForEachPage,
      errorsForEachPage,
      customStylesForEachPage,
      midiSettingsForEachPage
    } = generateIntermediateStructuresForMultiplePages({
      multiplePagesText,
      supportedFontNames
    })

    if (!areAllPageSchemasValid(pageSchemaForEachPage)) {
      throw new Error('Some of the page schemas are not valid')
    }

    const pageStylesForEachPage = generateStylesForMultiplePages({
      customStylesForEachPage,
      supportedFontSources
    })
    const allSvgPages = generateSvgForMultiplePages({
      pageSchemaForEachPage,
      pageStylesForEachPage
    })
    const htmlHighlightsForAllPages = htmlHighlightsForEachPage.map(
      htmlHighlightsForSinglePage => htmlHighlightsForSinglePage.join(EMPTY_STRING)
    ).join(PAGE_DELIMITER)
    const midiForAllPages = generateMidiForMultiplePages({
      pageSchemaForEachPage,
      midiSettingsForEachPage
    })

    const stringifiedPageSchema = JSON.stringify(pageSchemaForEachPage)
    const stringifiedErrors = JSON.stringify(errorsForEachPage)
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
        allSvgPages,
        expectedSvgAsString,
        `${red('Failed')} for "${testName}" test`
      )
      process.stdout.write(`"${testName}" ${green('passed')} for ${testType}\n`)
      testType = 'html highlights'
      assert.strictEqual(
        htmlHighlightsForAllPages,
        expectedStringifiedHtmlHighlights,
        `${red('Failed')} for "${testName}" test`
      )
      process.stdout.write(`"${testName}" ${green('passed')} for ${testType}\n`)
      testType = 'page schema'
      assert.strictEqual(
        stringifiedPageSchema,
        expectedStringifiedPageSchema,
        `${red('Failed')} for "${testName}" test`
      )
      process.stdout.write(`"${testName}" ${green('passed')} for ${testType}\n`)
      testType = 'errors'
      assert.strictEqual(
        stringifiedErrors,
        expectedStringifiedErrors,
        `${red('Failed')} for "${testName}" test`
      )
      process.stdout.write(`"${testName}" ${green('passed')} for ${testType}\n`)
      testType = 'midi'
      assert.strictEqual(
        Buffer.compare(
          midiData,
          expectedMidiData
        ),
        0,
        `${red('Failed')} for "${testName}" test`
      )
      process.stdout.write(`"${testName}" ${green('passed')} for ${testType}\n\n`)
      listOfPassedTests.push({
        name: testName
      })
    } catch (error) {
      process.stdout.write(`"${testName}" ${red('failed')} for ${testType}\n\n`)
      listOfFailedTests.push({
        name: testName
      })
    } finally {
      await Promise.race(
        [
          fs.writeFile(`audio-tests/svg/actual/${testName}.svg`, allSvgPages),
          fs.writeFile(`audio-tests/page-schema/actual/${testName}.json`, stringifiedPageSchema),
          fs.writeFile(`audio-tests/html-highlights/actual/${testName}.html`, htmlHighlightsForAllPages),
          fs.writeFile(`audio-tests/errors/actual/${testName}.json`, stringifiedErrors),
          fs.writeFile(`audio-tests/midi/actual/${testName}.mid`, midiData)
        ]
      )
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
