import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'tG072Ae4Isg6QFhZMoamvaclCIFr2sjA'
})
Vue.use(iView)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
