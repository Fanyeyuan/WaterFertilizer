<template>
  <div class="about">
    <div>
      <p>软件版本:{{ info.version }}</p>
      <p>操作系统:{{ info.os }}</p>
      <p>Chromium版本:{{ info.chromeVer }}</p>
      <p>V8版本:{{ info.v8Ver }}</p>
      <p>Node版本:{{ info.nodeVer }}</p>
      <el-button :loading="isLoading" @click="checkUpdate">
        {{ getUpdateName }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as Bus from '@/utils/bus'
import { ResponedInterface } from '@/utils/types/type'
import { Button, Message, MessageBox, Dialog, Row, Col } from 'element-ui'

import sProgress from '@/components/home/TurnIrri/Progress.vue'
import { namespace } from 'vuex-class'
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
export default class About extends Vue {
  @versionModule.Getter('getHasNewVersion') private hasNewVersion!: boolean;
  @versionModule.Getter('getCurrentVersion') private info!: any;

  @versionModule.Action('saveHasNewVersion') saveHasNewVersion!: (
    param: boolean
  ) => void;

  @versionModule.Action('saveNewVersion') saveNewVersion!: (
    param: object
  ) => void;

  private isLoading = false;

  private checkUpdate () {
    if (!this.hasNewVersion) {
      this.isLoading = true

      Bus.checkUpdate()
        .then((res: ResponedInterface) => {
          this.isLoading = false
          if (res.state === 0) {
            // return res.data
            this.saveHasNewVersion(true)
            this.saveNewVersion(res.data)
            Bus.emitterCheckUpdate(this.hasNewVersion)
            console.log(res)
          } else {
            this.saveHasNewVersion(false)
            if (res.state === 99) Message.info(res.msg)
            else Message.error(res.msg)
          }
        })
        .catch((error: Error) => {
          console.log(error)
        })
    } else {
      Bus.emitterCheckUpdate(this.hasNewVersion)
    }
  }

  private get getUpdateName () {
    if (this.hasNewVersion) {
      return '开始更新'
    } else {
      return '检查更新'
    }
  }
}
</script>

<style lang="scss" scoped></style>
