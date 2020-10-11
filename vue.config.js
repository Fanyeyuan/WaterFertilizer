module.exports = {
  devServer: {
    proxy: {
      '/baidu': {
        target: 'http://api.map.baidu.com',
        secure: false,
        pathRewrite: {
          '^/baidu': ''
        }
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      // nodeIntegration: true,
      mainProcessWatch: ['src/app/**/*.ts'],
      preload: 'src/preload.ts',
      builderOptions: {
        productName: 'lu-an',
        appId: 'com.flight.app.lu-an',
        buildVersion: '0.1.3',
        nsis: {},
        // asar: false,
        extraResources: [
          {
            from: './static',
            to: 'static'
          }
        ],
        publish: ['github']
      }
    }
  },
  lintOnSave: false
}
require('events').EventEmitter.defaultMaxListeners = 20
