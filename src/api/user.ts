import { request } from "./index";
export interface ILoginData {
    username: string;
    password: string;
}
export function loginApi({ username, password }: ILoginData) {
    return request.post("/user/login", {
        username,
        password,
    });
}
export function getMenuListApi() {
    return request.get("/account/get_user_menus");
}
export function getUserInfoApi(token: string) {
    return request.post("/api/user/info", { token });
}
