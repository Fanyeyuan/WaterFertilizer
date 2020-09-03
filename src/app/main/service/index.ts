import { TcpServer } from './phyInterface'
import {
  Xph,
  XphUpload,
  ProtocolRequestInterface,
  ProtocolResponedInterface
} from './protocol'
import net from 'net'
import log from '@/app/common/log'
import { sha256, MyEventOnce, MyEventEmiter } from '@/app/common/emitter'

const server = new TcpServer(8899)
const protocol = new Xph()

/** **************************************   常用功能封装区域   *****************************************/
export async function read (
  sock: net.Socket,
  data: ProtocolRequestInterface,
  times = 3, // 重发次数
  timeout = 10 // 单位s
): Promise<any> {
  const send = protocol.encode(data)
  const cmd = sock.remoteAddress + ':' + sock.remotePort + '-' + send.type

  server.send(sock, send.data)
  log.debug('发送的内容:' + send.data.join(' '))

  const event = sha256(cmd)

  return MyEventOnce(event, timeout * 1000)
}

export function write (
  sock: net.Socket,
  data: ProtocolRequestInterface,
  times = 3, // 重发次数
  timeout = 10 // 单位s
): Promise<any> {
  const send = protocol.encode(data)
  const cmd = sock.remoteAddress + ':' + sock.remotePort + '-' + send.type

  server.send(sock, send.data)
  log.debug('发送的内容:' + send.data.join(' '))

  const event = sha256(cmd)

  return MyEventOnce(event, timeout * 1000)
}

export function ReadDeviceId (sock: net.Socket) {
  return read(sock, {
    type: 'getDeviceId',
    data: null
  })
}

export function ReadDeviceReals (sock: net.Socket) {
  return read(
    sock,
    {
      type: 'getDeviceReals',
      data: null
    },
    1
  )
}

export function writeDeviceJks (
  sock: net.Socket,
  start: number,
  num: number,
  state: number[]
) {
  return write(sock, {
    type: 'setDeviceRelay',
    data: {
      start,
      num,
      state: state
    }
  })
}

export function writeDeviceJk (sock: net.Socket, start: number, state: number) {
  return write(sock, {
    type: 'setDeviceRelay',
    data: {
      start,
      num: 1,
      state: [state]
    }
  })
}

export function writeDeviceRadio (sock: net.Socket, fer: number[]) {
  return write(sock, {
    type: 'setDeviceRadio',
    data: fer
  })
}
/** **************************************  常用功能封装区域结束  *****************************************/

/** ************************************** 初始化默认回调区域 *****************************************/
function onReceive (sock: net.Socket, data: Buffer) {
  const result = protocol.decode(data)

  const cmd = sock.remoteAddress + ':' + sock.remotePort + '-' + result.type
  MyEventEmiter(sha256(cmd), result)

  log.debug(cmd, result)
}

async function onConnected (sock: net.Socket) {
  const result = await ReadDeviceId(sock)
  if (!result.state === true) {
    setInterval(() => {
      ReadDeviceReals(sock).then(data => {
        log.debug(data)
      })
    }, 60 * 1000)

    // let i = 0;
    // setInterval(() => {
    //   writeDeviceJk(sock, i % 32, (i / 32) % 2 >> 0).then(data => {
    //     log.debug(data);
    //   });
    //   i++;
    // }, 10 * 1000 + 1000);
  } else {
    log.warn(`断开与设备(${sock.remoteAddress}:${sock.remotePort}) 的连接`)
    sock.destroy()
  }
}
function onClose (sock: net.Socket, error: boolean) {
  log.debug(sock.remoteAddress + ':' + sock.remotePort + ' 链接已断开', error)
}
function onError (sock: net.Socket, error: boolean) {
  log.debug(
    sock.remoteAddress + ':' + sock.remotePort + ' 链路发生错误',
    error
  )
}

/** ************************************** 初始化默认回调结束 *****************************************/

/** *************************************    系统初始化区域    ****************************************/
interface ServerInitInterface {
  connected?: (sock: net.Socket) => void;
  close?: (sock: net.Socket, error: boolean) => void;
  data?: (sock: net.Socket, data: Buffer) => void;
  error?: (sock: net.Socket, error: boolean) => void;
}

export function init (obj: ServerInitInterface = {}) {
  server.on('connected', obj.connected ? obj.connected : onConnected)
  server.on('data', obj.data ? obj.data : onReceive)
  server.on('close', obj.close ? obj.close : onClose)
  server.on('error', obj.error ? obj.error : onError)
}
/** **************************************  系统初始化区域结束  *****************************************/
