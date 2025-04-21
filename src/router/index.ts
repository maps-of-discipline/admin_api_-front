import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../views/MainPage.vue';
import LoginPage from '../views/FormAuth.vue';
import UserWork from '../views/UserWork.vue';
import AuthService from '../views/AuthService.vue';
import AuthServiceByEmail from '../views/AuthServiceByEmail.vue';
// import PermissionsWork from '../views/PermissionsWork.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { title: "Авторизация" }
  },
  {
    path: '/user',
    name: 'UserWork',
    component: UserWork,
    meta: { title: "Пользователи" }
  },
  {
    path: '/loginServise',
    name: 'AuthService',
    component: AuthService,
    meta: { title: "Сервис авторизации" }
  },
  {
    path: '/loginServise/email',
    name: 'AuthServiceByEmail',
    component: AuthServiceByEmail,
    meta: { title: "Авторизация по Email" }
  },
  // {
  //   path: '/user/permissions',
  //   name: 'PermissionsWork',
  //   component: PermissionsWork,
  //   meta: { title: "Права доступа" }
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = "Мое приложение";
  document.title = (to.meta.title as string) || defaultTitle;
  next();
});

export default router;
