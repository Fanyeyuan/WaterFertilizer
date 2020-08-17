import { ipcMain, BrowserWindow } from 'electron'
import { sha256, MyEventOn, MyEventEmiter } from '@/app/common/emitter'
import * as Server from '../service'
import * as Db from '../database'
import * as Model from '../database/model'
import log from '@/app/common/log'
import { deviceList, DeviceInterface, Device } from '../device/device'
import { ProtocolResponedInterface } from '@/app/main/service/protocol'

/**
 * 事件处理方式汇总表（相当于当前支持的事件）
 * event 事件名称  fun 处理方法
 */
const EventProcess: { event: string; fun: (args: any) => any }[] = [
  {
    event: 'getReal',
    fun: async (args: { id: number; addr?: number }) => {
      const device = deviceList.get(args.id)
      let result: ProtocolResponedInterface = {
        type: '',
        data: null,
        state: 0,
        msg: ''
      }
      if (device && device.sock) {
        try {
          result = await Server.ReadDeviceReals(device.sock)
          const dat: { [key: string]: any } = new Model.Reals()
          dat.fac_id = args.id; // eslint-disable-line
          dat.data_time = new Date().getTime(); // eslint-disable-line
          result.data.sensor.forEach((val: number, index: number) => {
            dat[`e${index + 1}`] = val
          })
          result.data.relay.forEach((val: number, index: number) => {
            dat[`jk${index + 1}`] = val
          })

          // const test = await Db.get(Db.tables.reals, { fac_id: args.id }); // eslint-disable-line
          // console.log(!!test, test);
          // if (!!test) {
          //   console.log(args.id + "1");
          await Db.update(Db.tables.reals, dat, { fac_id: args.id }); // eslint-disable-line
          // } else {
          //   console.log(args.id + "2");
          //   await Db.insert(Db.tables.reals, dat);
          // }
          await Db.insert(Db.tables.history, dat)
        } catch (error) {
          log.warn('API-getReal', args, error.message)
          result.state = 99
          result.msg = '设备返回超时'
        }
      } else {
        log.info('API-getReal 设备还未上线', args)
        result.state = 100
        result.msg = '设备还未上线'
      }

      result.ext = args
      return result
    }
  },
  {
    event: 'setRelays',
    fun: async (args: {
      id: number;
      start: number;
      num: number;
      state: number[];
      addr?: number;
    }) => {
      const device = deviceList.get(args.id)
      let result: ProtocolResponedInterface = {
        type: '',
        data: null,
        state: 0,
        msg: ''
      }
      if (device && device.sock) {
        try {
          result = await Server.writeDeviceJks(
            device.sock,
            args.start,
            args.num,
            args.state
          )
          const dat: { [key: string]: any } = {}
          args.state.forEach((val: number, index: number) => {
            dat[`jk${args.num + index}+1`] = val
          })
        } catch (error) {
          log.warn('API-setReals 失败', args, error.message)
          result.state = 99
          result.msg = '设备返回超时'
        }
      } else {
        log.info('API-setReals 设备还未上线', args)
        result.state = 100
        result.msg = '设备还未上线'
      }

      result.ext = args
      return result
    }
  },
  {
    event: 'setRelay',
    fun: async (args: {
      id: number;
      start: number;
      state: number;
      addr?: number;
    }) => {
      const device = deviceList.get(args.id)
      let result: ProtocolResponedInterface = {
        type: '',
        data: null,
        state: 0,
        msg: ''
      }
      if (device && device.sock) {
        try {
          result = await Server.writeDeviceJk(
            device.sock,
            args.start,
            args.state
          )
          const dat: { [key: string]: any } = {}
          dat[`jk${result.data.relay + 1}`] = result.data.state
          await Db.update(Db.tables.reals, dat, { fac_id: args.id }); // eslint-disable-line
        } catch (error) {
          log.warn('API-setReal 失败', args, error.message)
          result.state = 99
          result.msg = '设备返回超时'
        }
      } else {
        log.info('API-setReal 设备还未上线', args)
      }

      result.ext = args
      return result
    }
  }
]

/**
 * 事件订阅表
 * 初始化时，各窗口定义的接收事件
 * 服务器主动发送时，依据此表对各窗口发送消息
 */
const EventSubscribeList: Map<string, Electron.WebContents[]> = new Map()
/**
 * 发送事件集合
 * 如果已经存在 返回false  否则 返回true
 * @param event 事件名称
 * @param win 发送串口
 */
const setSubscribeList = (event: string, win: Electron.WebContents) => {
  let wins = EventSubscribeList.get(event)
  // wins ? wins.push(win) : (wins = [win]);
  if (wins) {
    // 相同进程 只保存一次
    const index = wins.findIndex(value => value.id === win.id) // 通过进程id 判断是否为同一个进程
    if (index < 0) wins.push(win)
    else return false
  } else {
    wins = [win]
  }
  EventSubscribeList.set(event, wins)
  return true
}
const getSubscribeList = (event: string) => {
  return EventSubscribeList.get(event)
}
const deleteSubscribeList = (event: string, args: any) => {
  const str = sha256(event, args.toString())
  return EventSubscribeList.delete(str)
}
const on = (event: string, win: Electron.WebContents) => {
  setSubscribeList(event, win)
}
const mainRadio = async (event: string, args: any) => {
  const process = EventProcess.find((value: any) => value.event === event)
  let back: any = {}
  if (process) {
    back = await process.fun(args)
    const lists = getSubscribeList(event)

    if (lists) {
      lists.forEach((win: Electron.WebContents) => {
        win.send(event, back)
      })
    }
  }
}

/**
 * 事件发布表
 * 各窗口获取数据时，发布的事件
 * key 是窗口发送事件(event)与内容(message)的sha256 校验后数据sha256(message,event)
 * 窗口发送事件后，服务器通过此表记录，随后执行操作，然后再依次返回
 */
const EventPublishList: Map<string, Electron.WebContents[]> = new Map()
/**
 * 发送事件集合
 * 如果已经存在 返回false  否则 返回true
 * @param event 事件名称
 * @param win 发送串口
 * @param args 发送参数
 */
const setPublishList = (
  event: string,
  win: Electron.WebContents,
  args: any
) => {
  const str = sha256(event, args.toString())
  let wins = EventPublishList.get(event)
  // wins ? wins.push(win) : (wins = [win]);
  if (wins) {
    // 相同进程 只保存一次
    const index = wins.findIndex(value => value.id === win.id)
    if (index < 0) wins.push(win)
    else return false
  } else {
    wins = [win]
  }
  EventPublishList.set(str, wins)
  return true
}
const getPublishList = (event: string, args: any) => {
  const str = sha256(event, args.toString())
  return EventPublishList.get(str)
}
const deletePublishListKey = (event: string, args: any) => {
  const str = sha256(event, args.toString())
  return EventPublishList.delete(str)
}

const distribute = (
  event: string,
  args: any,
  back: ProtocolResponedInterface
) => {
  const lists = getPublishList(event, args)

  if (lists) {
    lists.forEach((win: Electron.WebContents) => {
      win.send(event, back)
    })
    deletePublishListKey(event, args)
  }
}

const listener = (event: string) => {
  ipcMain.on(event, async (events, args) => {
    log.info('调用api--' + event, events.sender.id, args)
    const state = setPublishList(event, events.sender, args)

    if (state) {
      const process = EventProcess.find((value: any) => value.event === event)
      let back: any = {}
      if (process) {
        back = await process.fun(args)
        distribute(event, args, back)
      }
    }
  })
}

const defaultApi = () => {
  listener('getReal')
  listener('setRelays')
  listener('setRelay')
}

export { on, listener, defaultApi, mainRadio }
