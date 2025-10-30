'use strict'

const pageMeta = require('./static-objects/pageMeta')
const regexps = require('./static-objects/regexps')

const IS = 'is'
const EMPTY_STRING = ''
const NEW_LINE = '\n'

module.exports = (scenarios) => {
  scenarios['page meta'] = {
    startsOnNewLine: true,
    condition: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      return regexps.pageMeta.test(tokenValues) && currentToken.lastOnTheLine
    },
    action: (unitext, lineNumber, currentToken, tokenValues, joinedTokenValuesWithRealDelimiters, progressionOfCommandsFromScenarios, parserState) => {
      const match = regexps.pageMeta.match(tokenValues)
      const pageMetaName = match[0]
      const pageMetaKey = pageMeta[pageMetaName]
      const pageMetaValue = match[1]
      parserState.pageSchema[pageMetaKey] = pageMetaValue
      if (parserState.applyHighlighting) {
        parserState.highlightsHtmlBuffer.push(
          joinedTokenValuesWithRealDelimiters.replace(regexps.somethingIsSomethingWithDelimetersHighlight, (match, p1, p2, p3) => {
            if (p3.startsWith(IS)) {
              p3 = p3.replace(IS, EMPTY_STRING)
            }
            const p1WithTrimmedEnd = p1.trimEnd()
            const p3WithTrimmedStart = p3.trimStart()
            return `<span class="th" ref-id="${pageMetaKey}"><span class="eh" ref-id="${pageMetaKey}">${p1WithTrimmedEnd}</span>${p1.slice(p1WithTrimmedEnd.length)}${p2}${p3.slice(0, p3.length - p3WithTrimmedStart.length)}<span class="sth" ref-id="${pageMetaKey}">${p3WithTrimmedStart}</span></span>`
          })
        )
      }
    },
    actionOnlyForHighlightingWithoutRefIds: (parserState, joinedTokenValuesWithRealDelimiters, tokenValues) => {
      const wordIsFirstCharIndex = joinedTokenValuesWithRealDelimiters.indexOf(IS)
      const pageMetaNameAndValue = [ joinedTokenValuesWithRealDelimiters.slice(0, wordIsFirstCharIndex), joinedTokenValuesWithRealDelimiters.slice(wordIsFirstCharIndex + 2) ]
      const lastNewLineCharIndexInPageMetaName = pageMetaNameAndValue[0].lastIndexOf(NEW_LINE)
      const firstNewLineCharIndexInPageMetaValue = pageMetaNameAndValue[1].indexOf(NEW_LINE)
      if (lastNewLineCharIndexInPageMetaName === -1) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="eh">${pageMetaNameAndValue[0]}</span>${IS}`
        )
      } else {
        parserState.highlightsHtmlBuffer.push(
          `${pageMetaNameAndValue[0].slice(0, lastNewLineCharIndexInPageMetaName + 1)}<span class="eh">${pageMetaNameAndValue[0].slice(lastNewLineCharIndexInPageMetaName + 1)}</span>${IS}`
        )
      }
      if (firstNewLineCharIndexInPageMetaValue === -1) {
        parserState.highlightsHtmlBuffer.push(
          `<span class="sth">${pageMetaNameAndValue[1]}</span>`
        )
      } else {
        parserState.highlightsHtmlBuffer.push(
          `<span class="sth">${pageMetaNameAndValue[1].slice(0, firstNewLineCharIndexInPageMetaValue)}</span>${pageMetaNameAndValue[1].slice(firstNewLineCharIndexInPageMetaValue)}`
        )
      }
    },
    itIsNewCommandProgressionFromLevel: 0
  }
}
