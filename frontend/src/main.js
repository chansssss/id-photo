import Vue from 'vue'
import './plugins/axios'
import 'lib-flexible';
import App from './App.vue'
import router from './router'
import VueCropper from 'vue-cropper'
import Vant from 'vant';
import components from '@/components';
import filePlugin from '@/plugins/file.js';

import 'vant/lib/index.css';
import './styles/base.css'
import { Dialog,Notify } from 'vant';

// 全局注册
Vue.use(Dialog);
Vue.use(Notify);
Vue.use(Vant);
Vue.use(VueCropper)
Vue.use(components)
Vue.use(filePlugin)

Vue.config.productionTip = false

Vue.prototype.$dialog = Dialog;
Vue.prototype.$notify = Notify;
Vue.prototype.$delay = (function () {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
