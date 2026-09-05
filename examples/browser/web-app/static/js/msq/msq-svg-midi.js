import worker from '#msq/worker.js'
import {
  openContent,
  downloadContent,
  copyText,
  trimMultilineText,
  attachHighliterToMidiPlayer
} from '#msq/utils.js'
import '#msq/lib/html-midi-player/player.js'

import previewIcon from '#msq/icons/previewIcon.js'
import copyIcon from '#msq/icons/copyIcon.js'
import doneIcon from '#msq/icons/doneIcon.js'
import downloadIcon from '#msq/icons/downloadIcon.js'

class MuSemantiQSVGMIDI extends HTMLTemplateElement {
  constructor() {
    super()
    this.id = crypto.randomUUID()
    this.isRendered = false
  }

  connectedCallback() {
    if (this.isRendered === true) {
      return
    }
    this.isRendered = true
    this.#render()
  }

  async #render() {
    const fontSourcesReference = this.getAttribute('data-font-sources')
    if (!fontSourcesReference) {
      throw new Error(`msq-svg-midi must have "data-font-sources" attribute that's must be initialized as reference in msq-font-loader`);
    }

    const contentNode = document.importNode(this.content, true)
    const inputText = trimMultilineText(this.innerState || contentNode.textContent)

    worker.postMessage({
      id: this.id,
      name: 'svg.midi.generate',
      fontSourcesReference,
      inputText
    })

    const messageHandler = (event) => {
      const id = event.data.id
      const status = event.data.status
      const error = event.data.error
      if (status !== 'ok') {
        console.error(error)
      }
      if (status === 'ok' && id !== this.id) {
        return
      }

      const svgString = event.data.svg
      const svgDataSrc = event.data.svgDataSrc
      const midiDataSrc = event.data.midiDataSrc
      const timeStampsMappedWithRefsOn = event.data.timeStampsMappedWithRefsOn
      const refsOnMappedWithTimeStamps = event.data.refsOnMappedWithTimeStamps
      const customStyles = event.data.customStyles

      this.#buildView({
        svgString,
        svgDataSrc,
        midiDataSrc,
        timeStampsMappedWithRefsOn,
        refsOnMappedWithTimeStamps,
        customStyles,
        inputText
      })
      worker.removeEventListener('message', messageHandler)
    }

    worker.addEventListener('message', messageHandler)
  }

  #buildView({
    svgString,
    svgDataSrc,
    midiDataSrc,
    timeStampsMappedWithRefsOn,
    refsOnMappedWithTimeStamps,
    customStyles,
    inputText
  }) {
    const elm = document.createElement('div')
    elm.attachShadow({ mode: 'open' })
    elm.setAttribute('title', inputText)
    elm.setAttribute('data-rendered-by', 'template[is="msq-svg-midi"]')
    const soundFont = this.getAttribute('data-sound-font')

    elm.shadowRoot.innerHTML = /*html*/`
      <style>
        :host {
          font-size: 16px;
          --border-color: #c0c0c0;
          --border-radius: 1em;
          --surface-bg: #fff;
          --surface-bg-hovered: #f9fafc;
        }
        div[data-inner-wrapper] {
          position: relative;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: var(--border-radius);
          border: 1px solid var(--border-color);
          width: max-content;
          height: max-content;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
          overflow: hidden;
        }
        div[data-scroll] {
          border-radius: var(--border-radius);
          overflow: auto;
          scrollbar-width: none;
        }
        div[data-scroll]::-webkit-scrollbar {
          display: none;
        }
        div[data-svg-container] svg {
          border-top-left-radius: 1em;
          border-top-right-radius: 1em;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          display: block;
        }
        div[data-utils] {
          position: absolute;
          top: 0.4em;
          right: 0.4em;
          z-index: 1;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 0.0em;
          font-family: sans-serif;
        }
        div[data-inner-wrapper]:not(:hover) div[data-utils] {
          display: none;
        }
        div[data-utils] button {
          text-align: center;
          background: rgba(204, 204, 204, 0);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 100%;
          transition: background-color 0.25s ease 0s;
          padding: 0;
          cursor: pointer;
        }
        div[data-utils] button:not(:disabled):hover {
          background: rgba(204, 204, 204, 0.3);
        }
        div[data-utils] button:not(:disabled):active {
          background: rgba(204, 204, 204, 0.6);
        }
        div[data-utils] button svg {
          vertical-align: middle;
          fill: #000;
          margin: 0 auto;
        }
      </style>
      <div data-inner-wrapper>
        <div data-utils>
          <button data-download-svg>${downloadIcon}</button>
          <button data-view-svg>${previewIcon}</button>
          <button data-copy-msq>${copyIcon}</button>
        </div>
        <div data-svg-container data-scroll>
          ${svgString}
        </div>
        <midi-player
          data-sound-font="${soundFont || ''}"
          data-src="${midiDataSrc}"
        ></midi-player>
      </div>
    `
    const downloadSVGButton = elm.shadowRoot.querySelector('button[data-download-svg]')
    const viewSVGButton = elm.shadowRoot.querySelector('button[data-view-svg]')
    const copyMSQButton = elm.shadowRoot.querySelector('button[data-copy-msq]')
    downloadSVGButton.addEventListener('click', () => {
      downloadContent({
        fileName: this.getAttribute('data-file-name') || this.id,
        dataSrc: svgDataSrc,
        extenstion: 'svg'
      })
    })
    viewSVGButton.addEventListener('click', (_event) => {
      openContent({
        dataSrc: svgDataSrc
      })
    })
    copyMSQButton.addEventListener('click', (event) => {
      copyText({
        event,
        text: inputText,
        onCopyInnerHTML: doneIcon
      })
    })

    const midiPlayer = elm.shadowRoot.querySelector('midi-player')
    const midiPlayerOverrideStyle = document.createElement('style')
    midiPlayerOverrideStyle.textContent = /*css*/`
      [data-control-panel] {
        border-bottom-left-radius: 1em;
        border-bottom-right-radius: 1em;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        box-sizing: border-box;
        border-top: 1px solid var(--border-color);
      }
    `
    midiPlayer.shadowRoot.appendChild(midiPlayerOverrideStyle)
    const controlPanel = midiPlayer.shadowRoot.querySelector('[data-control-panel]')
    const utilsPanel = document.createElement('div')
    utilsPanel.setAttribute('data-utils', '')
    const downloadContentButton = document.createElement('button')
    downloadContentButton.innerHTML = downloadIcon
    downloadContentButton.addEventListener('click', () => {
      downloadContent({
        fileName: this.getAttribute('data-file-name') || this.id,
        dataSrc: midiDataSrc,
        extenstion: 'midi'
      })
    })    
    utilsPanel.appendChild(downloadContentButton)
    const copyMSQButtonInMidiPlayer = document.createElement('button')
    copyMSQButtonInMidiPlayer.innerHTML = copyIcon
    copyMSQButtonInMidiPlayer.addEventListener('click', (event) => {
      copyText({
        event,
        text: inputText,
        onCopyInnerHTML: doneIcon
      })
    })
    utilsPanel.appendChild(copyMSQButtonInMidiPlayer)
    controlPanel.appendChild(utilsPanel)
    midiPlayer.timeStampsMappedWithRefsOn = timeStampsMappedWithRefsOn
    midiPlayer.refsOnMappedWithTimeStamps = refsOnMappedWithTimeStamps
    this.parentElement.replaceChild(
      elm,
      this
    )
    const svgElm = elm.shadowRoot.querySelector('[data-svg-container] > svg')
    const svgParent = svgElm.parentNode
    let customHighlightColor
    if (this.hasAttribute('data-highlight-color')) {
      customHighlightColor = this.getAttribute('data-highlight-color')
    }
    attachHighliterToMidiPlayer({
      midiPlayer,
      svgParent,
      customStyles,
      customHighlightColor
    })
  }
}

customElements.define('msq-svg-midi', MuSemantiQSVGMIDI, { extends: 'template' })
