import { Commit } from 'vuex'
const state: any = {
  ApiLog: [],
  ControlLog: [],
  Crop: [],
  Device: [],
  FacType: [],
  Element: [],
  Fer: [],
  Group: [],
  GroupDevice: [],
  History: [],
  Reals: [],
  Relay: [],
  TurnContent: [],
  TurnFer: [],
  TurnRecord: []
}

const mutations: any = {
  saveApiLog (states: any, params: object) {
    states.ApiLog = params
  },
  saveControlLog (states: any, params: object) {
    states.ControlLog = params
  },
  saveCrop (states: any, params: object) {
    states.Crop = params
  },
  saveDevice (states: any, params: object) {
    states.Device = params
  },
  saveFacType (states: any, params: object) {
    states.FacType = params
  },
  saveElement (states: any, params: object) {
    states.Element = params
  },
  saveFer (states: any, params: object) {
    states.Fer = params
  },
  saveGroup (states: any, params: object) {
    states.Group = params
  },
  saveGroupDevice (states: any, params: object) {
    states.GroupDevice = params
  },
  saveReals (states: any, params: object) {
    states.Reals = params
  },
  saveRelay (states: any, params: object) {
    states.Relay = params
  },
  saveTurnContent (states: any, params: object) {
    states.TurnContent = params
  },
  saveTurnFer (states: any, params: object) {
    states.TurnFer = params
  },
  saveTurnRecord (states: any, params: object) {
    states.TurnRecord = params
  }
}

const actions: any = {
  saveApiLog (context: { commit: Commit }, params: object) {
    context.commit('saveApiLog', params)
  },
  saveControlLog (context: { commit: Commit }, params: object) {
    context.commit('saveControlLog', params)
  },
  saveCrop (context: { commit: Commit }, params: object) {
    context.commit('saveCrop', params)
  },
  saveDevice (context: { commit: Commit }, params: object) {
    context.commit('saveDevice', params)
  },
  saveFacType (context: { commit: Commit }, params: object) {
    context.commit('saveFacType', params)
  },
  saveElement (context: { commit: Commit }, params: object) {
    context.commit('saveElement', params)
  },
  saveFer (context: { commit: Commit }, params: object) {
    context.commit('saveFer', params)
  },
  saveGroup (context: { commit: Commit }, params: object) {
    context.commit('saveGroup', params)
  },
  saveGroupDevice (context: { commit: Commit }, params: object) {
    context.commit('saveGroupDevice', params)
  },
  saveReals (context: { commit: Commit }, params: object) {
    context.commit('saveReals', params)
  },
  saveRelay (context: { commit: Commit }, params: object) {
    context.commit('saveRelay', params)
  },
  saveTurnContent (context: { commit: Commit }, params: object) {
    context.commit('saveTurnContent', params)
  },
  saveTurnFer (context: { commit: Commit }, params: object) {
    context.commit('saveTurnFer', params)
  },
  saveTurnRecord (context: { commit: Commit }, params: object) {
    context.commit('saveTurnRecord', params)
  }
}

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions
}
