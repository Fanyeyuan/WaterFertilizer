// import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from '@/app/common/log'
import * as Api from '../api'

// const updateUrl = 'http://updater.flight.com:8000/release/'
const updateUrl = 'http://ubuntu.local:1337/update/windows_64/'
// const updateUrl = 'https://github.com/Fanyeyuan/forwarding_tool/releases/last'
// 处理更新操作
const returnData = {
  error: {
    status: -1,
    msg: '更新时发生意外，无法进行正常更新！'
  },
  checking: {
    status: 0,
    msg: '正在检查更新……'
  },
  updateAva: {
    status: 1,
    msg: '检测到新版本,正在下载,请稍后'
  },
  updateNotAva: {
    status: 2,
    msg: '您现在使用的版本为最新版本,无需更新!'
  }
}

const setFeedURL = () => {
  // 更新连接
  // autoUpdater.logger = log;
  autoUpdater.autoInstallOnAppQuit = false
  autoUpdater.autoDownload = false
  autoUpdater.setFeedURL(updateUrl)
}

const checkForUpdate = () => {
  autoUpdater.checkForUpdates()
  return new Promise((resolve, reject) => {
    // 检查事件
    autoUpdater.once('checking-for-update', function (...param: any[]) {
      log.info(returnData.checking, param)
    })

    // 发现新版本
    autoUpdater.once('update-available', function (...param: any[]) {
      resolve(param)
      log.info(returnData.updateAva, param)
    })

    // 当前版本为最新版本
    autoUpdater.once('update-not-available', function (...param: any[]) {
      setTimeout(function () {
        reject(param)
        log.info(returnData.updateNotAva, param)
      }, 1000)
    })

    // 更新错误事件
    autoUpdater.once('error', function (error) {
      // sendUpdateMessage(returnData.error);
      reject(error)
      log.info(returnData.error, error)
    })
  })
}

const downloadUpdate = () => {
  return autoUpdater.downloadUpdate()
}
const quitAndInstall = () => {
  return autoUpdater.quitAndInstall()
}
const updateError = () => {
  // 更新错误事件
  autoUpdater.on('error', function (error) {
    // sendUpdateMessage(returnData.error);
    Api.mainRadio('upgrade-error1', returnData.error)
    log.info(returnData.error, error)
  })
}

const checkUpdate = () => {
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    // win.webContents.send("downloadProgress", progressObj);
    Api.mainRadio('upgrade-download-progress', progressObj)
    log.info('正在下载1', progressObj)
  })

  // 下载完毕
  autoUpdater.once('update-downloaded', function (...params: any[]) {
    // 退出并进行安装（这里可以做成让用户确认后再调用）
    // autoUpdater.quitAndInstall();
    Api.mainRadio('upgrade-downloaded', '下载完毕')
    log.info('下载完毕1', params)
  })
}

export {
  checkUpdate,
  setFeedURL,
  checkForUpdate,
  downloadUpdate,
  quitAndInstall,
  updateError
}
