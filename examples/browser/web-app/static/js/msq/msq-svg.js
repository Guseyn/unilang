import worker from '#msq/worker.js'
import { copyText, trimMultilineText } from '#msq/utils.js'

class MuSemantiQSVG extends HTMLTemplateElement {
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
      throw new Error(`e-msq-svg must have "data-font-sources" attribute that's must be initialized as reference in e-msq-font-loader`);
    }

    const contentNode = document.importNode(this.content, true)
    const inputText = trimMultilineText(this.innerState || contentNode.textContent)

    worker.postMessage({
      id: this.id,
      name: 'svg.generate',
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

      this.#buildView(svgString, inputText)
      worker.removeEventListener('message', messageHandler)
    }

    worker.addEventListener('message', messageHandler)
  }

  #buildView(svgString, inputText) {
    const elm = document.createElement('div')
    elm.attachShadow({ mode: 'open' })
    elm.setAttribute('title', inputText)
    elm.setAttribute('data-rendered-by', 'template[is="e-msq-svg"]')
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
        div[data-inner-wrapper] svg {
          border-radius: 1em;
          display: block;
        }
        div[data-utils] {
          position: absolute;
          top: 0.4em;
          right: 0.4em;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.2em;
          font-family: sans-serif;
        }
        div[data-inner-wrapper]:not(:hover) div[data-utils] {
          display: none;
        }
        div[data-utils] button {
          background: var(--surface-bg);
          border: 1px solid var(--border-color);
          padding: 0.2em;
          border-radius: 0.4em;
          cursor: pointer;
          font-size: 0.7em;
        }
        div[data-utils] button:hover {
          background: var(--surface-bg-hovered);
        }
      </style>
      <div data-inner-wrapper>
        <div data-utils>
          <button data-copy-svg>Copy SVG</button>
          <button data-copy-msq>Copy MSQ</button>
        </div>
        <div data-scroll>
          ${svgString}
        </div>
      </div>
    `
    const copySVGButton = elm.shadowRoot.querySelector('button[data-copy-svg]')
    const copyMSQButton = elm.shadowRoot.querySelector('button[data-copy-msq]')
    copySVGButton.addEventListener('click', (event) => {
      copyText(event, svgString)
    })
    copyMSQButton.addEventListener('click', (event) => {
      copyText(event, inputText)
    })
    this.parentElement.replaceChild(
      elm,
      this
    )
  }
}

customElements.define('msq-svg', MuSemantiQSVG, { extends: 'template' })
