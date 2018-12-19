import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Manage from './views/Manage.vue'

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: Login
    },
    {
      path: '/admin',
      component: Manage,
      name: 'manage',
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            title: '用户列表',
            label: ['用户列表']
          },
          component: Home
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = "管理后台"
  }
  next()
})
export default router