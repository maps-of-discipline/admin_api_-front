import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { Permission } from "../interfaces/permission";

// Получить информацию о правах доступа сервиса
export async function getServicePermissions(
  params: Service
): Promise<IResponse<Permission[]>> {
  try {
    const response = await API.post("/permission/filters", {
      service_name: params.name,
    });
    const permissions = response.data.data;
    return { success: true, data: permissions };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при получении списка прав доступа";
    return { success: false, error: errorMessage };
  }
}

// Создать информацию о правах доступа сервиса
export async function createServicePermission(
  params: Permission
): Promise<IResponse<Permission>> {
  try {
    const response = await API.post("/permission", {
      service_id: params.service_id,
      title: params.title,
      verbose_name: params.verbose_name,
    });
    const permission = response.data.data;
    return { success: true, data: permission };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при создании информации о праве доступа";
    return { success: false, error: errorMessage };
  }
}

// Обновить информацию о правах доступа сервиса
export async function updateServicePermission(
  params: Permission
): Promise<IResponse<Permission>> {
  try {
    const response = await API.patch("/permission", {
      id: params.id,
      service_id: params.service_id,
      title: params.title,
      verbose_name: params.verbose_name,
    });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при изменении информации о праве доступа";
    return { success: false, error: errorMessage };
  }
}

// Удалить информацию о правах доступа сервиса
export async function deleteServicePermission(
  params: Permission
): Promise<IResponse<Permission>> {
  try {
    const response = await API.delete(`/permission/${params.id}`, {});
    const permission = response.data.data;
    return { success: true, data: permission };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при удалении информации о праве доступа";
    return { success: false, error: errorMessage };
  }
}
