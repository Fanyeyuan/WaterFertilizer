/**
 * 轮灌 肥料通道配置
 */
class TurnFer {
  /**
   * 主键id 自增
   */
  id = 0;

  /**
   * 使用肥料 编号
   */
  fer_id = 0;

  /**
   * 施肥比
   */
  fer_ratio?: number = 0;

  /**
   * 施肥量
   */
  fer_weight?: number = 0;

  /**
   * 施肥时间
   */
  fer_time?: number = 0;
}
export default TurnFer
