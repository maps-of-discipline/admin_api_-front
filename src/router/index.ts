import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/pages/Auth.vue";
import AuthEmailPage from "@/pages/AuthByEmail.vue";
import LoginPage from "@/pages/Login.vue";
import LoginEmailPage from "@/pages/LoginByEmail.vue";
import MainPage from "@/pages/Main.vue";
import ServiceDetailsPage from "@/pages/ServiceDetails.vue";

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
    meta: { title: "Главная страница", requiresAuth: true },
  },
  {
    path: "/auth",
    name: "AuthPage",
    component: AuthPage,
    meta: { title: "Авторизация по ЕУЗ" },
  },
  {
    path: "/auth/email",
    name: "AuthEmailPage",
    component: AuthEmailPage,
    meta: { title: "Авторизация по почте" },
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
    meta: { title: "Авторизация по ЕУЗ" },
  },
  {
    path: "/login/email",
    name: "LoginEmailPage",
    component: LoginEmailPage,
    meta: { title: "Авторизация по почте" },
  },
  {
    path: "/service/:serviceId",
    name: "ServiceDetailsPage",
    component: ServiceDetailsPage,
    meta: { title: "Сервис" },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = "Админ API";
  document.title = (to.meta.title as string) + " | Админ API" || defaultTitle;
  // Проверка авторизации
  const isAuthenticated = !!localStorage.getItem("access_token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }
  next();
});

export default router;
