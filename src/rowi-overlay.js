import RowiElement from '@rowi/rowi-element'

class RWOverlay extends RowiElement {

  constructor () {
    super()
    this._connected = false
    this.style.display = 'none'
    this._overlay = document.createElement('div')
    this._overlay.style.cssText = `
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2147483647;
      background-color: rgba(${this.props.color.default}, 0);
      transition: background-color ${this.props.transition.default}ms;
    `
    if (this.intangible) this._overlay.style.pointerEvents = 'none'
    this._overlayClicked = this.overlayClicked.bind(this)
  }

  connectedCallback () { this._connected = true }
  disconnectedCallback () { this._connected = false }

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
      opened: { type: 'boolean', handler () { this.stateChanged() } },
      opacity: { type: 'number', default: 0 },
      color: { type: 'string', default: '0,0,0' },
      transition: {
        type: 'number', default: 300,
        handler ({newValue}) {
          this._overlay.style.transition = `background-color ${newValue}ms`
        }
      },
      persistent: { type: 'boolean' },
      intangible: {
        type: 'boolean',
        handler ({newValue}) {
          this._overlay.style.pointerEvents = newValue ? 'none' : null
        }
      },
    }
  }

  overlayClicked (ev) {
    if (ev.target === this._overlay || !this._overlay.contains(ev.target)) {
      this.opened = false
      ev.stopPropagation()
    }
  }

  stateChanged () {
    if (!this._connected) return
    if (this.opened) {
      if (this.children.length === 0) return
      this._content = this.children[0]
      if (this.intangible && ['', null].includes(this._content.style.pointerEvents)) {
        this._content.style.pointerEvents = 'auto'
      }
      if (!this.persistent) {
        document.addEventListener('click', this._overlayClicked)
      }
      this._overlay.append(this._content)
      document.body.append(this._overlay)
      setTimeout(() => {
        this._overlay.style.backgroundColor = `rgba(${this.color}, ${this.opacity})`
      })
    } else {
      if (!this.persistent) {
        document.removeEventListener('click', this._overlayClicked)
      }
      this._overlay.style.backgroundColor = `rgba(${this.color}, 0)`
      setTimeout(() => {
        this.append(this._content)
        document.body.removeChild(this._overlay)
      }, this.transition)
    }
  }
}

customElements.define("rw-overlay", RWOverlay)