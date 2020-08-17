// import {emitter} from 'emitter'
import crypto from 'crypto'
import { EventEmitter } from 'events'
import { promises } from 'dns'

const sha256 = (data: any, key = '123456') => {
  const hash = crypto
    .createHmac('sha256', key)
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

const MyEventOnce = (event: string, timeout?: number) => {
  return new Promise((resolve, reject) => {
    let timehandle: any
    if (timeout) {
      timehandle = setTimeout(() => {
        MyEventOff(event)
        reject(new Error(`${event} 事件超时`))
      }, timeout)
    }
    MyEmitter.once(event, (...params) => {
      !!timehandle && clearTimeout(timehandle)
      resolve(...params)
    })
  })
}

const MyEventOn = (event: string) => {
  return new Promise((resolve, reject) => {
    MyEmitter.on(event, (...params) => {
      resolve(params)
    })
  })
}

const MyEventEmiter = (event: string, ...params: any[]) => {
  MyEmitter.emit(event, ...params)
}

export { sha256, MyEventOnce, MyEventOn, MyEventEmiter, MyEventOff }
