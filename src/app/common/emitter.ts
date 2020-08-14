// import {emitter} from 'emitter'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import { promises } from 'dns'

const sha256 = (data: any) => {
  const hash = crypto
    .createHmac('sha256', '123456')
    .update(data)
    .digest('hex')

  return hash
}

const MyEmitter = new EventEmitter()

const MyEventOff = (event: string, listener?: (...args: any[]) => void) => {
  if (!listener) {
    MyEmitter.removeAllListeners(event)
  } else {
    MyEmitter.off(event, listener)
  }
}

const MyEventOn = (event: string, timeout = 30) => {
  return new Promise((resolve, reject) => {
    const timehandle = setTimeout(() => {
      MyEventOff(event)
      reject(new Error(`${event} 事件超时`))
    }, timeout)
    MyEmitter.once(event, (...params) => {
      clearTimeout(timehandle)
      resolve(...params)
    })
  })
}

const MyEventEmiter = (event: string, ...params: any) => {
  MyEmitter.emit(event, ...params)
}

export { sha256, MyEventOn, MyEventEmiter, MyEventOff }
