<template>
  <el-dialog
    title="下载进度"
    :visible.sync="visible"
    :center="true"
    :lock-scroll="true"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="50%"
  >
    <s-progress
      title="下载进度"
      :percentage="downloadProcess.percent"
    ></s-progress>
    <el-row type="flex" justify="space-between">
      <span>{{ getDownloaded }}MB</span>
      <span>{{ getNetRate }}KB/s</span>
      <span>{{ getTotal }}MB</span>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        :loading="this.isDownloading"
        type="primary"
        @click="confimInstall"
        >开始安装</el-button
      >
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as Bus from '@/utils/bus'
import { ResponedInterface } from '@/utils/types/type'
import {
  Button,
  Message,
  MessageBox,
  Dialog,
  Row,
  Col,
  version
} from 'element-ui'

import { namespace } from 'vuex-class'

import sProgress from '@/components/home/TurnIrri/Progress.vue'
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Row)
Vue.use(Col)
const versionModule = namespace('version')

@Component({
  components: {
    sProgress
  }
})
export default class Updater extends Vue {
  private visible = false;
  @versionModule.Getter('getHasNewVersion') private hasNewVersion!: boolean;
  @versionModule.Getter('getIsUpdating') private isUpdating!: boolean;
  @versionModule.Getter('getIsDownloading') private isDownloading!: boolean;
  @versionModule.Getter('getIsStopedUpdate') private isStopedUpdate!: boolean;
  @versionModule.Getter('getDownloadProcess') private downloadProcess!: any;
  @versionModule.Getter('getNewVersion') private newVersion!: any;

  @versionModule.Action('saveHasNewVersion') saveHasNewVersion!: (
    param: boolean
  ) => void;

  @versionModule.Action('saveIsUpdating') saveIsUpdating!: (
    param: boolean
  ) => void;

  @versionModule.Action('saveIsDownloading') saveIsDownloading!: (
    param: boolean
  ) => void;

  @versionModule.Action('saveIsStopedUpdate') saveIsStopedUpdate!: (
    param: boolean
  ) => void;

  @versionModule.Action('saveNewVersion') saveNewVersion!: (
    param: object
  ) => void;

  @versionModule.Action('saveCurrentVersion') saveCurrentVersion!: (
    param: object
  ) => void;

  @versionModule.Action('saveDownloadProcess') saveDownloadProcess!: (
    param: object
  ) => void;

  private get getDownloaded () {
    if (this.downloadProcess.transferred !== 0) {
      const downloaded = this.downloadProcess.transferred / 1024 / 1024
      return downloaded.toFixed(2)
    } else {
      return '--'
    }
  }

  private get getTotal () {
    if (this.downloadProcess.total !== 0) {
      const downloaded = this.downloadProcess.total / 1024 / 1024
      return downloaded.toFixed(2)
    } else {
      return '--'
    }
  }

  private get getNetRate () {
    if (this.downloadProcess.bytesPerSecond !== 0) {
      const downloaded = this.downloadProcess.bytesPerSecond / 1024
      return downloaded.toFixed(2)
    } else {
      return '--'
    }
  }

  private confimInstall () {
    // this.visible = false
    Bus.confimInstall()
      .then(console.log)
      .catch(console.log)
  }

  private checkUpdate () {
    return Bus.checkUpdate()
      .then((res: ResponedInterface) => {
        console.log(res)
        if (res.state === 0) {
          this.saveNewVersion(res.data[0]) // 保存新版本信息
          this.saveHasNewVersion(true) // 当前有需要更新的版本
          return res.data
        } else {
          this.saveHasNewVersion(false) // 当前没有需要更新的版本
          // Message.info(res.msg);
        }
      })
      .catch(console.log)
  }

  private confimUpdate (data: any) {
    const note = `<p>版本号：${data.version}</p> <p>更新时间：${data.releaseDate}</p>`
    MessageBox.confirm(note, '是否开始下载更新程序？', {
      closeOnClickModal: false,
      dangerouslyUseHTMLString: true,
      confirmButtonText: '开始下载',
      cancelButtonText: '取消'
    })
      .then(() => {
        this.visible = true
        Bus.confimUpdate()
          .then((res: ResponedInterface) => {
            console.log(res)
            if (res.state === 0) {
              this.saveIsUpdating(true)
              this.saveIsDownloading(true) // 当前开始下载程序
              this.saveIsStopedUpdate(false) // 保存当前进度
              this.saveDownloadProcess({
                // 下载进度
                total: 0,
                delta: 0,
                transferred: 0,
                percent: 0,
                bytesPerSecond: 0
              }) // 保存当前进度
            } else {
              this.saveIsUpdating(false)
              this.saveIsDownloading(false) // 当前开始下载程序
              this.saveIsStopedUpdate(true) // 保存当前进度
              Message.info(res.msg)
            }
          })
          .catch(console.log)
      })
      .catch(() => {
        this.saveIsUpdating(false)
        this.saveIsDownloading(false) // 当前开始下载程序
        this.saveIsUpdating(false)
        Message.info('暂不更新')
      })
  }

  private async mounted () {
    const version = await Bus.getCurrentInfo()
    this.saveCurrentVersion(version.data) // 保存当前版本信息

    // 开机时检查是否有更新，并提示
    const result = await this.checkUpdate()
    if (result) {
      this.confimUpdate(result[0])
    }
    setInterval(this.checkUpdate, 3600000) // 一小时检查一次

    Bus.onCheckUpdate((state: boolean) => {
      this.confimUpdate(this.newVersion)
    })
    Bus.upgradeDownloadProgress((res: any) => {
      this.saveDownloadProcess(res) // 保存当前进度
    })
    Bus.upgradeDownloaded((res: any) => {
      this.saveIsDownloading(false) // 当前下载程序结束
      const process = JSON.parse(JSON.stringify(this.downloadProcess))
      process.percent = 100
      this.saveDownloadProcess(process) // 保存当前进度
    })
    Bus.upgradeError((res: any) => {
      console.log(res)
      this.saveIsStopedUpdate(true) // 保存当前进度
      this.saveIsDownloading(false) // 当前开始下载程序
    })
  }
}
</script>

<style scoped></style>
