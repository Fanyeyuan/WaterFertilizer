import { Commit } from 'vuex'
const state: any = {
  weather: {
    real: [],
    history: []
  },
  moisture: {
    real: [],
    history: []
  }
}

const mutations: any = {
  saveWeather (states: any, params: object) {
    states.weather = params
  },
  saveMoisture (states: any, params: object) {
    states.moisture = params
  }
}

const actions: any = {
  saveWeather (context: { commit: Commit }, params: object) {
    context.commit('saveWeather', params)
  },
  saveMoisture (context: { commit: Commit }, params: object) {
    context.commit('saveMoisture', params)
  }
}

const getters: any = {
  getWeatherReal (states: any) {
    return states.weather.real
  }
}

export default {
  namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
  state,
  mutations,
  actions,
  getters
}
