

function addElement (RowiElement) {
  class RWOverlay extends RowiElement {
    #connected
    #overlay
    #content
    #overlayClicked
    constructor () {
      super()
      this.#connected = false
      this.style.display = 'none'
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
    }
  
    connectedCallback () { this.#connected = true }
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
  
    #stateChanged () {
      if (!this.#connected) return
      if (this.opened) {
        if (this.children.length === 0) return
        this.#content = this.children[0]
        if (this.intangible && ['', null].includes(this.#content.style.pointerEvents)) {
          this.#content.style.pointerEvents = 'auto'
        }
        if (!this.persistent) {
          document.addEventListener('click', this.#overlayClicked)
        }
        this.#overlay.append(this.#content)
        document.body.append(this.#overlay)
        setTimeout(() => {
          this.#overlay.style.backgroundColor = `rgba(${this.color}, ${this.opacity})`
        })
      } else {
        if (!this.persistent) {
          document.removeEventListener('click', this.#overlayClicked)
        }
        this.#overlay.style.backgroundColor = `rgba(${this.color}, 0)`
        setTimeout(() => {
          this.append(this.#content)
          document.body.removeChild(this.#overlay)
        }, this.transition)
      }
    }
  }
  
  customElements.define("rw-overlay", RWOverlay)
}

import('@rowi/rowi-element').then(
  rowiElement => addElement(rowiElement.default),
  () => {
    import('./node_modules/@rowi/rowi-element/rowi-element.js').then(
      rowiElement => addElement(rowiElement.default)
    )
  }
)

