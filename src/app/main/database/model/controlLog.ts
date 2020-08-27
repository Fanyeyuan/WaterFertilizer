interface ControlLog {
  /**
   * 主键id 自增
   */
  id: number;

  /**
   * 生成时间
   */
  create_time: number;

  /**
   * 更新时间
   */
  update_time: number;

  /**
   * 设备编号
   */
  num: number;

  /**
   * 设备操作状态
   */
  state: number;

  /**
   * 操作结果
   * 0 - 关闭， 1 开启， 2 超时， 3操作中
   */
  result: number;
}
export default ControlLog
