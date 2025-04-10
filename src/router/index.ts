import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import LoginPage from '../views/FormAuth.vue';
import UserWork from '../views/UserWork.vue';
import AuthService from '../views/AuthService.vue';
import AuthServiceByEmail from '../views/AuthServiceByEmail.vue';

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
  {
    path: '/loginServise/email',
    name: 'AuthService',
    component: AuthServiceByEmail,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;
