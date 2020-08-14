interface Device {
  /**
   * 主键id 自增
   */
  id: number;

  /**
   * 用户Id
   */
  creator_id: number;

  /**
   * 设备Id
   */
  fac_id: number;

  /**
   * 生成时间
   */
  create_time: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 设备名称
   */
  fac_name: string;

  /**
   * 设备类型Id
   */
  fac_type: number;

  /**
   * 设备通道配置 16个
   * -/-/-/- ... -/-
   */
  ele_num: string;

  /**
   * 设备通道名称
   * -/-/-/- ... -/-
   */
  ele_name: string;

  /**
   * 继电器通道配置 32个
   * 0/0/0/0 ... 0/0
   */
  relay_num: string;

  /**
   * 继电器通道名称
   * -/-/-/- ... -/-
   */
  relay_name: string;

  /**
   * 经度
   */
  longitude: number;

  /**
   * 纬度
   */
  latitude: number;

  /**
   * 读取时间间隔
   */
  read_interval: number;

  /**
   * 照片/暂无意义
   */
  photo: number;

  /**
   * 扩展继电器
   */
  relay_extend: boolean;

  /**
   * 扩展继电器数量
   */
  relay_extend_count: boolean;

  /**
   * 继电器通道配置
   * 0/0/0/0 ... 0/0
   */
  relay_extend_num: string;

  /**
   * 继电器通道名称
   * -/-/-/- ... -/-
   */
  relay_extend_name: string;

  /**
   * 设备 封面路径
   */
  cover_url: string;

  /**
   * 虫情相关
   * 暂无意义
   */
  pest_imei: string;
}
export default Device
