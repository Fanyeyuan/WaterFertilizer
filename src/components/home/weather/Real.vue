<template>
  <div
    class="real"
    v-loading="!data.length"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-scrollbar class="scrollbar" warpClass="wrapClass" :native="false">
      <el-row type="flex" :gutter="10">
        <el-col :span="8" v-for="(value, index) in data" :key="index">
          <div class="element">
            <div class="icon">
              <el-image
                class="image"
                :src="
                  `http://47.105.215.208:8081/images/onstage/element/${value.eNum}.png`
                "
                lazy
              ></el-image>
            </div>
            <div>
              <span>{{ value.eValue }} {{ value.eUnit }}</span>
            </div>
            <div>
              <span>{{ value.eName }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { Scrollbar, Image, Loading } from 'element-ui'
const pageModule = namespace('page')
Vue.use(Image)
Vue.use(Loading)
Vue.use(Scrollbar)

@Component
export default class Real extends Vue {
  @pageModule.Getter('getWeatherReal') private data!: any[];
}
</script>

<style lang="scss">
.real {
  height: 1.08rem;
  .wrapClass {
    height: 100%;
    margin-right: 0;
    margin-bottom: 0;
    overflow-y: hidden;
    overflow-x: auto;
  }
  .scrollbar {
    min-height: 100%;
    width: 100%;
    .element {
      margin-top: 0.02rem;
      text-align: center;
      color: #0af;
      .icon {
        margin: 0 auto;
        width: 0.7rem;
        height: 0.7rem;
        background: url("~@/assets/image/element_background.d25bba14.png")
          no-repeat;
        background-size: contain;

        .image {
          padding-top: 20%;
          width: 60%;
          height: 60%;
        }
      }
      span {
        font-size: 0.12rem;
      }
    }
  }
}
</style>
