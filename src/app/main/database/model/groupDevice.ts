/**
 * 分组对应设备
 */
class GroupDevice {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 创建时间
   */
  create_time = 0;

  /**
   * 分组编号
   */
  group_id = 0;

  /**
   * 设备Id
   */
  fac_id = 0;

  /**
   * 设备名称
   */
  name!: string;

  /**
   * 扩展信息-- 只对网关有效--表示第几个节点
   */
  exp = 0;

  /**
   * 备注信息
   */
  remark!: string;
}
export default GroupDevice
