interface Element {
  /**
   * 主键id 自增
   */
  id: number;

  /**
   * 序号
   */
  indexs: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 最小值
   */
  min: number;

  /**
   * 最大值
   */
  max: number;

  /**
   * 精度
   */
  prec: number;
}
export default Element
