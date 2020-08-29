import { ipcMain, BrowserWindow } from 'electron'
import { sha256, MyEventOn, MyEventEmiter } from '@/app/common/emitter'
import * as Server from '../service'
import * as Db from '../database'
import * as Model from '../database/model'
import log from '@/app/common/log'
import { deviceList, DeviceInterface, Device } from '../device/device'
import { ProtocolResponedInterface } from '@/app/main/service/protocol'

interface EventProcessInterface {
  event: string;
  fun: (args: any) => any;
}

/**
 * 事件处理方式汇总表（相当于当前支持的事件）
 * event 事件名称  fun 处理方法
 */
const EventProcess: EventProcessInterface[] = [
  {
    event: 'getReal',
    fun: async (args: { id: number; addr?: number }) => {
      const device = deviceList.get(args.id)
      let result: ProtocolResponedInterface = {
        type: 'getReal',
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

      return result
    }
  },
  {
    event: 'getReals', // 从数据库获取最新数据
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getReals',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.reals, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.reals, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.reals); // eslint-disable-line
        }

        if (test) {
          result.data = []

          test.forEach((element: any) => {
            const data = { id: element.fac_id, sensor: [], relay: [] }
            for (let i = 1; i <= 16; i++) {
              data.sensor.push(element[`e${i}`])
            }
            for (let i = 1; i <= 32; i++) {
              data.relay.push(element[`JK${i}`])
            }
            result.data.push(data)
          })
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前设备无实时数据'
        }
      } catch (error) {
        log.warn('API-getReal', args, error.message)
        result.state = 98
        result.msg = '数据库已断开'
      }

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
  },
  {
    event: 'getDeivce',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getDeivce',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.device, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.device, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.device); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前设备为建立'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'createDeivce', // 新建一个设备信息
    fun: async (args: { fac_id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'createDeivce',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        const device = await Db.get(Db.tables.device, { fac_id: args.fac_id })
        if (!device) {
          let test = await Db.insert(Db.tables.device, args); // eslint-disable-line
          result.data = test
          result.msg = '设备新建成功'
        } else {
          result.state = 96
          result.msg = '设备已存在，请修改ID 号'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'updateDeivce', // 新建一个设备信息
    fun: async (args: { fac_id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'updateDeivce',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        const device = await Db.get(Db.tables.device, { fac_id: args.fac_id })
        if (device) {
          const test = await Db.update(Db.tables.device, args, {
            fac_id: args.fac_id
          }); // eslint-disable-line
          result.data = test
          result.msg = '设备修改成功'
        } else {
          result.state = 96
          result.msg = '设备不存在，请修改ID 号'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'deleteDeivce',
    fun: async (args: { fac_id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'deleteDeivce',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        const test: any = await Db.del(Db.tables.device, {
          fac_id: args.fac_id
        })
        if (test) {
          result.data = test
          result.msg = '设备删除成功'
        } else {
          result.msg = '当前设备为建立'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getHistory',
    fun: async (args: { id: number | number[] }) => {
      const result: ProtocolResponedInterface = {
        type: 'getHistory',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.history, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.history, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          // test = await Db.all(Db.tables.history); // eslint-disable-line
          result.state = 97
          result.msg = '请指定设备ID 号'
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前设备没有历史数据'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getElement',
    fun: async (args: { indexs: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getElement',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.indexs instanceof Array) {
          test = await Db.all(Db.tables.element, { id: args.indexs }); // eslint-disable-line
        } else if (typeof args.indexs === 'number') {
          test = await Db.get(Db.tables.element, { id: args.indexs }); // eslint-disable-line
        } else if (typeof args.indexs === 'undefined') {
          test = await Db.all(Db.tables.element); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前元素序号不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getFacType',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getFacType',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.facType, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.facType, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.facType); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前设备类型不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getCrop',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getCrop',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.crop, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.crop, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.crop); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前作物不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getFer',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getFer',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.fer, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.fer, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.fer); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前肥料不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getGroup',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getGroup',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.group, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.group, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.group); // eslint-disable-line
        }
        if (test) {
          // if (test instanceof Array) {
          //   result.data = test.map(async group => {
          //     const device = await Db.all(Db.tables.groupDevice, {
          //       group_id: group.id
          //     });
          //     const crop = await Db.all(Db.tables.crop, { id: group.id });
          //     group.device = device;
          //     group.crop = crop;
          //     return group;
          //   });
          // } else {
          //   const device = await Db.all(Db.tables.groupDevice, { id: test.id });
          //   const crop = await Db.all(Db.tables.crop, { id: test.id });
          //   result.data.device = device;
          //   result.data.crop = crop;
          // }
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前灌区不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'createGroup', // 新建一个设备信息
    fun: async (args: { id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'createGroup',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test = await Db.insert(Db.tables.group, args); // eslint-disable-line
        result.data = test
        result.msg = '灌区新建成功'
      } catch (err) {
        log.warn('API-createGroup', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'updateGroup', // 更新一个灌区信息
    fun: async (args: { id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'updateGroup',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        const device = await Db.get(Db.tables.group, { id: args.id })
        if (device) {
          const test = await Db.update(Db.tables.group, args, {
            id: args.id
          }); // eslint-disable-line
          result.data = test
          result.msg = '灌区修改成功'
        } else {
          result.state = 96
          result.msg = '灌区不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'deleteGroup',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'deleteGroup',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test
        if (typeof args.id === 'undefined') {
          test = await Db.del(Db.tables.group); // eslint-disable-line
        } else {
          test = await Db.del(Db.tables.group, { id: args.id }); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '灌区删除成功'
        } else {
          result.msg = '当前灌区为建立'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getGroupDevice',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getGroupDevice',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.groupDevice, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.groupDevice, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.groupDevice); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前灌区设备不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'createGroupDevice', // 新建一个设备信息
    fun: async (args: { id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'createGroupDevice',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test = await Db.insert(Db.tables.groupDevice, args); // eslint-disable-line
        result.data = test
        result.msg = '灌区设备新建成功'
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'updateGroupDevice', // 更新一个灌区信息
    fun: async (args: { id: number; [key: string]: any }) => {
      const result: ProtocolResponedInterface = {
        type: 'updateGroupDevice',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        const device = await Db.get(Db.tables.groupDevice, { id: args.id })
        if (device) {
          const test = await Db.update(Db.tables.groupDevice, args, {
            id: args.id
          }); // eslint-disable-line
          result.data = test
          result.msg = '灌区设备修改成功'
        } else {
          result.state = 96
          result.msg = '灌区设备不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'deleteGroupDevice',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'deleteGroupDevice',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test
        if (typeof args.id === 'undefined') {
          test = await Db.del(Db.tables.groupDevice); // eslint-disable-line
        } else {
          test = await Db.del(Db.tables.groupDevice, { id: args.id }); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '灌区设备删除成功'
        } else {
          result.msg = '当前灌区设备未建立'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getControlLog',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getControlLog',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.logControl, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.logControl, { fac_id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.logControl); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前设备未控制过'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getRelayType',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getRelayType',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.relay, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.relay, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.relay); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前继电器类型不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getTurnRecord',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getTurnRecord',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.turnRecord, { indexs: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.turnRecord, { indexs: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.turnRecord); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前农事记录不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getTurnFer',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getTurnFer',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.turnFer, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.turnFer, { id: args.id }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.turnFer); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前肥料不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
      return result
    }
  },
  {
    event: 'getTurnContent',
    fun: async (args: { id: number | number[] | undefined }) => {
      const result: ProtocolResponedInterface = {
        type: 'getTurnContent',
        data: null,
        state: 0,
        msg: ''
      }
      try {
        let test: any
        if (args.id instanceof Array) {
          test = await Db.all(Db.tables.turnContent, {
            turn_record_id: args.id
          }); // eslint-disable-line
        } else if (typeof args.id === 'number') {
          test = await Db.get(Db.tables.turnContent, {
            turn_record_id: args.id
          }); // eslint-disable-line
        } else if (typeof args.id === 'undefined') {
          test = await Db.all(Db.tables.turnContent); // eslint-disable-line
        }
        if (test) {
          result.data = test
          result.msg = '数据获取成功'
        } else {
          result.msg = '当前农事记录不存在'
        }
      } catch (err) {
        log.warn('API-getReal', args, err.message)
        result.state = 98
        result.msg = '数据库已断开'
      }
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
  const str = sha256(event, JSON.stringify(args))
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
  const str = sha256(event, JSON.stringify(args))
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
  const str = sha256(event, JSON.stringify(args))
  return EventPublishList.get(str)
}
const deletePublishListKey = (event: string, args: any) => {
  const str = sha256(event, JSON.stringify(args))
  return EventPublishList.delete(str)
}

const distribute = (
  event: string,
  args: any,
  back: ProtocolResponedInterface
) => {
  const lists = getPublishList(event, args)
  // console.log(lists, back);
  if (lists) {
    lists.forEach((win: Electron.WebContents) => {
      win.send(event, back)
    })
    deletePublishListKey(event, args)
  }
}

const listener = (event: string) => {
  ipcMain.on(event, async (events, args) => {
    const state = setPublishList(event, events.sender, args)
    log.info('调用api--' + event, state, events.sender.id, args)

    if (state) {
      const process = EventProcess.find((value: any) => value.event === event)
      let back: any = {}
      if (process) {
        back = await process.fun(JSON.parse(JSON.stringify(args)))
        back.ext = args
        distribute(event, args, back)
      }
    }
  })
}

const defaultApi = () => {
  EventProcess.forEach((item: EventProcessInterface) => {
    listener(item.event)
  })
}

export { on, listener, defaultApi, mainRadio }
