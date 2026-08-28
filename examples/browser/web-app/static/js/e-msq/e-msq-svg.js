import evaluateActionsOnProgress from '#ehtml/evaluateActionsOnProgress.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

import worker from '#e-msq/worker.js'

class EMuSemantiQSVG extends HTMLTemplateElement {
  constructor() {
    super()
    this.id = crypto.randomUUID()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      () => this.#onEHTMLActivated(),
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated === true) {
      return
    }
    this.ehtmlActivated = true
    this.#run()
  }

  async #run() {
    const progressState = {}

    if (this.hasAttribute('data-actions-on-progress-start')) {
      evaluateActionsOnProgress(
        this.getAttribute('data-actions-on-progress-start'),
        this,
        progressState
      )
    }

    const fontSourcesReference = this.getAttribute('data-font-sources')
    if (!fontSourcesReference) {
      throw new Error(`e-msq-svg must have "data-font-sources" attribute that's must be initialized as reference in e-msq-font-loader`);
    }

    const contentNode = document.importNode(this.content, true)
    let inputText
    if (this.hasAttribute('data-input-text')) {
      inputText = this.getAttribute('data-input-text')
    } else {
      inputText = contentNode.textContent
    }

    worker.postMessage({
      id: this.id,
      name: 'svg.generate',
      fontSourcesReference,
      inputText
    })

    worker.addEventListener('message', (event) => {
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
      this.#render(svgString, inputText)

      if (this.hasAttribute('data-actions-on-progress-end')) {
        evaluateActionsOnProgress(
          this.getAttribute('data-actions-on-progress-end'),
          this,
          progressState
        )
      }

      scrollToHash()
    }, { once: true })
  }

  #render(svgString, inputText) {
    const svgWrapper = document.createElement('div')
    svgWrapper.attachShadow({ mode: 'open' })
    svgWrapper.setAttribute('title', inputText)
    svgWrapper.setAttribute('data-rendered-by', 'template[is="e-msq-svg"]')
    svgWrapper.shadowRoot.innerHTML = /*html*/`
      <style>
        div[data-wrapper] {
          position: relative;
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: 1rem;
          border: 1px solid #222;
          width: max-content;
          height: max-content;
          padding: 0;
          box-sizing: border-box;
          max-width: 100%;
          overflow: hidden;
        }
        div[data-scroll] {
          border-radius: 1rem;
          overflow: auto;
          scrollbar-width: none;
        }
        div[data-scroll]::-webkit-scrollbar {
          display: none;
        }
        div[data-wrapper] svg {
          border-radius: 1rem;
          display: block;
        }
        div[data-utils] {
          position: absolute;
          top: 0.4rem;
          right: 0.4rem;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.2rem;
          font-family: sans-serif;
        }
        div[data-wrapper]:not(:hover) div[data-utils] {
          display: none;
        }
        div[data-utils] span {
          background: #eee;
          padding: 0.2rem;
          border-radius: 0.4rem;
          cursor: pointer;
          font-size: 0.9rem;
          border: 1px solid #222;
        }
        div[data-utils] span:hover {
          background: #ddd;
        }
      </style>
      <div data-wrapper>
        <div data-utils>
          <span>Copy SVG</span>
          <span>Copy MSQ</span>
        </div>
        <div data-scroll>
          ${svgString}
        </div>
      </div>
    `
    this.parentElement.replaceChild(
      svgWrapper,
      this
    )
  }
}

customElements.define('e-msq-svg', EMuSemantiQSVG, { extends: 'template' })
