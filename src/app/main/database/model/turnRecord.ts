/**
 * 轮灌记录信息
 */
class TurnRecord {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 创建设备 编号
   */
  user_id = 0;

  /**
   * 轮灌名称
   */
  name!: string;

  /**
   * 创建时间
   */
  create_time = 0;

  /**
   * 轮灌开启时间
   */
  start_time = 0;

  /**
   * 轮灌状态 0 - 初始状态， 1 成功， 2 失败， 3 操作中
   */
  state = 0;

  /**
   * 备注信息
   */
  remark!: string;
}
export default TurnRecord
