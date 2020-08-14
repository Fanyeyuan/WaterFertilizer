import log from '@/app/common/log'

// preload.js
process.once('loaded', () => {
  window.log = log.functions
})
