/**
 * 轮灌内容 信息
 */
class TurnContent {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 轮灌记录 编号
   */
  turn_record_id = 0;

  /**
   * 分组 编号
   */
  group_id = 0;

  /**
   * 灌区别称，如果没有，则用灌区名称代替
   */
  name!: string;

  /**
   * 执行顺序
   */
  sequence = 0;

  /**
   * 灌溉类型
   * 0-仅灌溉 1-定时 2-定量 3-定比
   */
  irrigation_type = 0;

  /**
   * 灌区等待时间
   * 单位 分钟
   */
  delay = 0;

  /**
   * 运行时间
   * 单位 分钟
   */
  run_time = 30;

  /**
   * 肥料通道1 配置编号
   */
  fer1 = 0;

  /**
   * 肥料通道2 配置编号
   */
  fer2 = 0;

  /**
   * 肥料通道3 配置编号
   */
  fer3 = 0;

  /**
   * 肥料通道4 配置编号
   */
  fer4 = 0;

  /**
   * 备注信息
   */
  remark!: string;
}
export default TurnContent
