import Vue from 'vue'
import crypto from 'crypto'

enum BusEvents {
  getReals = 'getReals', // 从库中获取多个实时数据
  getReal = 'getReal', // 发送指令给设备，获取实时数据
  setRelays = 'setRelays', // 设置同一设备下的多个继电器
  setRelay = 'setRelay', // 设置同一设备下的单个继电器
  getDeivces = 'getDeivces', // 获取数据库下设备信息， 如果指定id数组，则获取对应的设备信息，否则获取所有的
  getDeivce = 'getDeivce', // 获取指定id设备信息
  createDeivce = 'createDeivce', // 获取指定id设备信息
  getGroup = 'getGroup' // 获取指定id设备信息
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

  private event (eve: string, args: any) {
    const str = this.sha256(eve, JSON.stringify(args))
    return new Promise((resolve, reject) => {
      console.log(args)
      window.ipc.send(eve, args)
      window.ipc.on(eve, (event: any, back: any) => {
        const temp = this.sha256(eve, JSON.stringify(back.ext))
        if (temp === str) {
          Bus.bus.$emit(str, back)
        }
      })
      Bus.bus.$on(str, (args: any) => {
        resolve(args)
      })
    })
  }

  private getReals (id: number[] | number | undefined): Promise<any> {
    return this.event(BusEvents.getReals, { id })
  }

  private getReal (id: number) {
    return this.event(BusEvents.getReal, { id })
  }

  private setRelays (id: number, start: number, num: number, state: number[]) {
    return this.event(BusEvents.setRelays, { id, start, num, state })
  }

  private setRelay (id: number, start: number, num: number, state: number) {
    return this.event(BusEvents.setRelay, { id, start, num, state })
  }

  private getDevice (id: number[] | number | undefined) {
    return this.event(BusEvents.getDeivce, { id })
  }

  private createDeivce (device: object) {
    return this.event(BusEvents.createDeivce, device)
  }

  private getGroup (id: number[] | number | undefined) {
    return this.event(BusEvents.getGroup, { id })
  }
}
