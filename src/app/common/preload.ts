// const log = require('electron-log')
import log from 'electron-log'

// preload.js
process.once('loaded', () => {
  window.log = log.functions
})
