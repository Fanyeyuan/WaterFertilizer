import net from 'net'
import log from '@/app/common/log'

export default class TcpServer {
  private server!: net.Server;
  private host!: string;
  private port!: number;

  /**
   * 目前支持 connected data close error
   * connected:   sock => void
   * data:        (sock,data:Buffer) => void
   * close:       (sock,had_error:boolean) => void
   * error:       (sock,error: Error)
   */
  private event: Map<string, Function> = new Map();
  private supportEvent: string[] = ['connected', 'data', 'close', 'error'];

  constructor (port: number, host = '0.0.0.0') {
    this.host = host
    this.port = port

    this.server = net.createServer()
    this.server.listen(port, host, () => {
      log.info('Server listening on ' + JSON.stringify(this.server.address()))
    })

    this.server.on('connection', sock => {
      this.onConnected(sock)

      sock.on('data', data => {
        this.onReceiveHandle(sock, data)
      })

      sock.on('close', data => {
        this.onCloseHandle(sock, data)
      })

      sock.on('error', error => {
        this.onErrorHandle(sock, error)
      })
    })
  }

  private onConnected (sock: net.Socket) {
    log.debug('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

    const event = this.event.get('connected')
    !!event && event(sock)
  }

  private onReceiveHandle (sock: net.Socket, data: Buffer) {
    log.debug(
      '接收的内容(' +
        sock.remoteAddress +
        ':' +
        sock.remotePort +
        ')->' +
        data.join(',')
    )

    const event = this.event.get('data')
    !!event && event(sock, data)
  }

  private onCloseHandle (sock: net.Socket, hadError: boolean) {
    log.error(
      'CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort + hadError
    )

    const event = this.event.get('close')
    !!event && event(sock, hadError)
  }

  private onErrorHandle (sock: net.Socket, error: Error) {
    log.error(
      'CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort + error.message
    )

    const event = this.event.get('error')
    !!event && event(sock, error)
  }

  public send (sock: net.Socket, data: number[]) {
    log.debug(
      '发送的内容(' +
        sock.remoteAddress +
        ':' +
        sock.remotePort +
        ')->' +
        data.join(' ')
    )
    const result = sock.write(Buffer.of(...data))
    if (!result) {
      log.warn('数据暂时无法写入缓存' + data.join(' ') + sock)
    }
  }

  public on (event: string, callback: Function) {
    if (this.supportEvent.indexOf(event) > -1) {
      this.event.set(event, callback)
    } else {
      log.warn(
        `目前不支持 ${event} 事件，仅支持 ${this.supportEvent.join(',')}`
      )
    }
  }
}
