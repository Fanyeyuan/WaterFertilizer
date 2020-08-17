// const log = require('electron-log')
import log from '@/app/common/log'
import { ipcRenderer } from 'electron'

// preload.js
process.once('loaded', () => {
  window.log = log.functions
  window.log = ipcRenderer
})
