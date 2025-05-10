import axios from "axios";

export interface IResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
  total?: number;
}

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
