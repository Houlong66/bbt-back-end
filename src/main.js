import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import VueAxios from "vue-axios"
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'

axios.defaults.withCredentials=true
Vue.config.productionTip = false
Vue.use(VueAxios,axios)
Vue.use(Element)
window.host = "http://segydi.cn:5001"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
