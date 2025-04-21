import { request } from "@/api/index";

export function demoPermissionTestApi(id: number) {
    return request({
        method: "get",
        url: "/user/test",
        params: { id },
    });
}
