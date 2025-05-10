import { API, type IResponse } from "../services/api";
import {
  type ILogin,
  type ISubmitLogin,
  type ILoginByEmail,
} from "../interfaces/auth";
import { AxiosError } from "axios";

// Авторизация пользователя
export async function login(params: ILogin): Promise<IResponse<void>> {
  try {
    await API.post("users/login", params);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при авторизации";
    return { success: false, error: errorMessage };
  }
}

// Авторизация пользователя по почте
export async function loginByEmail(
  params: ILoginByEmail
): Promise<IResponse<string>> {
  try {
    const response = await API.post("users/login-by-email", params);
    const login = response.data;
    return { success: true, data: login };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при авторизации";
    return { success: false, error: errorMessage };
  }
}

export async function logout(): Promise<IResponse<void>> {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Ошибка при очистке localStorage" };
  }
}

// Подтверждение авторизации пользователя
export async function submit(params: ISubmitLogin): Promise<IResponse<void>> {
  try {
    const response = await API.post("users/verification_auth_code", params);
    const { access_token, refresh_token } = response.data;
    if (!access_token || !refresh_token) {
      return { success: false, error: "Ошибка при получении токена" };
    }
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user_id", response.data.user_id);
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при авторизации";
    return { success: false, error: errorMessage };
  }
}
