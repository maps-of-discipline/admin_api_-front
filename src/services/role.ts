import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";
import type { Role } from "../interfaces/role";

// Получить информацию о ролях сервиса
export async function getServiceRoles(
  params: Service
): Promise<IResponse<Role[]>> {
  try {
    const response = await API.post("/service-roles/filters", {
      service_name: params.name,
    });
    const roles = response.data.data;
    return { success: true, data: roles };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при получении списка ролей";
    return { success: false, error: errorMessage };
  }
}
