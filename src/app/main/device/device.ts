import { Element, Relay } from '@/app/main/database/model'
import net from 'net'

interface DeviceInterface {
  // 设备信息
  id: any; // 设备链接编号
  creatorId: number; // 用户id
  facId: number; // 设备ID
  createTime: number; // 生成时间
  remark?: string; // 设备备注
  facName?: string; // 设备名称
  facType: number; // 设备类型
  ele: Element[]; // 设备要素
  relay: Relay[]; // 继电器
  relayExtend?: Relay[]; // 扩展继电器
  longitude?: number; // 经度
  latitude?: number; // 纬度
  readInterval: number; // 读取时间间隔 分钟

  // 服务信息
  online: boolean;
  sock?: net.Socket;
  timeHand?: NodeJS.Timeout;
}

const deviceList: Map<number, DeviceInterface> = new Map()

class Device implements DeviceInterface {
  id = 0;
  creatorId = 0;
  facId = 0;
  createTime = 0;
  remark = '';
  facName = '';
  facType = 0;
  ele = [
    {
      id: 0,
      indexs: '',
      name: '-',
      unit: '',
      min: 0,
      max: 0,
      prec: 0
    }
  ];

  relay = [
    {
      id: 0,
      indexs: 0,
      name: '-'
    }
  ];

  longitude = 0;
  latitude = 0;
  readInterval = 0;

  online = true;
}

export { deviceList, DeviceInterface, Device }
