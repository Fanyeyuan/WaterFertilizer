export interface ResponedInterface {
  type: string; // 命令类型
  data: any; // 返回数据
  state: number; // 帧检查状态
  msg: string; // 帧检查信息
  ext?: any; // 返回数据扩展数据
}
