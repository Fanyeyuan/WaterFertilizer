import Vue from 'vue'
import crypto from 'crypto'
import { ResponedInterface, TurnStateInterface } from './types/type'

enum BusEvents {
  getCurrentInfo = 'getCurrentInfo', // 获取当前版本信息
  checkUpdate = 'checkUpdate', // 检查是否有更新
  confimUpdate = 'confimUpdate', // 确认开始更新
  confimInstall = 'confimInstall', // 确认开始安装

  getReals = 'getReals', // 从库中获取多个实时数据
  getReal = 'getReal', // 发送指令给设备，获取实时数据
  setRelays = 'setRelays', // 设置同一设备下的多个继电器
  setRelay = 'setRelay', // 设置同一设备下的单个继电器
  setRadio = 'setRadio', // 设置水肥机施肥比例

  getDeivce = 'getDeivce', // 获取指定id设备信息,如果指定id数组，则获取对应的设备信息，否则获取所有的
  createDeivce = 'createDeivce', // 生成一个设备信息
  updateDeivce = 'updateDeivce', // 修改一个设备信息
  deleteDeivce = 'deleteDeivce', // 删除指定设备，如果不指定则清空设备表，可为 数组或者数字
  getGroup = 'getGroup', // 获取灌区信息
  createGroup = 'createGroup', // 获取灌区信息
  updateGroup = 'updateGroup', // 获取灌区信息
  deleteGroup = 'deleteGroup', // 获取灌区信息
  getGroupDevice = 'getGroupDevice', // 获取灌区信息
  createGroupDevice = 'createGroupDevice', // 获取灌区信息
  updateGroupDevice = 'updateGroupDevice', // 获取灌区信息
  deleteGroupDevice = 'deleteGroupDevice', // 获取灌区信息
  getHistory = 'getHistory', // 获取指定id 历史数据
  getElement = 'getElement', // 获取元素信息
  getFacType = 'getFacType', // 获取设备类型
  getFer = 'getFer', // 获取肥料类型
  getCrop = 'getCrop', // 获取肥料类型
  getControlLog = 'getControlLog', // 获取指定设备的控制日志
  getRelayType = 'getRelayType', // 获取继电器类型
  getTurnRecord = 'getTurnRecord', // 获取轮灌信息
  createTurnRecord = 'createTurnRecord', // 获取轮灌信息
  updateTurnRecord = 'updateTurnRecord', // 获取轮灌信息
  deleteTurnRecord = 'deleteTurnRecord', // 获取轮灌信息
  getTurnFer = 'getTurnFer', // 获取轮灌肥料信息内容
  createTurnFer = 'createTurnFer', // 获取轮灌肥料信息内容
  updateTurnFer = 'updateTurnFer', // 获取轮灌肥料信息内容
  deleteTurnFer = 'deleteTurnFer', // 删除轮灌肥料信息内容
  getTurnContent = 'getTurnContent', // 获取轮灌信息内容
  createTurnContent = 'createTurnContent', // 获取轮灌信息内容
  updateTurnContent = 'updateTurnContent', // 获取轮灌信息内容
  deleteTurnContent = 'deleteTurnContent', // 删除轮灌信息内容 //组件间通讯

  turnIrrigationState = 'turnIrrigationState' // 轮灌状态事件
}

const bus = new Vue()

export function sha256 (data: any, key = '123456') {
  const hash = crypto
    .createHmac('sha256', key)
    .update(data)
    .digest('hex')

  return hash
}

export function emitterDeviceRealData (
  state: TurnStateInterface | TurnStateInterface[]
) {
  bus.$emit('deviceRealData', state)
}
export function onDeviceRealData (call: Function) {
  bus.$on('deviceRealData', call)
}

export function emitterTurnIrrigationState (
  state: TurnStateInterface | TurnStateInterface[]
) {
  bus.$emit('turnIrrigationState', state)
}
export function onTurnIrrigationState (call: Function) {
  bus.$on('turnIrrigationState', call)
}

export function emitterCheckUpdate (state: boolean) {
  bus.$emit('CheckUpdate', state)
}
export function onCheckUpdate (call: Function) {
  bus.$on('CheckUpdate', call)
}

export function upgradeDownloadProgress (call: Function) {
  window.ipc.on('upgrade-download-progress', (event: any, back: any) => {
    call(back)
  })
}

export function upgradeError (call: Function) {
  window.ipc.on('upgrade-error', (event: any, back: any) => {
    call(back)
  })
}

export function upgradeDownloaded (call: Function) {
  window.ipc.on('upgrade-downloaded', (event: any, back: any) => {
    call(back)
  })
}

export function event (eve: string, args: any): Promise<ResponedInterface> {
  const str = sha256(eve, JSON.stringify(args))
  const param = {
    event: eve,
    callback: (event: any, back: any) => {
      const temp = sha256(eve, JSON.stringify(back.ext))
      if (temp === str) {
        bus.$emit(str, back)
      }
    }
  }
  return new Promise((resolve, reject) => {
    // console.log(args);
    window.ipc.send(param.event, args)
    window.ipc.on(param.event, param.callback)
    bus.$once(str, (args: any) => {
      window.ipc.removeListener(param.event, param.callback)
      resolve(args)
    })
  })
}

export function getCurrentInfo () {
  return event(BusEvents.getCurrentInfo, { cmd: BusEvents.getCurrentInfo })
}
export function checkUpdate () {
  return event(BusEvents.checkUpdate, { cmd: BusEvents.checkUpdate })
}
export function confimUpdate () {
  return event(BusEvents.confimUpdate, { cmd: BusEvents.confimUpdate })
}
export function confimInstall () {
  return event(BusEvents.confimInstall, { cmd: BusEvents.confimInstall })
}

export function getReals (id?: number[] | number) {
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

export function setRelay (id: number, start: number, state: number) {
  return event(BusEvents.setRelay, { id, start, state })
}

export function setRadio (id: number, fer: number[]) {
  return event(BusEvents.setRadio, { id, fer })
}

export function getDevice (id?: number[] | number) {
  return event(BusEvents.getDeivce, { id })
}

export function createDeivce (device: object) {
  return event(BusEvents.createDeivce, device)
}
export function updateDeivce (device: object) {
  return event(BusEvents.updateDeivce, device)
}

export function deleteDeivce (id?: number[] | number) {
  return event(BusEvents.deleteDeivce, { fac_id: id })
}

export function getGroup (id?: number[] | number) {
  return event(BusEvents.getGroup, { id })
}
export function createGroup (device: object) {
  return event(BusEvents.createGroup, device)
}
export function updateGroup (device: object) {
  return event(BusEvents.updateGroup, device)
}
export function deleteGroup (id?: number[] | number) {
  return event(BusEvents.deleteGroup, { id: id })
}

export function getGroupDevice (id?: number[] | number) {
  return event(BusEvents.getGroupDevice, { id })
}
export function createGroupDevice (device: object) {
  return event(BusEvents.createGroupDevice, device)
}
export function updateGroupDevice (device: object) {
  return event(BusEvents.updateGroupDevice, device)
}
export function deleteGroupDevice (id?: number[] | number) {
  return event(BusEvents.deleteGroupDevice, { id: id })
}

export function getHistory (id: number[] | number) {
  return event(BusEvents.getHistory, { id })
}

export function getElement (id?: number[] | number) {
  return event(BusEvents.getElement, { id })
}

export function getFacType (id?: number[] | number) {
  return event(BusEvents.getFacType, { id })
}

export function getCrop (id?: number[] | number) {
  return event(BusEvents.getCrop, { id })
}

export function getFer (id?: number[] | number) {
  return event(BusEvents.getFer, { id })
}

export function getControlLog (id?: number[] | number) {
  return event(BusEvents.getControlLog, { id })
}

export function getRelayType (id?: number[] | number) {
  return event(BusEvents.getRelayType, { id })
}

export function getTurnRecord (id?: number[] | number) {
  return event(BusEvents.getTurnRecord, { id })
}
export function createTurnRecord (device: object) {
  return event(BusEvents.createTurnRecord, device)
}
export function updateTurnRecord (device: object) {
  return event(BusEvents.updateTurnRecord, device)
}
export function deleteTurnRecord (id?: number[] | number) {
  return event(BusEvents.deleteTurnRecord, { id })
}

export function getTurnFer (id?: number[] | number) {
  return event(BusEvents.getTurnFer, { id })
}
export function createTurnFer (device: object) {
  return event(BusEvents.createTurnFer, device)
}
export function updateTurnFer (device: object) {
  return event(BusEvents.updateTurnFer, device)
}
export function deleteTurnFer (id?: number[] | number) {
  return event(BusEvents.deleteTurnFer, { id })
}

export function getTurnContent (id?: number[] | number) {
  return event(BusEvents.getTurnContent, { id })
}
export function createTurnContent (device: object) {
  return event(BusEvents.createTurnContent, device)
}
export function updateTurnContent (device: object) {
  return event(BusEvents.updateTurnContent, device)
}
export function deleteTurnContent (id?: number[] | number) {
  return event(BusEvents.deleteTurnContent, { id })
}
