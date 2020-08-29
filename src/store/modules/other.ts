import { Commit } from 'vuex'
const state: any = {
  DeviceList: [],
  GroupList: []
}

const mutations: any = {
  saveDeviceList (states: any, params: object) {
    states.DeviceList = params
  },
  saveGroupList (states: any, params: object) {
    states.saveGroupList = params
  }
}

const actions: any = {
  saveDeviceList (context: { commit: Commit }, params: object) {
    context.commit('saveDeviceList', params)
  },
  saveGroupList (context: { commit: Commit }, params: object) {
    context.commit('saveGroupList', params)
  }
}

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions
}
