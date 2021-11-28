import Vue from 'vue'
import './plugins/axios'
import 'lib-flexible';
import App from './App.vue'
import router from './router'
import VueCropper from 'vue-cropper'
import Vant from 'vant';
import components from '@/components';
import 'vant/lib/index.css';
import './styles/base.css'
import { Dialog,Notify } from 'vant';

// 全局注册
Vue.use(Dialog);
Vue.use(Notify);
Vue.use(Vant);
Vue.use(VueCropper)
Vue.use(components)

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

// 读文件转成base64
Vue.prototype.$file2Base64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

Vue.prototype.$dataURLtoFile = (dataurl, filename)=>{
  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
