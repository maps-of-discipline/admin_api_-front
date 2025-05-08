import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";

// Получить все проекты
export async function getServices(): Promise<IResponse<Service[]>> {
  try {
    const response = await API.post("/services/filters", {});
    const projects = response.data.data;
    return { success: true, data: projects };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка получения списка сервисов";
    return { success: false, error: errorMessage };
  }
}

export async function getService(params: Service): Promise<IResponse<Service>> {
  try {
    const response = await API.get(`/services/${params.id}`, {});
    const project = response.data.data;
    return { success: true, data: project };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка получения информации о сервисе";
    return { success: false, error: errorMessage };
  }
}
