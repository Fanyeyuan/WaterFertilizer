import Vue from 'vue'
import crypto from 'crypto'

enum BusEvents {
  getReals = 'getReals', // 从库中获取多个实时数据
  getReal = 'getReal', // 发送指令给设备，获取实时数据
  setRelays = 'setRelays', // 设置同一设备下的多个继电器
  setRelay = 'setRelay', // 设置同一设备下的单个继电器
  getDeivces = 'getDeivces' // 设置同一设备下的单个继电器
}

export default class Bus extends Vue {
  static bus = new Bus();
  static install (
    Vue: Vue.VueConstructor,
    options: { name?: string } = {}
  ): void {
    const finalName = !options.name ? '$bus' : options.name

    Object.defineProperties(Vue.prototype, {
      [finalName]: {
        get (): Bus {
          return Bus.bus
        }
      }
    })
  }

  private sha256 (data: any, key = '123456') {
    const hash = crypto
      .createHmac('sha256', key)
      .update(data)
      .digest('hex')

    return hash
  }

  /**
   * 事件发布表
   * 各窗口获取数据时，发布的事件
   * key 是窗口发送事件(event)与内容(message)的sha256 校验后数据sha256(message,event)
   * 窗口发送事件后，服务器通过此表记录，随后执行操作，然后再依次返回
   */
  private EventPublishList: Map<string, string[]> = new Map();
  /**
   * 发送事件集合
   * 如果已经存在 返回false  否则 返回true
   * @param event 事件名称
   * @param win 发送串口
   * @param args 发送参数
   */
  private setPublishList = (event: string, args: any) => {
    const str = this.sha256(event, JSON.stringify(args))
    let wins = this.EventPublishList.get(event)
    if (wins) {
      // 相同进程 只保存一次
      const index = wins.findIndex(value => value === str)
      if (index < 0) wins.push(str)
      else return false
    } else {
      wins = [str]
    }
    this.EventPublishList.set(str, wins)
    return true
  };

  private getPublishList = (event: string, args: any) => {
    const str = this.sha256(event, JSON.stringify(args))
    return this.EventPublishList.get(str)
  };

  private deletePublishListKey = (event: string, args: any) => {
    const str = this.sha256(event, JSON.stringify(args))
    return this.EventPublishList.delete(str)
  };

  private distribute = (event: string, args: any, back: any) => {
    const lists = this.getPublishList(event, args)

    console.log(event, lists, args, back)
    if (lists) {
      lists.forEach((win: string) => {
        Bus.bus.$emit(win, back)
      })
      this.deletePublishListKey(event, args)
    }
  };

  private event (eve: string, args: any) {
    const str = this.sha256(eve, JSON.stringify(args))
    return new Promise(resolve => {
      const state = this.setPublishList(eve, args)
      if (state) {
        window.ipc.send(eve, args)
        window.ipc.on(eve, (event: any, back: any) => {
          this.distribute(eve, args, back)
          // console.log(str, args, back, this.EventPublishList);
        })
      }
      Bus.bus.$on(str, (args: any) => {
        resolve(args)
      })
    })
  }

  private getReals (id: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      window.ipc.send(BusEvents.getReals, { id })
      window.ipc.on(BusEvents.getReals, (event: any, args: any) => {
        Bus.bus.$emit(BusEvents.getReals, args)
      })
      Bus.bus.$on(BusEvents.getReals, (args: any) => {
        resolve(args)
      })
    })
  }

  private getReal (id: number) {
    return new Promise((resolve, reject) => {
      window.ipc.send(BusEvents.getReal, { id })
      window.ipc.on(BusEvents.getReal, (event: any, args: any) => {
        Bus.bus.$emit(BusEvents.getReal, args)
      })
      Bus.bus.$on(BusEvents.getReal, (args: any) => {
        resolve(args)
      })
    })
  }

  private setRelays (id: number, start: number, num: number, state: number[]) {
    return new Promise((resolve, reject) => {
      window.ipc.send(BusEvents.setRelays, { id, start, num, state })
      window.ipc.on(BusEvents.setRelays, (event: any, args: any) => {
        Bus.bus.$emit(BusEvents.setRelays, args)
      })
      Bus.bus.$on(BusEvents.setRelays, (args: any) => {
        resolve(args)
      })
    })
  }

  private setRelay (id: number, start: number, num: number, state: number) {
    return new Promise((resolve, reject) => {
      window.ipc.send(BusEvents.setRelay, { id, start, num, state })
      window.ipc.on(BusEvents.setRelay, (event: any, args: any) => {
        Bus.bus.$emit(BusEvents.setRelay, args)
      })
      Bus.bus.$on(BusEvents.setRelay, (args: any) => {
        resolve(args)
      })
    })
  }

  private getDevices (id?: number[]) {
    // return new Promise((resolve, reject) => {
    //   window.ipc.send(BusEvents.getDeivces, { id });
    //   window.ipc.on(BusEvents.getDeivces, (event: any, args: any) => {
    //     Bus.bus.$emit(BusEvents.getDeivces, args);
    //   });
    //   Bus.bus.$on(BusEvents.getDeivces, (args: any) => {
    //     resolve(args);
    //   });
    // });
    return this.event(BusEvents.getDeivces, { id })
  }
}
