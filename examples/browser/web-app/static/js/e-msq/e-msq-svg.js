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
      this.#render(contentNode, svgString, inputText)

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
    const wrapperTemplate = document.createElement('template')
    wrapperTemplate.innerHTML = /*html*/`
      <style>
      </style>
      <div>
        ${svgString}
      </div>
    `
    this.parentElement.replaceChild(
      document.importNode(wrapperTemplate.content, true),
      this
    )
  }
}

customElements.define('e-msq-svg', EMuSemantiQSVG, { extends: 'template' })
