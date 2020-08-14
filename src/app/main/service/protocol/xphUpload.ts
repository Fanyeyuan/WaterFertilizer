import { XPHCHECK, checkFrame } from './checksum/xph'
import { ProtocolResponedInterface } from './types'

export default class Xph {
  public decode (data: Buffer | Array<number>): ProtocolResponedInterface {
    const result: ProtocolResponedInterface = {
      type: '',
      data: null,
      state: XPHCHECK.OK,
      msg: ''
    }
    if (checkFrame(data) === XPHCHECK.OK) {
      // 获取实时数据
      result.type = 'DeviceReals'
      result.data = {
        sensor: [],
        relay: []
      }

      // 16通道要素
      for (let i = 0; i < 16; i++) {
        const tmp = (data[8 + i * 2] << 8) + data[9 + i * 2]
        result.data.sensor.push(tmp)
      }
      // 32字节继电器
      for (let i = 0; i < 32; i++) {
        result.data.relay.push(data[39 + i])
      }

      result.msg =
        '设备实时数据为:' +
        result.data.sensor.join(' ') +
        ',继电器状态为：' +
        result.data.relay.join(' ')
    } else {
      result.state = XPHCHECK.FrameError
      result.msg = `帧校验错误--(${data})`
    }

    return result
  }
}
