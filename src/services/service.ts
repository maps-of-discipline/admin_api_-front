import { API, type IResponse } from "../services/api";
import { type Service } from "../interfaces/service";
import { AxiosError } from "axios";

// Получить все сервисы
export async function getServices(): Promise<IResponse<Service[]>> {
  try {
    const response = await API.post("/services/filters", {});
    const services = response.data.data;
    return { success: true, data: services };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при получении списка сервисов";
    return { success: false, error: errorMessage };
  }
}

// Получить информацию о сервисе
export async function getService(params: Service): Promise<IResponse<Service>> {
  try {
    const response = await API.get(`/services/${params.id}`, {});
    const service = response.data;
    return { success: true, data: service };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при получении информации о сервисе";
    return { success: false, error: errorMessage };
  }
}

// Обновить информацию о сервисе
export async function updateService(
  params: Service
): Promise<IResponse<Service>> {
  try {
    const response = await API.patch(`/services`, {
      id: params.id,
      name: params.name,
      verbose_name: params.verbose_name,
    });
    const service = response.data;
    return { success: true, data: service };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message ||
      "Ошибка при изменении информации о сервисе";
    return { success: false, error: errorMessage };
  }
}

// Удалить информацию о сервисе
export async function deleteService(
  params: Service
): Promise<IResponse<Service>> {
  try {
    const response = await API.delete(`/services/${params.id}`, {});
    const service = response.data;
    return { success: true, data: service };
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const errorMessage =
      err.response?.data?.message || "Ошибка при удалении информации о сервисе";
    return { success: false, error: errorMessage };
  }
}
