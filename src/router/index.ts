import { createRouter, createWebHistory } from "vue-router";
import AuthEmailPage from "@/pages/AuthByEmail.vue";
import AuthPage from "@/pages/Auth.vue";
import MainPage from "@/pages/Main.vue";

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
    path: "/eauth",
    name: "AuthEmailPage",
    component: AuthEmailPage,
    meta: { title: "Авторизация по почте" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = "Admin API";
  document.title = (to.meta.title as string) || defaultTitle;

  // Проверка авторизации
  const isAuthenticated = !!localStorage.getItem("access_token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/auth");
    return;
  }

  next();
});

export default router;
