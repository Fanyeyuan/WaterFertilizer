// const log = require('electron-log')
import log from '@/app/common/log'
import lodash from '@/app/main/database/lodash'
import { ipcRenderer } from 'electron'

// preload.js
process.once('loaded', () => {
  window.log = log.functions
  window.ipc = ipcRenderer
  window.lodash = lodash
})
