import { crc16modbus } from 'crc'
import { XPHCHECK, checkFrame } from './checksum/xph'
import {
  ProtocolResponedInterface,
  ProtocolRequestInterface,
  ProtocolRequestContentInterface
} from './types'

// 目前xph 协议所支持的操作内容
const enum XPHSUPPORTCMD {
  getDeviceReals = 'getDeviceReals', // 获取实时数据
  getDeviceId = 'getDeviceId', // 获取设备ID
  setDeviceRelay = 'setDeviceRelay' // 控制继电器
}

export default class Xph {
  public decode (data: Buffer | Array<number>): ProtocolResponedInterface {
    const result: ProtocolResponedInterface = {
      type: '',
      data: null,
      state: XPHCHECK.OK,
      msg: ''
    }
    if (checkFrame(data) === XPHCHECK.OK) {
      result.state = XPHCHECK.OK

      switch (data[1]) {
        case 0x03: {
          const cmd = (data[2] << 8) + data[3]
          switch (cmd) {
            // ProtocolResponedInterface.data:{sensor:number[], relay:number[]}
            case 0x40: {
              // 获取实时数据
              result.type = XPHSUPPORTCMD.getDeviceReals
              result.data = {
                sensor: [],
                relay: []
              }

              // 16通道要素
              for (let i = 0; i < 16; i++) {
                const tmp = (data[4 + i * 2] << 8) + data[5 + i * 2]
                result.data.sensor.push(tmp)
              }
              // 32字节继电器
              for (let i = 0; i < 32; i++) {
                result.data.relay.push(data[36 + i])
              }

              result.msg =
                '设备实时数据为:' +
                result.data.sensor.join(' ') +
                ',继电器状态为：' +
                result.data.relay.join(' ')
              break
            }
            // ProtocolResponedInterface.data:number
            case 0x60: {
              // 获取设备ID
              result.type = XPHSUPPORTCMD.getDeviceId
              result.data =
                ((data[6] * 100 + data[7]) * 100 + data[8]) * 100 + data[9]
              result.msg = '设备ID 为' + result.data
              break
            }
          }
          break
        }
        // ProtocolResponedInterface.data:{relay:number; state:number}
        case 0x10: {
          const cmd = (data[2] << 8) + data[3]
          switch (cmd) {
            case 0x7a: {
              // 继电器控制返回
              result.type = XPHSUPPORTCMD.setDeviceRelay
              result.data = {
                relay: data[4],
                state: data[5]
              }
              result.msg = `继电器JK${result.data.relay} 状态为 ${
                result.data.state ? '开' : '关'
              }`
              break
            }
          }
          break
        }
        case 0x20: {
          break
        }
        default: {
          break
        }
      }
    } else {
      result.state = XPHCHECK.FrameError
      result.msg = `帧校验错误--(${data})`
    }

    return result
  }

  public encode (
    data: ProtocolRequestInterface
  ): ProtocolRequestContentInterface {
    const result: ProtocolRequestContentInterface = {
      type: '',
      data: [],
      state: true,
      msg: ''
    }
    switch (data.type) {
      // ProtocolRequestInterface.data : {addr?:number}
      case XPHSUPPORTCMD.getDeviceReals: {
        // result.data = [data.data.addr ?? 0, 0x03, 0, 0];
        result.data = [0, 0x03, 0, 0]
        const crc = crc16modbus(Buffer.of(...result.data))
        result.data.push(crc & 0x00ff)
        result.data.push(crc >> 8)

        result.type = XPHSUPPORTCMD.getDeviceReals
        result.msg = `命令(${
          XPHSUPPORTCMD.getDeviceReals
        }) 发送的指令为 ${result.data.join(' ')}`
        break
      }
      // ProtocolRequestInterface.data : {addr?:number}
      case XPHSUPPORTCMD.getDeviceId: {
        result.data = [0, 0x03, 0, 0x60, 0x00, 0x04]
        const crc = crc16modbus(Buffer.of(...result.data))
        result.data.push(crc & 0x00ff)
        result.data.push(crc >> 8)

        result.type = XPHSUPPORTCMD.getDeviceId
        result.msg = `命令(${
          XPHSUPPORTCMD.getDeviceId
        }) 发送的指令为 ${result.data.join(' ')}`
        break
      }
      // ProtocolRequestInterface.data : {addr?:number; start:number, num:number, state:number[]}
      case XPHSUPPORTCMD.setDeviceRelay: {
        result.data = [
          0,
          0x10,
          0,
          0x7a,
          data.data.start,
          data.data.num,
          ...data.data.state
        ]
        const crc = crc16modbus(Buffer.of(...result.data))
        result.data.push(crc & 0x00ff)
        result.data.push(crc >> 8)

        result.type = XPHSUPPORTCMD.setDeviceRelay
        result.msg = `命令(${
          XPHSUPPORTCMD.setDeviceRelay
        }) 发送的指令为 ${result.data.join(' ')}`
        break
      }
      default: {
        result.state = false
        result.msg = `该命令(${
          data.type
        }) 暂不支持，目前支持 ${XPHSUPPORTCMD.toString()}`
        break
      }
    }
    return result
  }
}
