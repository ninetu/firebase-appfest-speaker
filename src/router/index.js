import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import store from '@/store'
import Landing from '@/views/Landing'
import Login from '@/views/Login'
import Profile from '@/views/Profile'
import Hello from '@/views/Hello'
import Error404 from '@/views/Error404'
import Camera from '@/views/Camera'
import Dashboard from '@/views/Dashboard'
import Upload from '@/views/Upload'
import Gallery from '@/views/Gallery'
import Photo from '@/views/Photo'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // TODO: should we remember scroll position?
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Landing },
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          next(from)
        } else {
          next()
        }
      }
    },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          firebase.auth().signOut()
          next('/')
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      component: Upload,
      meta: { requiresAuth: true }
    },
    {
      path: '/camera',
      component: Camera,
      meta: { requiresAuth: true }
    },
    {
      path: '/gallery',
      component: Gallery,
      meta: { requiresAuth: true }
    },
    {
      path: '/photo/:id',
      component: Photo,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    { path: '/hello', component: Hello },
    { path: '*', component: Error404 }
  ]
})

/**
 * Check if a route requires authentication.
 * This is a global before hook for all routes,
 * checks if there are `meta: { requiresAuth: true }`
 * in all matched routes and sub routes.
 * If yes, redirect to `/login` and add original path to the query.
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
