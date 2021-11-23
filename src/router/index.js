import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const RouteView = {
  render: () => h(resolveComponent('router-view')),
};

const routes = [
  {
    path: '/date-time-picker',
    name: 'dateTimePicker',
    component: () => import('/@/view/demo/DateTimePickerView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;