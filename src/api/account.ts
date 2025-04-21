import { request } from "./index";

export function getAccountMenuListAou() {
    return request("/account/get_user_menus", {
        method: "get",
    });
}
export function accountLoginByPasswordAPi(data: {username: string, password: string}) {
    return request("/account/login", {
        method: "post",
        data,
    });
}
export function getAccountInfoApi() {
    return request({
        url: "/account/get_account_info",
        method: "get",
    });
}
export function getSystemDemoTable() {
    return request("/api/system/demoTable", {
        method: "get",
    });
}

export function createMenu(data: any) {
    return request({
        url: "/menu/create_menu",
        method: "post",
        data,
    });
}
