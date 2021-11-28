import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import GenPhoto from '../views/GenPhoto'
import Setting from '../views/Setting'
// import Compressor from '../views/Compressor'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: "生成证件照" },
    component: Home
  },
  {
    path: '/photo',
    name: 'photo',
    meta: { title: "生成证件照" },
    component: GenPhoto
  },
  {
    path: '/setting',
    name: 'setting',
    meta: { title: "设置" },
    component: Setting
  },
  // {
  //   path: '/compressor',
  //   name: 'compressor',
  //   meta: { title: "图片压缩" },
  //   component: Compressor
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta?.title || '生成证件照'
  next()
})
export default router
