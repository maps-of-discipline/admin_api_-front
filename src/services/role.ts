import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { Role } from "../interfaces/role";

// Получить информацию о ролях сервиса
export async function getServiceRoles(
  params: Service,
  page?: number,
  itemsPerPage?: number
): Promise<IResponse<Role[]>> {
  try {
    let response;
    if (page && itemsPerPage) {
      response = await API.post(
        `/service-roles/filters?page=${page}&size=${itemsPerPage}`,
        {
          service_name: params.name,
        }
      );
    } else {
      response = await API.post("/service-roles/filters", {
        service_name: params.name,
      });
    }
    const roles = response.data.data;
    const total = response.data.total;
    return { success: true, data: roles,total };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при получении списка ролей";
    return { success: false, error: errorMessage };
  }
}

// Создать информацию о роли сервиса
export async function createServiceRole(
  params: Role
): Promise<IResponse<Role>> {
  try {
    const response = await API.post("/service-roles", {
      service_id: params.service_id,
      role: params.role,
      verbose_name: params.verbose_name,
    });
    const role = response.data.data;
    return { success: true, data: role };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при создании информации о роли";
    return { success: false, error: errorMessage };
  }
}

// Обновить информацию о роли сервиса
export async function updateServiceRole(
  params: Role
): Promise<IResponse<Role>> {
  try {
    const response = await API.patch("/service-roles", {
      id: params.id,
      service_id: params.service_id,
      role: params.role,
      verbose_name: params.verbose_name,
    });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при изменении информации о роли";
    return { success: false, error: errorMessage };
  }
}

// Удалить информацию о роли сервиса
export async function deleteServiceRole(
  params: Role
): Promise<IResponse<Role>> {
  try {
    const response = await API.delete(`/service-roles/${params.id}`, {});
    const role = response.data.data;
    return { success: true, data: role };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при удалении информации о роли";
    return { success: false, error: errorMessage };
  }
}
