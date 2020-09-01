/**
 * 灌溉逻辑开始
 */
import {
  TurnStateEnum,
  DeviceInterface,
  TurnRecordInterface,
  TurnGroupContent,
  GroupInterface,
  TurnStateInterface,
  ResponedInterface
} from './types/type'
import * as bus from './bus'
import { Group } from '@/app/main/database/model'

// 设置灌溉常数和灌区常数
let RecordList: TurnRecordInterface[] = []
let GroupList: GroupInterface[] = []
let DeviceList: DeviceInterface[] = []
const log = window.log
const repeatTimes = 3
const interval = 60 * 1000

function evalRecordList (list: TurnRecordInterface[]) {
  const now = new Date().getTime()
  list = JSON.parse(JSON.stringify(list))
  RecordList = list.filter(
    (item: TurnRecordInterface) =>
      item.state !== TurnStateEnum.failure &&
      item.state !== TurnStateEnum.success
  )
}
function evalGroupList (list: GroupInterface[]) {
  GroupList = JSON.parse(JSON.stringify(list))
}
function evalDeviceList (list: DeviceInterface[]) {
  DeviceList = JSON.parse(JSON.stringify(list))
}

// 当前灌溉制度的运行状态
const TurnState: TurnStateInterface = {
  id: 0,
  state: TurnStateEnum.init,
  startTime: 0,
  pauseTime: 0,
  endTime: 0,
  executionTime: 0,
  process: 0,
  contentState: {
    id: 0,
    state: 0,
    startTime: 0,
    delayTime: 0,
    pauseTime: 0,
    executionTime: 0,
    process: 0
  }
}

function setMechinePump (id: number, state = 0, isFer = false) {
  if (isFer) {
    return bus.setRelays(id, 0, 5, new Array(5).fill(state))
  } else {
    return bus.setRelay(id, 0, state)
  }
}

// 仅灌溉
async function onlyIrrigation (content: TurnGroupContent) {
  const now = new Date().getTime()
  const contentState = TurnState.contentState
  if (contentState.state === TurnStateEnum.init) {
    contentState.id = content.id
    contentState.state = TurnStateEnum.waiting
    contentState.startTime = now
    contentState.pauseTime = 0
    contentState.delayTime = content.delay
    contentState.executionTime = content.runTime + content.delay
    contentState.process = 0
    log.info(`轮灌${TurnState.id}-制度${contentState.id} 等待开始灌溉`)
  }

  if (contentState.state === TurnStateEnum.waiting) {
    if (
      now - contentState.startTime >=
      contentState.delayTime + contentState.pauseTime
    ) {
      // 水肥机
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(`轮灌${TurnState.id}-制度${contentState.id} 准备发送开泵指令`)
        const result = await setMechinePump(content.group.machine_id, 1)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送完毕，返回${result}`
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送开泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送开泵命令成功, 轮灌继续`
          )
          break
        }
      }
      // 灌区设备
      const group = GroupList.find(
        (group: GroupInterface) => group.id === content.group.id
      )
      if (group) {
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 准备开启灌区(${group.name})设备`
        )
        for (const device of group.device) {
          for (let i = 0; i < repeatTimes; i++) {
            // 重发
            if (device.exp) continue
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备开启灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.id, device.exp, 1)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回${result}`
            )

            if (result.state !== 0) {
              contentState.state = TurnStateEnum.failure
              i + 1 === repeatTimes &&
                log.info(
                  `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送开命令失败(${result.msg}), 轮灌结束，将开始下一个`
                )
            } else {
              log.info(
                `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送开命令成功, 轮灌继续`
              )
              break
            }
          }
        }
      } else {
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 下灌区${content.group.id} 未找到，结束灌溉`
        )
        contentState.state = TurnStateEnum.failure
      }

      if (contentState.state !== TurnStateEnum.failure) {
        contentState.state = TurnStateEnum.ongoing
      }
    }
  }

  if (contentState.state === TurnStateEnum.ongoing) {
    if (
      now - TurnState.contentState.startTime >=
      contentState.executionTime + contentState.pauseTime
    ) {
      // 水肥机 关闭
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 灌溉结束，准备发送关泵指令`
        )
        const result = await setMechinePump(content.group.machine_id, 0)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送关泵完毕，返回${result}`
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
          contentState.state = TurnStateEnum.ongoing
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令成功, 轮灌继续`
          )
          break
        }
      }

      // 灌区设备 关闭
      const group = GroupList.find(
        (group: GroupInterface) => group.id === content.group.id
      )
      if (group) {
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 准备关闭灌区(${group.name})设备`
        )
        for (const device of group.device) {
          for (let i = 0; i < repeatTimes; i++) {
            // 重发
            if (device.exp) continue
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备关闭灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.id, device.exp, 0)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回${result}`
            )

            if (result.state !== 0) {
              contentState.state = TurnStateEnum.failure
              i + 1 === repeatTimes &&
                log.info(
                  `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送关闭命令失败(${result.msg}), 轮灌结束，将开始下一个`
                )
            } else {
              log.info(
                `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送关闭命令成功, 轮灌继续`
              )
              break
            }
          }
        }
      } else {
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 下灌区${content.group.id} 未找到，结束灌溉`
        )
        contentState.state = TurnStateEnum.failure
      }
    }
  }

  if (contentState.state !== TurnStateEnum.pause) {
    contentState.process =
      (now - contentState.startTime - contentState.pauseTime) /
      contentState.executionTime
  }
}

function irrigationRun () {
  setInterval(async () => {
    const now = new Date().getTime()
    if (
      TurnState.state === TurnStateEnum.init ||
      TurnState.state === TurnStateEnum.failure ||
      TurnState.state === TurnStateEnum.success
    ) {
      const record = RecordList.find(
        (record: TurnRecordInterface) =>
          record.startTime <= now && record.endTime >= now
      )
      if (record) {
        if (TurnState.state === TurnStateEnum.init) {
          TurnState.id = record.id
          TurnState.state = TurnStateEnum.ongoing
        }
      }
    }
  }, interval)
}
