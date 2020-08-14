interface ApiLog {
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
   * 访问api 客户端IP
   */
  address: string;

  /**
   * 访问用户名称
   */
  username: string;

  /**
   * 访问 api 的类名
   */
  class_name: string;

  /**
   * 访问 api 的方法名
   */
  method_name: string;

  /**
   * 访问 api 的结果
   */
  result: string;
}
export default ApiLog
