import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as Bus from '@/utils/bus'

Vue.config.productionTip = false

Vue.prototype.$bus = Bus
// Vue.use(Bus)
// log.info("da");
// console.log(window);
// window.ipc.send("getReals", { id: 15112501 });
// window.ipc.on("getReal", (event: any, args: any) => {
//   console.log(event, args);
// });
// window.ipc.send("getReal", { id: 20190624 });
// window.ipc.send("setRelay", { id: 15112501, start: 0, state: 1 });
// window.ipc.on("setRelay", (event: any, args: any) => {
//   console.log(event, args);
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
