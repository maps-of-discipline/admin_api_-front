export interface ILogin {
  login: string;
  password: string;
  service_name: string;
}
export interface ILoginByEmail {
  email: string;
  service_name: string;
}
export interface ISubmitLogin {
  login: string;
  code: string;
  service_name: string;
}
