import Vue from 'vue'
import crypto from 'crypto'

enum BusEvents {
  getReals = 'getReals', // 从库中获取多个实时数据
  getReal = 'getReal', // 发送指令给设备，获取实时数据
  setRelays = 'setRelays', // 设置同一设备下的多个继电器
  setRelay = 'setRelay', // 设置同一设备下的单个继电器
  getDeivce = 'getDeivce', // 获取指定id设备信息,如果指定id数组，则获取对应的设备信息，否则获取所有的
  createDeivce = 'createDeivce', // 生成一个设备信息
  updateDeivce = 'updateDeivce', // 修改一个设备信息
  deleteDeivce = 'deleteDeivce', // 删除指定设备，如果不指定则清空设备表，可为 数组或者数字
  getGroup = 'getGroup', // 获取灌区信息
  getHistory = 'getHistory', // 获取指定id 历史数据
  getElement = 'getElement', // 获取元素信息
  getFacType = 'getFacType', // 获取设备类型
  getFer = 'getFer', // 获取肥料类型
  getControlLog = 'getControlLog', // 获取指定设备的控制日志
  getRelayType = 'getRelayType', // 获取继电器类型
  getTurnRecord = 'getTurnRecord', // 获取轮灌信息
  getTurnFer = 'getTurnFer', // 获取轮灌信息内容
  getTurnContent = 'getTurnContent' // 获取轮灌信息内容
}

const bus = new Vue()

export function sha256 (data: any, key = '123456') {
  const hash = crypto
    .createHmac('sha256', key)
    .update(data)
    .digest('hex')

  return hash
}

export function event (eve: string, args: any) {
  const str = sha256(eve, JSON.stringify(args))
  return new Promise((resolve, reject) => {
    // console.log(args);
    window.ipc.send(eve, args)
    window.ipc.on(eve, (event: any, back: any) => {
      const temp = sha256(eve, JSON.stringify(back.ext))
      if (temp === str) {
        bus.$emit(str, back)
      }
    })
    bus.$on(str, (args: any) => {
      resolve(args)
    })
  })
}

export function getReals (id: number[] | number | undefined): Promise<any> {
  return event(BusEvents.getReals, { id })
}

export function getReal (id: number) {
  return event(BusEvents.getReal, { id })
}

export function setRelays (
  id: number,
  start: number,
  num: number,
  state: number[]
) {
  return event(BusEvents.setRelays, { id, start, num, state })
}

export function setRelay (
  id: number,
  start: number,
  num: number,
  state: number
) {
  return event(BusEvents.setRelay, { id, start, num, state })
}

export function getDevice (id: number[] | number | undefined) {
  return event(BusEvents.getDeivce, { id })
}

export function createDeivce (device: object) {
  return event(BusEvents.createDeivce, device)
}
export function updateDeivce (device: object) {
  return event(BusEvents.updateDeivce, device)
}

export function deleteDeivce (id: number[] | number | undefined) {
  return event(BusEvents.deleteDeivce, { fac_id: id })
}

export function getGroup (id: number[] | number | undefined) {
  return event(BusEvents.getGroup, { id })
}

export function getHistory (id: number[] | number) {
  return event(BusEvents.getHistory, { id })
}

export function getElement (id: number[] | number | undefined) {
  return event(BusEvents.getElement, { id })
}

export function getFacType (id: number[] | number | undefined) {
  return event(BusEvents.getFacType, { id })
}

export function getFer (id: number[] | number | undefined) {
  return event(BusEvents.getFer, { id })
}

export function getControlLog (id: number[] | number | undefined) {
  return event(BusEvents.getControlLog, { id })
}

export function getRelayType (id: number[] | number | undefined) {
  return event(BusEvents.getRelayType, { id })
}

export function getTurnRecord (id: number[] | number | undefined) {
  return event(BusEvents.getTurnRecord, { id })
}

export function getTurnFer (id: number[] | number | undefined) {
  return event(BusEvents.getTurnFer, { id })
}

export function getTurnContent (id: number[] | number | undefined) {
  return event(BusEvents.getTurnContent, { id })
}
