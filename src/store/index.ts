import Vue from 'vue'
import Vuex from 'vuex'
import database from './modules/database'
import other from './modules/other'
import page from './modules/pageData'
import version from './modules/version'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    database,
    other,
    page,
    version
  }
})
