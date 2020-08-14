/**
 * 分组信息
 */
class Group {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 创建者编号
   */
  user_id = 0;

  /**
   * 分组名称
   */
  name!: string;

  /**
   * 创建时间
   */
  create_time = 0;

  /**
   * 创建时间
   */
  crop_id = 0;

  /**
   * 备注信息
   */
  remark!: string;
}
export default Group
