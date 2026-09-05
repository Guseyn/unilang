import textWidthInTextarea from '#msq/editor/textWidthInTextarea.js'
import createdElementWithStylesAndAttributes from '#msq/editor/createdElementWithStylesAndAttributes.js'
import highlightTextareaValueInDivUnderneathItWithoutRefIds from '#msq/editor/highlightTextareaValueInDivUnderneathItWithoutRefIds.js'
import listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios from '#msq/editor/listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios.js'
import isPrintableKeycode from '#msq/editor/isPrintableKeycode.js'

const isMacOS = navigator.platform.indexOf('Mac') !== -1

const noteNames = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ]
const delimeters = [ ',', ';' ]

const populateListOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn = (listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn, listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn, uncompletedWord, uncopleteWordEqualsToOneOfTheSuggestions) => {
  for (let wordIndex = 0; wordIndex < listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn.length; wordIndex++) {
    if (listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn[wordIndex].toLowerCase().trim() === uncompletedWord) {
      uncopleteWordEqualsToOneOfTheSuggestions.value = true
    }
    if (
      (
        (
          listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn[wordIndex].toLowerCase().startsWith(uncompletedWord) &&
          (listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn[wordIndex].toLowerCase().trim() !== uncompletedWord)
        ) || (uncompletedWord === '')
      ) &&
      (listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn.indexOf(listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn[wordIndex]) === -1)
    ) {
      listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn.push(
        listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn[wordIndex]
      )
    }
  }
}

const foundOptionsForUncompletedWord = (charIndexWhereCaretIsOn, listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios, uncompletedWord, caretInOnSpace, mapOfCharIndexesWithProgressionOfCommandsFromScenarios) => {
  const uncopleteWordEqualsToOneOfTheSuggestions = {
    value: false
  }
  if (uncompletedWord.length > 1 || (noteNames.indexOf(uncompletedWord) === -1)) {
    const listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn = []
    if (!caretInOnSpace) {
      const progressionOfCommandsFromScenariosRelatedToPositionWhereCaretIsIn = mapOfCharIndexesWithProgressionOfCommandsFromScenarios[charIndexWhereCaretIsOn] || mapOfCharIndexesWithProgressionOfCommandsFromScenarios[charIndexWhereCaretIsOn - 1]
      if (progressionOfCommandsFromScenariosRelatedToPositionWhereCaretIsIn) {
        for (let commandName in listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios) {
          if (progressionOfCommandsFromScenariosRelatedToPositionWhereCaretIsIn.indexOf(commandName) !== -1) {
            const listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn = listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios[commandName]
            populateListOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn(
              listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn,
              listOfPossibleOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn,
              uncompletedWord,
              uncopleteWordEqualsToOneOfTheSuggestions
            )
          }
        }
      }
      if (listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn.length === 0 && !uncopleteWordEqualsToOneOfTheSuggestions.value) {
        const listOfPossibleOptionsFromGeneralSectionToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn = listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios['general']
        uncopleteWordEqualsToOneOfTheSuggestions.value = false
        populateListOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn(
          listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn,
          listOfPossibleOptionsFromGeneralSectionToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn,
          uncompletedWord,
          uncopleteWordEqualsToOneOfTheSuggestions
        )
      }
    }
    return listOfActualOptionsToCompleteWordForCommandProgressionRelatedToPositionWhereCaretIsIn.sort((optionBefore, optionAfter) => {
      return optionBefore.length - optionAfter.length || optionBefore.localeCompare(optionAfter)
    })
  }
  return []
}

const fillAutocompleteListViewWithOptionsForUncompletedWord = (uncompletedWord, autocompleteListView, optionsForUncompletedWord) => {
  autocompleteListView.innerHTML = ''
  autocompleteListView.optionIndex = 0
  optionsForUncompletedWord.forEach((optionTextValue, optionIndex) => {
    const optionElement = createdElementWithStylesAndAttributes(
      'div',
      {},
      {
        'data-option': ''
      }
    )
    const optionTextValueWrappedWithMatchinHighlight = optionTextValue.replace(
      uncompletedWord, (match) => {
        return `<mark>${match}</mark>`
      }
    )
    optionElement.innerHTML = optionTextValueWrappedWithMatchinHighlight
    optionElement.index = optionIndex
    optionElement.textValue = optionTextValue
    autocompleteListView.appendChild(optionElement)
    if (optionIndex === 0) {
      optionElement.classList.add('selected')
      optionElement.scrollIntoView({ block: 'nearest' })
    }
  })
}

const completeWord = (textarea, divUnderneathTextarea, autocompleteListView, columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn, lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord, numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn) => {
  if (autocompleteListView.style.display !== 'none') {
    const selectedOptionElement = autocompleteListView.childNodes[autocompleteListView.optionIndex]
    if (
      (columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn !== undefined) &&
      (lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord !== undefined) &&
      selectedOptionElement
    ) {
      const lastCharInWordThatIsAboutToBeReplacedByAutocompletionIsDelimeter = delimeters.indexOf(textarea.value[numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn + lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord - 1]) !== -1
      const charIndexOfTextvalueThatWeRestoreAfterAutocompletion = numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn + lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord - (lastCharInWordThatIsAboutToBeReplacedByAutocompletionIsDelimeter ? 1 : 0)
      textarea.value = textarea.value.substr(0, numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn + columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn) + selectedOptionElement.textValue + textarea.value.substr(charIndexOfTextvalueThatWeRestoreAfterAutocompletion)
      textarea.textareaTextLengthBeforeNextChange = textarea.value.length
      textarea.isRenderedWithLatestInputText = false
      textarea.isModified = true
      const scrollTopOfTextareaBefore = textarea.scrollTop
      const scrollLeftOfTextareaBefore = textarea.scrollLeft
      textarea.focus()
      textarea.scrollTop = scrollTopOfTextareaBefore
      textarea.scrollLeft = scrollLeftOfTextareaBefore
      const caretPositionAfterWordCompletion = numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn + columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn + selectedOptionElement.textValue.length
      textarea.setSelectionRange(caretPositionAfterWordCompletion, caretPositionAfterWordCompletion)
      autocompleteListView.style.display = 'none'
      highlightTextareaValueInDivUnderneathItWithoutRefIds(divUnderneathTextarea, textarea, false)
    }
  }
}

const selectedOptionInAutocompleteList = (autocompleteListView, optionIndex) => {
  if (autocompleteListView.childNodes[autocompleteListView.optionIndex]) {
    autocompleteListView.childNodes[autocompleteListView.optionIndex].classList.remove('selected')
  }
  autocompleteListView.optionIndex = optionIndex
  if (autocompleteListView.childNodes[autocompleteListView.optionIndex]) {
    autocompleteListView.childNodes[autocompleteListView.optionIndex].classList.add('selected')
  }
}

export default (autocompleteListView, textarea, divUnderneathTextarea) => {
  autocompleteListView.optionIndex = 0

  let numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn
  let columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn
  let lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord
  let enterOrTabIsUp = true

  textarea.addEventListener('keyup', (event) => {
    const itIsSpaceBarPressed = event.keyCode === 32
    const itIsEnterPressed = event.keyCode === 13
    const itIsTabPressed = event.keyCode === 9
    const itIsArrowUpPressed = event.keyCode === 38
    const itIsArrowDownPressed = event.keyCode === 40
    const itIsBackSpacePressed = event.keyCode === 8
    const itIsPrintableKeyPressed = isPrintableKeycode(event.keyCode)
    const isCmdPressed = ((isMacOS && event.metaKey) || (!isMacOS && event.ctrlKey))
    if (itIsBackSpacePressed && autocompleteListView.style.display === 'none') {
      return
    }
    if (!itIsSpaceBarPressed && !itIsEnterPressed && !itIsTabPressed && !isCmdPressed && itIsPrintableKeyPressed) {
      const textareaValueSplittedInLines = textarea.value.split('\n')
      const numberOfCharsInEachLineInTextarea = textareaValueSplittedInLines.map(value => value.length)
      const selectionStartInTextarea = textarea.selectionStart
      const totalNumberOfLinesBeforeSelectionStart = textarea.value.substr(0, selectionStartInTextarea).split('\n').length
      const lineNumberWhereCaretIsOn = totalNumberOfLinesBeforeSelectionStart - 1
      const numberOfCharsInEachLineBeforeTheLineWhereCaretIsOn = numberOfCharsInEachLineInTextarea.slice(0, lineNumberWhereCaretIsOn)
      const numberOfCharsBeforeFirstCharOnTheLineWhereCaretIsOn = (numberOfCharsInEachLineBeforeTheLineWhereCaretIsOn.length >= 1)
        ? numberOfCharsInEachLineBeforeTheLineWhereCaretIsOn.reduce((totalNumberOfChars, numberOfCharsOnTheLineWhereCaretIsOn) => totalNumberOfChars + numberOfCharsOnTheLineWhereCaretIsOn)
        : 0
      const numberOfNewLineCharsBeforeTheLineWhereCaretIsOn = lineNumberWhereCaretIsOn
      numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn = numberOfCharsBeforeFirstCharOnTheLineWhereCaretIsOn + numberOfNewLineCharsBeforeTheLineWhereCaretIsOn
      const totalNumberOfCharsBeforeSelectionStartInTextarea = selectionStartInTextarea
      const columnNumberWhereCaretIsOn = totalNumberOfCharsBeforeSelectionStartInTextarea - numberOfCharsBeforeFirstCharOnTheLineWhereCaretIsOn - numberOfNewLineCharsBeforeTheLineWhereCaretIsOn
      const textareaValueOnTheLineWhereCaretIsOn = textareaValueSplittedInLines[lineNumberWhereCaretIsOn]
      for (let columnNumber = columnNumberWhereCaretIsOn; columnNumber >= 0; columnNumber--) {
        if (
          (
            textareaValueOnTheLineWhereCaretIsOn[columnNumber - 1] &&
            /\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumber - 1])
          ) ||
          (
            (columnNumber === 0) &&
            !/\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumber])
          )
        ) {
          columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn = columnNumber
          break
        }
      }
      const caretInOnSpace = (
        (columnNumberWhereCaretIsOn === columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn) &&
        (
          (
            (textareaValueOnTheLineWhereCaretIsOn[columnNumberWhereCaretIsOn] === undefined) ||
            /\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumberWhereCaretIsOn])
          ) &&
          textareaValueOnTheLineWhereCaretIsOn[columnNumberWhereCaretIsOn - 1] &&
          /\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumberWhereCaretIsOn - 1])
        )
      )
      if (columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn !== undefined) {
        if (
          (
            columnNumberWhereCaretIsOn >= (columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn + 1)
          ) ||
          caretInOnSpace
        ) {
          const lastColumnNumberOnTheLineWhereCaretInOn = textareaValueOnTheLineWhereCaretIsOn.length
          lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord = columnNumberWhereCaretIsOn
          if (!/\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumberWhereCaretIsOn])) {
            for (let columnNumber = columnNumberWhereCaretIsOn; columnNumber < lastColumnNumberOnTheLineWhereCaretInOn; columnNumber++) {
              if ((columnNumber === textareaValueOnTheLineWhereCaretIsOn.length - 1) || (textareaValueOnTheLineWhereCaretIsOn[columnNumber + 1] && /\s/.test(textareaValueOnTheLineWhereCaretIsOn[columnNumber + 1]))) {
                lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord = columnNumber + 1
                break
              }
            }
          }
          const currentUncompletedWord = textareaValueOnTheLineWhereCaretIsOn.slice(columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn, columnNumberWhereCaretIsOn)
          const charIndexWhereCaretIsOn = numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn + columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn
          const optionsForUncompletedWord = foundOptionsForUncompletedWord(charIndexWhereCaretIsOn, listsOfPossibleOptionsToCompleteWordByProgressionOfCommandsFromScenarios, currentUncompletedWord, caretInOnSpace, textarea.mapOfCharIndexesWithProgressionOfCommandsFromScenarios)
          if (optionsForUncompletedWord.length > 0) {
            if (autocompleteListView.style.display === 'none') {
              autocompleteListView.style.display = ''
            }
            fillAutocompleteListViewWithOptionsForUncompletedWord(currentUncompletedWord, autocompleteListView, optionsForUncompletedWord)
            const textTillFirstNonSpaceCharBeforeTheColumnNumberOnTheLineWhereCaretIsOn = textareaValueOnTheLineWhereCaretIsOn.slice(0, columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn)
            const widthOfTextTillFirstNonSpaceCharBeforeTheColumnNumberOnTheLineWhereCaretIsOn = textWidthInTextarea(textarea, textTillFirstNonSpaceCharBeforeTheColumnNumberOnTheLineWhereCaretIsOn)
            const textareaComputedStyle = window.getComputedStyle(textarea)
            const textareaLeft = textareaComputedStyle.getPropertyValue('left').split('px')[0] * 1
            const textareaTop = textareaComputedStyle.getPropertyValue('top').split('px')[0] * 1
            const textareaHeight = textareaComputedStyle.getPropertyValue('height').split('px')[0] * 1
            const textareaBottom = textareaTop + textareaHeight
            /* To change this value, you also need to change value padding-left of div[data-autocomplete] div[data-option] in css/editor.js */
            const distanceToMoveAutocompleteListViewSoWeCanAddPaddingToItAndTheTextWouldAlignCorrectly = 10
            const leftOfAutocompleteListView = textareaLeft + widthOfTextTillFirstNonSpaceCharBeforeTheColumnNumberOnTheLineWhereCaretIsOn - textarea.scrollLeft - distanceToMoveAutocompleteListViewSoWeCanAddPaddingToItAndTheTextWouldAlignCorrectly
            const textareaLineHeight = textareaComputedStyle.getPropertyValue('line-height').split('px')[0] * 1
            const marginTopOfAutocompleteListView = 2.5
            const marginBottomOfAutocompleteListView = 4
            const autocompleteListViewComputedStyle = window.getComputedStyle(autocompleteListView)
            const autocompleteListViewHeight = autocompleteListViewComputedStyle.getPropertyValue('height').split('px')[0] * 1
            let topOfAutocompleteListView = textareaTop + textareaLineHeight * (lineNumberWhereCaretIsOn + 1) + marginTopOfAutocompleteListView - textarea.scrollTop
            if ((topOfAutocompleteListView + autocompleteListViewHeight) >= textareaBottom) {
              topOfAutocompleteListView = topOfAutocompleteListView - autocompleteListViewHeight - textareaLineHeight * 1 - marginBottomOfAutocompleteListView
            }
            autocompleteListView.style.left = `${leftOfAutocompleteListView}px`
            autocompleteListView.style.top = `${topOfAutocompleteListView}px`
          } else {
            autocompleteListView.style.display = 'none'
          }
        } else {
          autocompleteListView.style.display = 'none'
        }
      }
    } else if (!itIsArrowUpPressed && !itIsArrowDownPressed) {
      autocompleteListView.style.display = 'none'
    }
  })
  textarea.addEventListener('keydown', (event) => {
    if (autocompleteListView.style.display !== 'none') {
      const itIsArrowUpPressed = event.keyCode === 38
      const itIsArrowDownPressed = event.keyCode === 40
      const itIsEnterPressed = event.keyCode === 13
      const itIsTabPressed = event.keyCode === 9
      if (itIsTabPressed || itIsEnterPressed) {
        if (enterOrTabIsUp) {
          event.preventDefault()
          completeWord(textarea, divUnderneathTextarea, autocompleteListView, columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn, lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord, numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn)
          enterOrTabIsUp = false
        }
      } else if (itIsArrowUpPressed || itIsArrowDownPressed) {
        event.preventDefault()
        autocompleteListView.optionIndex = autocompleteListView.optionIndex || 0
        if (autocompleteListView.childNodes[autocompleteListView.optionIndex]) {
          autocompleteListView.childNodes[autocompleteListView.optionIndex].classList.remove('selected')
          const newOptionIndex = autocompleteListView.optionIndex + (itIsArrowUpPressed ? -1 : 1)
          if (autocompleteListView.childNodes[newOptionIndex]) {
            autocompleteListView.childNodes[newOptionIndex].classList.add('selected')
            autocompleteListView.childNodes[newOptionIndex].scrollIntoView({ block: 'nearest' })
            autocompleteListView.optionIndex = newOptionIndex
          } else {
            const newOptionIndex = (itIsArrowUpPressed ? (autocompleteListView.childNodes.length - 1) : 0)
            autocompleteListView.childNodes[newOptionIndex].classList.add('selected')
            autocompleteListView.childNodes[newOptionIndex].scrollIntoView({ block: 'nearest' })
            autocompleteListView.optionIndex = newOptionIndex
          }
        }
      }
    }
  })
  textarea.addEventListener('keyup', (event) => {
    const itIsEnterPressed = event.keyCode === 13
    const itIsTabPressed = event.keyCode === 9
    if (itIsTabPressed || itIsEnterPressed) {
      enterOrTabIsUp = true
    }
  })
  autocompleteListView.addEventListener('click', (event) => {
    selectedOptionInAutocompleteList(autocompleteListView, event.target.index)
    completeWord(textarea, divUnderneathTextarea, autocompleteListView, columnNumberOfCharWhichIsFirstNonSpaceCharBeforeTheColumnNumberWhereCaretIsOn, lastColumnNumberOnTheLineWhereCaretIsOnForCurrentUncompletedWord, numberOfCharsIncludingNewLineCharsBeforeFirstCharInTheLineWhereCaretIsOn)
  })
  textarea.addEventListener('select', () => {
    if (autocompleteListView.style.display !== 'none') {
      if (textarea.selectionStart !== textarea.selectionEnd) {
        autocompleteListView.style.display = 'none'
      }
    }
  })
  textarea.addEventListener('click', () => {
    autocompleteListView.style.display = 'none'
  })
  textarea.addEventListener('scroll', () => {
    if ((autocompleteListView.style.display !== 'none') && !textarea.weAreTypingInTextarea) {
      autocompleteListView.style.display = 'none'
    }
  })
  const resizeObserver = new ResizeObserver(entries => {
    autocompleteListView.style.display = 'none'
  })
  resizeObserver.observe(textarea)
}
