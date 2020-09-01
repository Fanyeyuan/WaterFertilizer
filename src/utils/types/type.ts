import {
  ApiLog,
  ControlLog,
  Crop,
  Device,
  FacType,
  Element,
  Fer,
  Group,
  GroupDevice,
  History,
  Reals,
  Relay,
  TurnContent,
  TurnFer,
  TurnRecord
} from '@/app/main/database/model'

export interface ResponedInterface {
  type: string; // 命令类型
  data: any; // 返回数据
  state: number; // 帧检查状态
  msg: string; // 帧检查信息
  ext?: any; // 返回数据扩展数据
}

export enum TurnStateEnum {
  init = 0,
  waiting,
  ongoing,
  pause,
  failure,
  success
}

export interface TurnContentStateInterface {
  id: number; // 灌溉制度      用来确认轮灌下使用的是哪一条灌溉制度
  state: number; // 0 初始状态 未启动， 1 等待执行中 2 成功， 3 失败， 4 操作中
  startTime: number; // 开始时间
  delayTime: number; // 等待时间
  pauseTime: number; // 暂停时间
  executionTime: number; // 当前制度需要执行的时间
  process: number; // 完成度
}

export interface TurnStateInterface {
  id: number; // 轮灌记录 编号  用来确认当前运行是哪一个记录
  state: number; // 0 初始状态 未启动， 1 等待执行中 2 成功， 3 失败， 4 操作中
  startTime: number; // 开始时间
  pauseTime: number; // 暂停时间
  endTime: number; // 结束时间
  executionTime: number; // 当前制度需要执行的时间
  process: number; // 完成度
  contentState: TurnContentStateInterface; // 当前灌溉制度状态
}

export interface TurnGroupContent {
  id: number; // 记录编号
  recordId: number; // 轮灌记录编号
  group: Group; // 灌区名称
  delay: number; // 延迟时间 分钟
  runTime: number; // 运行时间 分钟
  sequence: number; // 执行顺序
  type: number; // 施肥类型 1 仅灌溉 2 定时施肥 3 定量施肥 4 定比施肥
  fer: {
    id: number; // 肥料对用编号
    ferType: Fer;
    ferRatio: number; // 肥料比例
    ferWeight: number; // 施肥量
    ferTime: number; // 施肥时间
  }[];
}
export interface TurnRecordInterface {
  id: number;
  startTime: number;
  endTime: number;
  userId: number;
  name: string;
  createTime: number;
  state: number;
  group: TurnGroupContent[];
  remark?: string;
}

export interface DeviceInterface {
  id?: number;
  creator_id: number;
  fac_id: number; // eslint-disable-line
  create_time: number; // eslint-disable-line
  remark: string; // eslint-disable-line
  fac_name: string; // eslint-disable-line
  fac_type: FacType; // eslint-disable-line
  sensor: ChannelInfoInterface[];
  relay: RelayInfoInterface[];
  relay_extend: boolean; // eslint-disable-line
  relay_extend_count: 16; // eslint-disable-line
  exRelay: RelayInfoInterface[];
  longitude: number;
  latitude: number;
  read_interval: number; // eslint-disable-line
}
export interface ChannelInfoInterface {
  name: string;
  ele: Element;
  status?: number;
}
export interface RelayInfoInterface {
  index: 0;
  name: string;
  relay: Relay;
  status?: number;
}

export interface GroupDeviceInterface {
  id: number;
  facId: number; // 灌区对应的设备编号
  facName: string; // 灌区名称
  exp: number; // 阀门对应设备的第几个继电器
  group: Group; // 备份库信息
  device: DeviceInterface; // 设备信息
}
export interface GroupInterface {
  id: number;
  userId: number; // 创建用户id 无效
  name: string; // 灌区名称
  createTime: number; // 生成时间
  crop: Crop; // 对应作物
  machine: DeviceInterface; // 对应水肥机
  device: GroupDeviceInterface[]; // 灌区下设备
}
