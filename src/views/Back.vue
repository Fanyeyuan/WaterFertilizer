<template>
  <el-container class="container">
    <el-header class="header" height="0.6rem">
      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="22">
          <span class="title">智能水肥机</span>
        </el-col>
        <el-col :span="2">
          <router-link class="link" tag="span" to="/">首页</router-link>
        </el-col>
      </el-row>
      <div></div>
    </el-header>
    <el-container>
      <el-aside class="left" width="2rem">
        <el-menu
          class="el-menu-vertical-demo"
          router
          background-color="transparent"
          text-color="#ffffff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/back/mapView">
            <i class="el-icon-position"></i>
            <span slot="title">GIS</span>
          </el-menu-item>
          <el-menu-item index="/back/group">
            <i class="el-icon-s-management"></i>
            <span slot="title">分组管理</span>
          </el-menu-item>
          <el-menu-item index="/back/param">
            <i class="el-icon-coin"></i>
            <span slot="title">农事参数</span>
          </el-menu-item>
          <el-submenu index="/back/setting">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>设置</span>
            </template>
            <el-menu-item
              :index="item.path"
              v-for="(item, index) in settings"
              :key="index"
            >
              <template slot="title">{{ item.name }}</template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/back/about">
            <i class="el-icon-info"></i>
            <span slot="title">关于</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import {
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  MenuItemGroup
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)

interface BackSettingRouterInterface {
  name: string;
  path: string;
}

@Component
export default class Setting extends Vue {
  private readonly settings: BackSettingRouterInterface[] = [
    { name: '设备管理', path: '/back/setting/device' },
    { name: '其他', path: '/back/setting/other' }
  ];
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: url("~@/assets/image/background1.63d3ce38.jpg") no-repeat center;
  .header {
    background-color: rgba($color: #ffffff, $alpha: 0.3);
    .title {
      font-size: 0.26rem;
      line-height: 0.6rem;
    }
    .link {
      line-height: 0.6rem;
      cursor: pointer;
      &:hover {
        color: #409eff;
        // box-shadow: 0 0 5px rgba($color: white, $alpha: 0.6);
      }
    }
  }
  .left {
    background: rgba($color: #ffffff, $alpha: 0.1);

    .el-menu-vertical-demo {
      border: 0 !important;
    }

    .el-menu-item:focus {
      background: #6db6ff !important;
    }
    .el-submenu__title.is-active {
      background: #6db6ff !important;
    }
  }
}
</style>
