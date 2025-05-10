export interface User {
  id: string;
  external_id?: string;
  role: string;
  external_role?: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  login?: string;
  last_login?: string; // ISO date string (можно заменить на Date, если парсишь)
  created_at?: string; // ISO date string
}
