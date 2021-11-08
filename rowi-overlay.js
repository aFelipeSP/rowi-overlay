

import RowiElement from '@rowi/rowi-element'
class RWOverlay extends RowiElement {
  #connected = false
  #overlay
  #content
  #overlayClicked
  #updateContent
  constructor () {
    super()
    this.#overlay = document.createElement('div')
    this.#overlay.style.cssText = `
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2147483647;
      background-color: rgba(${this.props.color.default}, 0);
      transition: background-color ${this.props.transition.default}ms;
    `
    if (this.intangible) this.#overlay.style.pointerEvents = 'none'
    this.#overlayClicked = this.#_overlayClicked.bind(this)

    this.$buildShadow([ ['slot', {name: 'content'}] ])
    this.#updateContent = this.#_updateContent.bind(this)
    this.$.content.addEventListener('slotchange', this.#updateContent)
  }

  connectedCallback () {
    this.style.display = 'none'
    this.#connected = true 
  }
  disconnectedCallback () { this.#connected = false }

  static get observedAttributes () {
    return [
      'data-opened',
      'data-opacity',
      'data-color',
      'data-transition',
      'data-persistent',
      'data-intangible',
    ]
  }

  get props () {
    return {  
      opened: { type: 'boolean', handler () { this.#stateChanged() } },
      opacity: { type: 'number', default: 0 },
      color: { type: 'string', default: '0,0,0' },
      transition: {
        type: 'number', default: 300,
        handler ({newValue}) {
          this.#overlay.style.transition = `background-color ${newValue}ms`
        }
      },
      persistent: { type: 'boolean' },
      intangible: {
        type: 'boolean',
        handler ({newValue}) {
          this.#overlay.style.pointerEvents = newValue ? 'none' : null
        }
      },
    }
  }

  #_overlayClicked (ev) {
    if (ev.target === this.#overlay || !this.#overlay.contains(ev.target)) {
      this.opened = false
      ev.stopPropagation()
    }
  }

  #_updateContent () {
    this.#overlay.innerHTML = ''
    const content = this.$.content.assignedElements({flatten: true})
    if (content.length !== 1) {
      console.error('The content of rowi-overlay must be one element, no more'
        + ' no less. All of the contents of the overlay must be included in '
        + 'that single element'
      )
      return
    }
    this.#content = content[0]
    this.$.content.removeEventListener('slotchange', this.#updateContent)
    this.#overlay.append(this.#content)
    setTimeout(() => {
      this.$.content.addEventListener('slotchange', this.#updateContent)
    })
  }

  #stateChanged () {
    if (!this.#connected) return
    if (this.opened) {
      if (this.intangible && this.#content.style.pointerEvents === '') {
        this.#content.style.pointerEvents = 'auto'
      }
      if (!this.persistent) {
        document.addEventListener('click', this.#overlayClicked)
      }
      document.body.append(this.#overlay)
      setTimeout(() => {
        this.#overlay.style.backgroundColor = `rgba(${this.color}, ${this.opacity})`
      })
    } else {
      if (!this.persistent) {
        document.removeEventListener('click', this.#overlayClicked)
      }
      this.#overlay.style.backgroundColor = `rgba(${this.color}, 0)`
      setTimeout(() => document.body.removeChild(this.#overlay), this.transition)
    }
  }
}

customElements.define("rw-overlay", RWOverlay)
