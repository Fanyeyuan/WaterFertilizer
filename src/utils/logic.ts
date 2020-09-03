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
  ResponedInterface,
  TurnTypeEnum,
  TurnContentStateInterface
} from './types/type'
import * as bus from './bus'
import { Group } from '@/app/main/database/model'

// 设置灌溉常数和灌区常数
let RecordList: TurnRecordInterface[] = []
let GroupList: GroupInterface[] = []
let DeviceList: DeviceInterface[] = []
const log = window.log
const repeatTimes = 3
const unitTime = 1 * 1000
const interval = unitTime
const defaultState: TurnContentStateInterface = {
  id: 0,
  state: 0,
  startTime: 0,
  delayTime: 0,
  pauseTime: 0,
  executionTime: 0,
  process: 0
}

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
  currentContentIndex: 0,
  contentStates: []
}

function setMechinePump (id: number, state = 0, isFer = false) {
  if (isFer) {
    return bus.setRelays(id, 0, 5, new Array(5).fill(state))
  } else {
    return bus.setRelay(id, 4, state)
  }
}

// 仅灌溉
async function onlyIrrigation (content: TurnGroupContent) {
  const now = new Date().getTime()
  const contentState = TurnState.contentStates[TurnState.currentContentIndex]
  if (contentState.state === TurnStateEnum.init) {
    contentState.id = content.id
    contentState.state = TurnStateEnum.waiting
    contentState.startTime = now
    contentState.pauseTime = 0
    contentState.delayTime = content.delay * unitTime
    contentState.executionTime = content.runTime * unitTime + content.delay
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
          `轮灌${TurnState.id}-制度${contentState.id} 发送完毕，返回`,
          result
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备开启灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 1)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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
      now - contentState.startTime >=
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
          `轮灌${TurnState.id}-制度${contentState.id} 发送关泵完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备关闭灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 0)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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

      contentState.state === TurnStateEnum.failure ||
        (contentState.state = TurnStateEnum.success)
    }
  }

  if (contentState.state !== TurnStateEnum.pause) {
    contentState.process =
      (now - contentState.startTime - contentState.pauseTime) /
      contentState.executionTime
    contentState.process <= 1 || (contentState.process = 1)
  }
}

// 定时施肥
async function timerFer (content: TurnGroupContent) {
  const now = new Date().getTime()
  const contentState = TurnState.contentStates[TurnState.currentContentIndex]
  if (contentState.state === TurnStateEnum.init) {
    contentState.id = content.id
    contentState.state = TurnStateEnum.waiting
    contentState.startTime = now
    contentState.pauseTime = 0
    contentState.delayTime = content.delay * unitTime
    contentState.executionTime = content.runTime * unitTime + content.delay
    contentState.process = 0
    log.info(`轮灌${TurnState.id}-制度${contentState.id} 等待开始定时施肥`)
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
        const result = await setMechinePump(content.group.machine_id, 1, true)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送完毕，返回`,
          result
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备开启灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 1)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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
    // 肥料通道运行时间到
    const state = content.fer.map((fer: any) => {
      const remainTime =
        now -
        contentState.delayTime -
        contentState.startTime -
        contentState.pauseTime -
        fer.ferTime * unitTime
      if (remainTime > 0) {
        return 0
      } else {
        return 1
      }
    })
    if (state.includes(0)) {
      log.info(
        `轮灌${TurnState.id}-制度${contentState.id} 有肥料通道时间到，开始发送关闭指令`,
        state
      )
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        const result = await bus.setRelays(
          content.group.machine_id,
          0,
          4,
          state
        )
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道命令失败(${result.msg})`
            )
        } else {
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道命令成功`
          )
          break
        }
      }
    }
    // 灌区运行时间到
    if (
      now - contentState.startTime >=
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
          `轮灌${TurnState.id}-制度${contentState.id} 发送关泵完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备关闭灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 0)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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

      contentState.state === TurnStateEnum.failure ||
        (contentState.state = TurnStateEnum.success)
    }
  }

  if (contentState.state !== TurnStateEnum.pause) {
    contentState.process =
      (now - contentState.startTime - contentState.pauseTime) /
      contentState.executionTime
    contentState.process <= 1 || (contentState.process = 1)
  }
}

// 定比施肥
async function radioFer (content: TurnGroupContent) {
  const now = new Date().getTime()
  const contentState = TurnState.contentStates[TurnState.currentContentIndex]
  if (contentState.state === TurnStateEnum.init) {
    contentState.id = content.id
    contentState.state = TurnStateEnum.waiting
    contentState.startTime = now
    contentState.pauseTime = 0
    contentState.delayTime = content.delay * unitTime
    contentState.executionTime = content.runTime * unitTime + content.delay
    contentState.process = 0
    log.info(`轮灌${TurnState.id}-制度${contentState.id} 等待开始定比施肥`)
  }

  if (contentState.state === TurnStateEnum.waiting) {
    if (
      now - contentState.startTime >=
      contentState.delayTime + contentState.pauseTime
    ) {
      const fer = content.fer.map((fer: any) => fer.ferRatio)
      // 水肥机
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 准备发送设置肥料比例指令`
        )
        const result = await bus.setRadio(content.group.machine_id, fer)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送设置肥料比例完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          // i + 1 === repeatTimes &&
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送设置肥料比例命令失败(${result.msg}), 轮灌结束，将开始下一个`
          )
        } else {
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送设置肥料比例命令成功, 轮灌继续`
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备开启灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 1)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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
    // 灌区运行时间到
    if (
      now - contentState.startTime >=
      contentState.executionTime + contentState.pauseTime
    ) {
      // 关闭施肥模式
      const fer = content.fer.map((fer: any) => 200)
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 准备发送定比模式结束指令`
        )
        const result = await bus.setRadio(content.group.machine_id, fer)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送设置定比模式结束完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          // i + 1 === repeatTimes &&
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送设置定比模式结束命令失败(${result.msg}), 轮灌结束，将开始下一个`
          )
        } else {
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送设置定比模式结束命令成功, 轮灌继续`
          )
          break
        }
      }
      // 水肥机 关闭
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 灌溉结束，准备发送关泵指令`
        )
        const result = await setMechinePump(content.group.machine_id, 0, true)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送关泵完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备关闭灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 0)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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

      contentState.state === TurnStateEnum.failure ||
        (contentState.state = TurnStateEnum.success)
    }
  }

  if (contentState.state !== TurnStateEnum.pause) {
    contentState.process =
      (now - contentState.startTime - contentState.pauseTime) /
      contentState.executionTime
    contentState.process <= 1 || (contentState.process = 1)
  }
}

// 定量施肥
async function weightFer (content: TurnGroupContent) {
  const now = new Date().getTime()
  const contentState = TurnState.contentStates[TurnState.currentContentIndex]
  if (contentState.state === TurnStateEnum.init) {
    contentState.id = content.id
    contentState.state = TurnStateEnum.waiting
    contentState.startTime = now
    contentState.pauseTime = 0
    contentState.delayTime = content.delay * unitTime
    contentState.executionTime = content.runTime * unitTime + content.delay
    contentState.process = 0
    log.info(`轮灌${TurnState.id}-制度${contentState.id} 等待开始定时施肥`)
  }

  if (contentState.state === TurnStateEnum.waiting) {
    if (
      now - contentState.startTime >=
      contentState.delayTime + contentState.pauseTime
    ) {
      // 获取水肥机当前累计流量
      for (let i = 0; i < repeatTimes; i++) {
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 准备获取水肥机实时数据指令`
        )
        const result = await bus.getReal(content.group.machine_id)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送获取水肥机实时数据命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
          contentState.exp = []
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送获取水肥机实时数据命令成功, 轮灌继续`
          )
          break
        }
      }

      // 水肥机
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        log.info(`轮灌${TurnState.id}-制度${contentState.id} 准备发送开泵指令`)
        const result = await setMechinePump(content.group.machine_id, 1, true)
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送完毕，返回`,
          result
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备开启灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 1)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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
    // 肥料通道运行时间到
    const state = content.fer.map((fer: any) => {
      const remainTime =
        now -
        contentState.delayTime -
        contentState.startTime -
        contentState.pauseTime -
        fer.ferTime * unitTime
      if (remainTime > 0) {
        return 0
      } else {
        return 1
      }
    })
    if (state.includes(0)) {
      log.info(
        `轮灌${TurnState.id}-制度${contentState.id} 有肥料通道时间到，开始发送关闭指令`,
        state
      )
      for (let i = 0; i < repeatTimes; i++) {
        // 重发
        const result = await bus.setRelays(
          content.group.machine_id,
          0,
          4,
          state
        )
        log.info(
          `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道命令失败(${result.msg})`
            )
        } else {
          log.info(
            `轮灌${TurnState.id}-制度${contentState.id} 发送关肥料通道命令成功`
          )
          break
        }
      }
    }
    // 灌区运行时间到
    if (
      now - contentState.startTime >=
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
          `轮灌${TurnState.id}-制度${contentState.id} 发送关泵完毕，返回`,
          result
        )

        if (result.state !== 0) {
          contentState.state = TurnStateEnum.failure
          i + 1 === repeatTimes &&
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id} 发送关泵命令失败(${result.msg}), 轮灌结束，将开始下一个`
            )
        } else {
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
            if (device.exp === null) {
              log.info(device)
              continue
            }
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name}) 准备关闭灌区设备(${device.facName}-${device.exp}号阀门)`
            )
            const result = await bus.setRelay(device.facId, device.exp, 0)
            log.info(
              `轮灌${TurnState.id}-制度${contentState.id}-灌区(${group.name})-设备(${device.facName}-${device.exp}号阀门) 发送完毕，返回`,
              result
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

      contentState.state === TurnStateEnum.failure ||
        (contentState.state = TurnStateEnum.success)
    }
  }

  if (contentState.state !== TurnStateEnum.pause) {
    contentState.process =
      (now - contentState.startTime - contentState.pauseTime) /
      contentState.executionTime
    contentState.process <= 1 || (contentState.process = 1)
  }
}

let currentRecord: TurnRecordInterface | undefined
let timer: any
function irrigationRun () {
  if (!timer) {
    timer = setInterval(async () => {
      if (!RecordList.length || !GroupList.length || !DeviceList.length) {
        log.debug(interval, RecordList, GroupList, DeviceList)
        return
      }
      const now = new Date().getTime()
      if (
        TurnState.state === TurnStateEnum.init ||
        TurnState.state === TurnStateEnum.failure ||
        TurnState.state === TurnStateEnum.success
      ) {
        const record = RecordList.find((record: TurnRecordInterface) => {
          return record.startTime <= now && record.endTime >= now
        })
        if (record?.id !== currentRecord?.id) {
          log.info('查询到记录', currentRecord, now, TurnState.state)
        }
        currentRecord = record
      }

      if (currentRecord) {
        if (TurnState.state === TurnStateEnum.init) {
          log.info('准备开始轮灌')
          TurnState.id = currentRecord.id
          TurnState.state = TurnStateEnum.ongoing
          TurnState.startTime = currentRecord.startTime
          TurnState.pauseTime = 0
          TurnState.endTime = currentRecord.endTime
          TurnState.executionTime =
            currentRecord.endTime -
            currentRecord.startTime +
            TurnState.pauseTime
          TurnState.process = 0
          TurnState.currentContentIndex = 0
          for (let i = 0; i < currentRecord.group.length; i++) {
            TurnState.contentStates.push(
              JSON.parse(JSON.stringify(defaultState))
            )
          }
        }

        if (TurnState.state === TurnStateEnum.ongoing) {
          const currentContentState =
            TurnState.contentStates[TurnState.currentContentIndex]

          // 如果当前的灌区状态未完成或者失败，则开始下一个灌区
          if (
            currentContentState.state === TurnStateEnum.failure ||
            currentContentState.state === TurnStateEnum.success
          ) {
            TurnState.currentContentIndex++
            // 如果当前运行灌区索引大于当前灌区数量，则归结当前记录状态
            if (TurnState.currentContentIndex >= currentRecord.group.length) {
              TurnState.currentContentIndex = currentRecord.group.length - 1
              const index = TurnState.contentStates.findIndex(
                (state: TurnContentStateInterface) =>
                  state.state === TurnStateEnum.failure
              )
              TurnState.state =
                index > -1 ? TurnStateEnum.failure : TurnStateEnum.success
              log.info('轮灌完成', TurnState)
            }
          }
          const content = currentRecord.group.find(
            (group: TurnGroupContent, index: number) =>
              index === TurnState.currentContentIndex
          )
          if (content) {
            switch (content.type) {
              case TurnTypeEnum.onlyIrrigation:
                onlyIrrigation(content)
                break
              case TurnTypeEnum.timerFer:
                timerFer(content)
                break
              case TurnTypeEnum.weightFer:
                break
              case TurnTypeEnum.radioFer:
                radioFer(content)
                break
            }
          }
        }

        if (TurnState.state !== TurnStateEnum.pause) {
          TurnState.process =
            (now - TurnState.startTime - TurnState.pauseTime) /
            TurnState.executionTime
          TurnState.process <= 1 || (TurnState.process = 1)
        }
        // log.info("当前状态", TurnState);
        bus.emitterTurnIrrigationState(TurnState)
      }
    }, interval)
  }
}

export {
  irrigationRun,
  evalRecordList,
  evalGroupList,
  evalDeviceList,
  TurnState
}
