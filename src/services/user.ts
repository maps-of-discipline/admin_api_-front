import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { User } from "../interfaces/user";

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
    return { success: true, data: users };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при получении списка пользователей";
    return { success: false, error: errorMessage };
  }
}
