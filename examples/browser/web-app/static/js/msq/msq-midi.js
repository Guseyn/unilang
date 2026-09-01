import worker from '#msq/worker.js'
import { copyText, downloadContent, trimMultilineText } from '#msq/utils.js'
import '#msq/lib/html-midi-player/player.js'

import downloadIcon from '#msq/icons/downloadIcon.js'
import copyIcon from '#msq/icons/copyIcon.js'
import doneIcon from '#msq/icons/doneIcon.js'

class MuSemantiQMIDI extends HTMLTemplateElement {
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
    const contentNode = document.importNode(this.content, true)
    const inputText = trimMultilineText(this.innerState || contentNode.textContent)

    worker.postMessage({
      id: this.id,
      name: 'midi.generate',
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

      const midiDataSrc = event.data.midiDataSrc
      this.#buildMidiPlayer(midiDataSrc, inputText)
      worker.removeEventListener('message', messageHandler)
    }

    worker.addEventListener('message', messageHandler)
  }

  #buildMidiPlayer(midiDataSrc, inputText) {
    const elm = document.createElement('div')
    elm.attachShadow({ mode: 'open' })
    elm.setAttribute('title', inputText)
    elm.setAttribute('data-rendered-by', 'template[is="e-msq-midi"]')
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
        div[data-utils] {
          display: flex;
          flex-direction: row;
        }
      </style>
      <div data-inner-wrapper>
        <div data-scroll>
          <midi-player
            data-sound-font="${soundFont || ''}"
            data-src="${midiDataSrc}"
          ></midi-player>
        </div>
      </div>
    `
    const midiPlayer = elm.shadowRoot.querySelector('midi-player')
    const midiPlayerOverrideStyle = document.createElement('style')
    midiPlayerOverrideStyle.textContent = /*css*/`
      [data-control-panel] {
        border-radius: 1em;
        box-sizing: border-box;
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
    const copyMSQButton = document.createElement('button')
    copyMSQButton.innerHTML = copyIcon
    copyMSQButton.addEventListener('click', (event) => {
      copyText({
        event,
        text: inputText,
        onCopyInnerHTML: doneIcon
      })
    })
    utilsPanel.appendChild(copyMSQButton)
    controlPanel.appendChild(utilsPanel)
    this.parentElement.replaceChild(
      elm,
      this
    )
  }
}

customElements.define('msq-midi', MuSemantiQMIDI, { extends: 'template' })
