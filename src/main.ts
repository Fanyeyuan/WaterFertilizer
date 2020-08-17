import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// log.info("da");
console.log(window)
// ipc.send("getReals", { id: 15112501 });
// ipc.on('getReal', (event: any, args: any) => {
//   console.log(event, args)
// })
// ipc.send('getReal', { id: 20190624 })
// ipc.send('setRelay', { id: 15112501, start: 0, state: 1 })
// ipc.on('setRelay', (event: any, args: any) => {
//   console.log(event, args)
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
