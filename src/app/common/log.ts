import log from 'electron-log'

log.transports.console.level = false
log.transports.file.level = 'silly'
log.transports.file.maxSize = 500 * 1024 * 1024 // 日志大小最大500m

// 这里是主要方法
function stackInfo () {
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i

  const data = {
    method: '',
    path: '',
    line: '',
    pos: '',
    file: ''
  }
  const stack = new Error().stack
  if (stack) {
    const stacklist = stack.split('\n').slice(3)
    const s = stacklist[4]
    const sp = stackReg.exec(s) || stackReg2.exec(s)
    if (sp && sp.length === 5) {
      data.method = sp[1]
      data.path = sp[2]
      data.line = sp[3]
      data.pos = sp[4]
      data.file = '..' + data.path.slice(data.path.indexOf('/src'))
    }
  }

  return data
}

log.hooks.push((message, transport) => {
  if (transport !== log.transports.file) {
    return message
  }

  if (process.env.NODE_ENV !== 'production') {
    const info = stackInfo()
    const method = info.method
    const file = info.file
    const line = info.line
    message.data.unshift('[' + file + ':' + line + '] [' + method + '] ')
  }

  return message
})

export default log
