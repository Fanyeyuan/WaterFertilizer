class Device {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 用户Id
   */
  creator_id = 0;

  /**
   * 设备Id
   */
  fac_id = 0;

  /**
   * 生成时间
   */
  create_time = 0;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 设备名称
   */
  fac_name?: string;

  /**
   * 设备类型Id
   */
  fac_type = 0;

  /**
   * 设备通道配置 16个
   * -/-/-/- ... -/-
   */
  ele_num =
    '101/102/127/100/100/100/100/100/100/100/100/100/100/100/100/100';

  /**
   * 设备通道名称
   * -/-/-/- ... -/-
   */
  ele_name = '-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-';

  /**
   * 继电器通道配置 32个
   * 0/0/0/0 ... 0/0
   */
  relay_num =
    '1/2/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0/0';

  /**
   * 继电器通道名称
   * -/-/-/- ... -/-
   */
  relay_name = '-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-';

  /**
   * 经度
   */
  longitude?: number;

  /**
   * 纬度
   */
  latitude?: number;

  /**
   * 读取时间间隔
   */
  read_interval = 1;

  /**
   * 照片/暂无意义
   */
  photo?: number = 1;

  /**
   * 扩展继电器
   */
  relay_extend?: boolean;

  /**
   * 扩展继电器数量
   */
  relay_extend_count?: number;

  /**
   * 继电器通道配置
   * 0/0/0/0 ... 0/0
   */
  relay_extend_num?: string;

  /**
   * 继电器通道名称
   * -/-/-/- ... -/-
   */
  relay_extend_name?: string;

  /**
   * 设备 封面路径
   */
  cover_url?: string;

  /**
   * 虫情相关
   * 暂无意义
   */
  pest_imei?: string;
}
export default Device
