import { Commit } from 'vuex'
const state: any = {
  DeviceList: []
}

const mutations: any = {
  saveDeviceList (states: any, params: object) {
    states.DeviceList = params
  }
}

const actions: any = {
  saveDeviceList (context: { commit: Commit }, params: object) {
    context.commit('saveDeviceList', params)
  }
}

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions
}
