import { request } from "./index";

export function getMenuList(params: Record<string, any>) {
    return request("/menu/get_all_menus", {
        method: "get",
    });
}
export function updateMenu(data: { id: number; [prop: string]: any }) {
    return request({
        url: "/menu/update_menu",
        method: "post",
        data,
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
export function deleteMenu(id: number) {
    return request({
        url: "/menu/delete_menu",
        method: "post",
        data: { menu_id: id },
    });
}
