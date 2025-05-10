import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { User } from "../interfaces/user";
import type { Role } from "../interfaces/role";

// Получить информацию о пользователях сервиса
export async function getServiceUsers(
  params: Service,
  page?: number,
  itemsPerPage?: number
): Promise<IResponse<User[]>> {
  try {
    let response;
    if (page && itemsPerPage) {
      response = await API.post(
        `/users/filters?page=${page}&size=${itemsPerPage}`,
        {
          service_name: params.name,
        }
      );
    } else {
      response = await API.post("/users/filters", {
        service_name: params.name,
      });
    }
    const users = response.data.data;
    const total = response.data.total;
    return { success: true, data: users, total };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при получении списка пользователей";
    return { success: false, error: errorMessage };
  }
}

// Получить информацию о пользовательских ролях сервиса
export async function getServiceUserRoles(
  user: User,
  service: Service
): Promise<IResponse<Role[]>> {
  try {
    const response = await API.post(
      `/users/${user.id}/get_roles_from_service?service_name=${service.name}`,
      {}
    );
    const userServiceRoles = response.data.roles;
    return { success: true, data: userServiceRoles };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при получении информации о ролях пользователя";
    return { success: false, error: errorMessage };
  }
}

// Добавить пользователю роль сервиса
export async function assingServiceUserRole(
  service_roles_id: Role,
  user_id: User
): Promise<IResponse<Role>> {
  try {
    const response = await API.post("user_service_roles", {
      service_roles_id: service_roles_id,
      user_id: user_id,
    });
    const userServiceRole = response.data;
    return { success: true, data: userServiceRole };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при добавлении информации о ролях пользователя";
    return { success: false, error: errorMessage };
  }
}

// Удалить у пользователя роль сервиса
export async function revokeServiceUserRole(
  service_user_role_id: Role
): Promise<IResponse<Role>> {
  try {
    const response = await API.delete(
      `user_service_roles/${service_user_role_id}`,
      {}
    );
    const userServiceRole = response.data;
    return { success: true, data: userServiceRole };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при добавлении информации о ролях пользователя";
    return { success: false, error: errorMessage };
  }
}
