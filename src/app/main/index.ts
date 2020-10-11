import * as Server from './service'
import * as Db from './database'
import * as Model from './database/model'
import { deviceList, DeviceInterface, Device } from './device/device'
// import * as Model from '@/app/main/database/'
import log from '@/app/common/log'
import net from 'net'
import * as Api from './api'

/**
 * 定时器
 * @param time 定时时间 单位 s
 */
const delay = (time = 60) => {
  return new Promise((resolve, reject) => {
    const timeHandle: NodeJS.Timeout = setTimeout(() => {
      resolve(timeHandle)
    }, time * 1000)
  })
}

/**
 * 定时读取功能
 * @param time 定时读取，单位 s
 */
const autoRead = (sock: net.Socket, id: number, time = 60) => {
  return setInterval(() => {
    Api.mainRadio('getReal', { id })
  }, 10 * 1000)
}

const getDeviceInfo = async (id: number) => {
  if (deviceList.get(id)) return
  let device: any = null
  try {
    const result = await Db.get(Db.tables.device, {
      fac_id: id // eslint-disable-line
    })
    if (result) device = <Model.Device>result; // eslint-disable-line
  } catch (error) {
    log.warn(error.massage)
  }
  if (device) {
    const list = new Device()
    list.online = true
    list.id = device.id
    list.creatorId = device.create_id
    list.facId = device.fac_id; // eslint-disable-line
    list.createTime = device.create_time
    list.remark = device.remark
    list.facName = device.fac_name
    list.facType = device.facType
    list.longitude = device.fac_name
    list.latitude = device.facType
    list.readInterval = device.facType

    const sensor = {
      ele: device.ele_num.split('/').filter((value: string) => value !== '100'),
      name: device.ele_name.split('/').filter((value: string) => value !== '-')
    }
    // list.ele = sensor.ele.map(async (value:string) => {
    //   const result = Db.get(Db.tables.element, {indexs: sensor.ele})
    // })
    let result = await Db.all(Db.tables.element, { indexs: sensor.ele })
    list.ele = result.map((value: Model.Element, index: number) => {
      if (sensor.name[index]) value.name = sensor.name[index]
      return value
    })

    const relay = {
      ele: device.relay_num.split('/').filter((value: string) => value !== '0'),
      name: device.relay_name
        .split('/')
        .filter((value: string) => value !== '-')
    }
    result = await Db.all(Db.tables.relay, { indexs: relay.ele })
    list.relay = result.map((value: Model.Relay, index: number) => {
      if (relay.name[index]) value.name = relay.name[index]
      return value
    })

    if (device.relay_extend) {
      const extRelay = {
        ele: device.relay_extend_num
          .split('/')
          .filter((value: string) => value !== '0'),
        name: device.relay_extend_name
          .split('/')
          .filter((value: string) => value !== '-')
      }
      result = await Db.all(Db.tables.relay, { indexs: extRelay.ele })
      list.relay = result.map((value: Model.Relay, index: number) => {
        if (relay.name[index]) value.name = relay.name[index]
        return value
      })
    }
    deviceList.set(id, list)
  }
}

const onConnected = async (sock: net.Socket) => {
  let flag = true // 数据是否有异常

  try {
    const deviceId = await Server.ReadDeviceId(sock)
    if (!deviceId.state === true) {
      await getDeviceInfo(deviceId.data)
      const list = deviceList.get(deviceId.data)
      if (list) {
        list.timeHand = autoRead(sock, deviceId.data)
        list.sock = sock
      } else {
        log.warn('未知设备' + deviceId.data + '接入')
        flag = false
      }
    } else {
      log.warn(deviceId.msg, deviceId)
      flag = false
    }
  } catch (error) {
    flag = false
    log.warn(error.massage)
  }

  if (!flag) {
    log.warn(`断开与设备(${sock.remoteAddress}:${sock.remotePort}) 的连接`)
    sock.destroy()
  }
}

const deleteDevice2List = (sock: net.Socket) => {
  for (const [key, value] of deviceList) {
    if (
      !!value.sock &&
      value.sock.remoteAddress === sock.remoteAddress &&
      value.sock.remotePort === sock.remotePort
    ) {
      sock.destroy()
      !!value.timeHand && clearInterval(value.timeHand)
      deviceList.delete(key)
    }
  }
}

const onClose = async (sock: net.Socket, error: boolean) => {
  log.error(sock.remoteAddress + ':' + sock.remotePort + ' 链接已断开', error)
  deleteDevice2List(sock)
}

const onError = async (sock: net.Socket, error: Error) => {
  log.error(
    sock.remoteAddress + ':' + sock.remotePort + ' 链路发生错误',
    error
  )
  deleteDevice2List(sock)
}

export function start () {
  Server.init({ connected: onConnected, close: onClose, error: onError })
  Api.defaultApi()
  // Db.del(Db.tables.reals);
}
