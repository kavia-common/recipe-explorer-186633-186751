import Blits from '@lightningjs/blits'
import App from './App.js'

// Key map configuration for navigation
const settings = {
  w: 1920,
  h: 1080,
  precision: 1,
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Backspace', 'Escape'],
    // Extras for search typing-like simulation
    // We won't capture text typing; we use a virtual search control via left/right/select.
  }
}

Blits.Launch(App, 'app', settings)
