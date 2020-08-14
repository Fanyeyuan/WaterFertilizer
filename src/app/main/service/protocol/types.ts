// xph 协议客户端响应解析后 返回给上层的结构
export interface ProtocolResponedInterface {
  type: string; // 命令类型
  data: any; // 返回数据
  state: number; // 帧检查状态
  msg: string; // 帧检查信息
  ext?: any; // 返回数据扩展数据
}

// xph 协议服务器欲发送数据的结构
export interface ProtocolRequestInterface {
  type: string; // 命令类型
  data: any; // 返回数据
  ext?: any; // 返回数据扩展数据
}

export interface ProtocolRequestContentInterface {
  type: string; // 命令类型
  data: number[]; // 返回数据
  state: boolean; // 打包是否成功  true 成功
  msg: string; // 打包错误信息
  ext?: any; // 返回数据扩展数据
}
