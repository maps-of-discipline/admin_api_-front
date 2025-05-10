import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { Permission } from "../interfaces/permission";
import type { Role } from "../interfaces/role";
import type { RolePermission } from "../interfaces/rolePermission";

// Получить информацию о правах доступа сервиса
export async function getServicePermissions(
  params: Service,
  page?: number,
  itemsPerPage?: number
): Promise<IResponse<Permission[]>> {
  try {
    let response;
    if (page && itemsPerPage) {
      response = await API.post(
        `/permission/filters?page=${page}&size=${itemsPerPage}`,
        {
          service_name: params.name,
        }
      );
    } else {
      response = await API.post("/permission/filters", {
        service_name: params.name,
      });
    }
    const permissions = response.data.data;
    const total = response.data.total;
    return { success: true, data: permissions, total };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при получении списка прав доступа";
    return { success: false, error: errorMessage };
  }
}

// Получить информацию о правах доступа у роли
export async function getServiceRolePermissions(
  params: Role
): Promise<IResponse<RolePermission[]>> {
  try {
    const response = await API.get(
      `/service-roles${params.id}/permissions`,
      {}
    );
    const rolePermissions = response.data.data;
    return { success: true, data: rolePermissions };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при получении списка прав доступа у роли";
    return { success: false, error: errorMessage };
  }
}

// Добавить к роли право доступа
export async function assingServiceRolePermission(
  role: Role,
  permission: Permission
): Promise<IResponse<RolePermission>> {
  try {
    const response = await API.post(`/service-roles/assign-permission`, {
      service_role_id: role.id,
      permission_id: permission.id,
    });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при добавлении права доступа к роли";
    return { success: false, error: errorMessage };
  }
}

// Убрать у роли право доступа
export async function revokeServiceRolePermission(
  role: Role,
  permission: Permission
): Promise<IResponse<RolePermission>> {
  try {
    const response = await API.post(`/service-roles/revoke-permission`, {
      service_role_id: role.id,
      permission_id: permission.id,
    });
    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при удалении права доступа у роли";
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
