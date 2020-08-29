import Vue from 'vue'
import Vuex from 'vuex'
import database from './modules/database'
import other from './modules/other'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    database,
    other
  }
})
