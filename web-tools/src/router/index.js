import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/qr',
    name: 'qr-code',
    component: () => import('../views/QRCodeView.vue'),
  },
  {
    path: '/color-picker',
    name: 'color-picker',
    component: () => import('../views/ColorPickerView.vue'),
  },
  {
    path: '/base64',
    name: 'base64',
    component: () => import('../views/Base64View.vue'),
  },
  {
    path: '/uuid',
    name: 'uuid-generator',
    component: () => import('../views/UuidGeneratorView.vue'),
  },
  {
    path: '/password',
    name: 'password-generator',
    component: () => import('../views/PasswordGeneratorView.vue'),
  },
  {
    path: '/json',
    name: 'json-formatter',
    component: () => import('../views/JsonFormatterView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
