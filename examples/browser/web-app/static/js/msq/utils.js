export function copyText({ event, text, onCopyInnerHTML }) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  const target = event.currentTarget
  const initialText = target.innerHTML
  target.innerHTML = onCopyInnerHTML || 'Copied &#10003;'
  setTimeout(() => {
    target.innerHTML = initialText
  }, 1500)
}

export function trimMultilineText(text) {
  return text.trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

export function downloadContent({ fileName, dataSrc, extenstion }) {
  // const fileURL = window.URL.createObjectURL(content)
  const anchor = document.createElement('a')
  anchor.href = dataSrc
  anchor.download = `${fileName}.${extenstion}`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export async function openContent({ dataSrc }) {
  try {
    const response = await fetch(dataSrc)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
  } catch (error) {
    console.error('Error opening SVG:', error)
  }
}

const PERCEPTION_TIME = 0.005
const PRECISION = 0.0001

export function attachHighliterToMidiPlayer({
  midiPlayer,
  svgParent,
  customStyles,
  customHighlighColor
}) {
  const highlighColor = customHighlighColor || '#C40233'
  const midiProgressBar = midiPlayer.shadowRoot.querySelector('[data-seek-bar]')
  const currentTimeLabel = midiPlayer.shadowRoot.querySelector('[data-current-time]')
  const totalTimeLabel = midiPlayer.shadowRoot.querySelector('[data-total-time]')
  const playButton = midiPlayer.shadowRoot.querySelector('[data-play-button]')

  const progressChangeEvent = (event) => {
    const originalFontColor = customStyles.fontColor || '#121212'
    if (event.type === 'input' || event.type === 'change' || event.type === 'stop') {
      const refElms = svgParent.querySelectorAll(`[fill="${highlighColor}"]`)
      refElms.forEach((refElm) => {
        refElm.setAttribute('fill', originalFontColor)
      })
      midiPlayer.progressInterruptedFlowOfNoteEvents = true
      return
    }


    if (event.type === 'note' && midiPlayer.progressInterruptedFlowOfNoteEvents) {
      midiPlayer.progressInterruptedFlowOfNoteEvents = false
    }

    const closestTimeStampMappedWithRefsOnForCurrentNote = []
    for (let error = -PERCEPTION_TIME; error <= PERCEPTION_TIME; error += PRECISION) {
      const closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError = midiPlayer.timeStampsMappedWithRefsOn[(event.detail.note.startTime + error).toFixed(4) * 1]
      if (closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError !== undefined) {
        closestTimeStampMappedWithRefsOnForCurrentNote.push(
          ...closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError
        )
      }
    }

    closestTimeStampMappedWithRefsOnForCurrentNote.forEach((refToHighlight) => {
      const refElms = svgParent.querySelectorAll(`[ref-ids*="${refToHighlight.refId}"]`)
      refElms.forEach((refElm) => {
        refElm.querySelectorAll('path').forEach((pathElm) => {
          pathElm.setAttribute('fill', highlighColor)
        })
      })
      const unhighlightNoteTimeout = setTimeout(() => {
        refElms.forEach((refElm) => {
          refElm.querySelectorAll('path').forEach((pathElm) => {
            pathElm.setAttribute('fill', originalFontColor)
          })
        })
        clearTimeout(unhighlightNoteTimeout)
        const midiProgressBarMaxValue = midiProgressBar.getAttribute('max') * 1
        if ((event.detail.note.startTime + refToHighlight.duration) >= midiProgressBarMaxValue) {
          midiProgressBar.value = midiProgressBarMaxValue
          if (playButton.parentElement.classList.contains('playing')) {
            currentTimeLabel.innerText = totalTimeLabel.innerText
            playButton.click()
          }
        }
      }, refToHighlight.duration * 1000)
    })
  }

  midiPlayer.addEventListener('note', progressChangeEvent)
  midiPlayer.addEventListener('stop', progressChangeEvent)
  midiProgressBar.addEventListener('change', progressChangeEvent)
  midiProgressBar.addEventListener('input', progressChangeEvent)

  midiProgressBar.addEventListener('change', () => {
    if (playButton.parentElement.classList.contains('playing')) {
      playButton.click()
      playButton.click()
    }
  })

  svgParent.addEventListener('click', (event) => {
    if (event.target.tagName !== 'path') {
      return
    }
    if (!event.target.parentNode) {
      return
    }
    let refIds
    const refDataName = event.target.parentNode.getAttribute('data-name')

    if (refDataName === 'noteBody') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'rest') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'simileStrokes') {
      refIds = event.target.parentNode.parentNode.parentNode.getAttribute('ref-ids')
    }
    if (!refIds) {
      return
    }
    const splittedRefIds = refIds.split(',')
    const theOnlyPageIndex = 0
    if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex] === undefined) {
      return
    }
    for (const refIdIndex in splittedRefIds) {
      const refId = splittedRefIds[refIdIndex]
      console.log(refId, midiPlayer.refsOnMappedWithTimeStamps)
      if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId] !== undefined) {
        midiProgressBar.value = midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId] - PRECISION
        midiProgressBar.dispatchEvent(new CustomEvent('change'))
        break
      }
    }
  })
}
