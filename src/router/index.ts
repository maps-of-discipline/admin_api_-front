import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import LoginPage from '../views/FormAuth.vue';
import UserWork from '../views/UserWork.vue';
import AuthService from '../views/AuthService.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/user',
    name: 'UserWork',
    component: UserWork,
  },
  {
    path: '/loginServise',
    name: 'AuthService',
    component: AuthService,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;
