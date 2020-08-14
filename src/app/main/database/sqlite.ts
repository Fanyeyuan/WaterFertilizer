import log from '@/app/common/log'
import relay from './model/relay'
import path from 'path'
const sqlite3 = require('sqlite3').verbose()

class Sqlite {
  private db!: typeof sqlite3;
  private tables: string[] = [
    'xph_device',
    'xph_element',
    'xph_log',
    'xph_log_control',
    'xph_log_lora_signal',
    'xph_relay',
    'xph_reals',
    'xph_history'
  ];

  constructor (dbName = 'db.db', dbDir: string = __dirname) {
    const dbPath = path.join(dbDir, dbName)
    this.db = new sqlite3.Database(dbPath)
    // this.db = new sqlite3.Database('db.db');       //临时目录  调试下可用，build后用不了
    // this.db = new sqlite3.Database(':memory:');    //保存在内存中
    log.info('sqlite 数据库地址:' + dbPath)
  }

  public getDeviceInfo () {
    this.db.all('SELECT * FROM ')
  }

  public getRelayInfo () {
    this.db.get('select * from xph_relay', console.log)
  }

  public close () {
    this.db.close()
  }
}
export default Sqlite
