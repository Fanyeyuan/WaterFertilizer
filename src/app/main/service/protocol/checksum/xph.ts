import { crc16modbus } from 'crc'

export const enum XPHCHECK {
  OK = 0, // 校验正确
  FrameError, // 帧长错误
  McuAddressError, // 地址域错误
  CheckSumError, // 校验和错误
  DataMissmatchError, // 数据不匹配
  UnableRecognizeError // 命令字无法识别
}

export function checkFrame (data: any) {
  if (data.length < 4) {
    return XPHCHECK.FrameError
  }
  if (crc16modbus(data)) {
    return XPHCHECK.CheckSumError
  }

  return XPHCHECK.OK
}
