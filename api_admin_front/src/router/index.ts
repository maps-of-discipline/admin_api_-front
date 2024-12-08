import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import LoginPage from '../views/FormAuth.vue';
import UserWork from '../views/UserWork.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/user',
    name: 'UserWork',
    component: UserWork,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
