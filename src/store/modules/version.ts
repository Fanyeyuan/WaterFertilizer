import { Commit } from 'vuex'
const state: any = {
  version: {
    hasNewVersion: false, // 有新的版本
    isUpdating: false, // 正在更新
    isDownloading: false, // 正在下载
    isStopedUpdate: false, // 更新结束
    newVersion: {}, // 新版本信息
    currentVersion: {}, // 当前版本信息
    downloadProcess: {
      // 下载进度
      total: 0,
      delta: 0,
      transferred: 0,
      percent: 0,
      bytesPerSecond: 0
    }
  }
}

const mutations: any = {
  saveHasNewVersion (states: any, params: boolean) {
    states.version.hasNewVersion = params
  },
  saveIsUpdating (states: any, params: boolean) {
    states.version.isUpdating = params
  },
  saveIsDownloading (states: any, params: boolean) {
    states.version.isDownloading = params
  },
  saveIsStopedUpdate (states: any, params: boolean) {
    states.version.isStopedUpdate = params
  },
  saveNewVersion (states: any, params: object) {
    states.version.newVersion = params
  },
  saveCurrentVersion (states: any, params: object) {
    states.version.currentVersion = params
  },
  saveDownloadProcess (states: any, params: object) {
    states.version.downloadProcess = params
  }
}

const getters: any = {
  getHasNewVersion (states: any) {
    return states.version.hasNewVersion
  },
  getIsUpdating (states: any) {
    return states.version.isUpdating
  },
  getIsDownloading (states: any) {
    return states.version.isDownloading
  },
  getIsStopedUpdate (states: any) {
    return states.version.isStopedUpdate
  },
  getNewVersion (states: any) {
    return states.version.newVersion
  },
  getCurrentVersion (states: any) {
    return states.version.currentVersion
  },
  getDownloadProcess (states: any) {
    return states.version.downloadProcess
  }
}

const actions: any = {
  saveHasNewVersion (context: { commit: Commit }, params: boolean) {
    context.commit('saveHasNewVersion', params)
  },
  saveIsUpdating (context: { commit: Commit }, params: boolean) {
    context.commit('saveIsUpdating', params)
  },
  saveIsDownloading (context: { commit: Commit }, params: boolean) {
    context.commit('saveIsDownloading', params)
  },
  saveIsStopedUpdate (context: { commit: Commit }, params: boolean) {
    context.commit('saveIsStopedUpdate', params)
  },
  saveNewVersion (context: { commit: Commit }, params: object) {
    context.commit('saveNewVersion', params)
  },
  saveCurrentVersion (context: { commit: Commit }, params: object) {
    context.commit('saveCurrentVersion', params)
  },
  saveDownloadProcess (context: { commit: Commit }, params: object) {
    context.commit('saveDownloadProcess', params)
  }
}

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions,
  getters
}
