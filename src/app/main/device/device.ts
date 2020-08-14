interface XphElement {
  id: number; // 主键
  index: string; // 索引
  name: string; // 名称
  unit: string; // 单位
  min: number; // 最小值
  max: number; // 最大值
  prec: number; // 分辨率
}

interface XphRelay {
  id: number; // 主键
  index: number; // 继电器索引
  name: string; // 继电器名称
}

interface DeviceInterface {
  id: any; // 设备链接编号
  facId: number; // 设备ID
  createTime: number; // 生成事件
  remark: string; // 设备备注
  facName: string; // 设备名称
  ele: XphElement[]; // 设备要素
  relay: XphRelay[]; // 继电器
  relayExtend: XphRelay[]; // 扩展继电器
  longitude: number; // 经度
  latitude: number; // 纬度
}

export default deviceList
