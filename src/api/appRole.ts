import { request } from "./index";
import { z } from "zod";

// 角色状态枚举
export enum AppRoleStatus {
    ENABLE = "ENABLE",
    DISABLE = "DISABLE",
}

// 角色数据类型
export const AppRoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    status: z.enum(["ENABLE", "DISABLE"]),
    created_at: z.string(),
    updated_at: z.string(),
});
export type AppRole = z.infer<typeof AppRoleSchema>;

// 创建角色 DTO
export const CreateAppRoleSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string().nullable().optional(),
    status: z.enum(["ENABLE", "DISABLE"]).optional(),
    menus: z.array(z.number()).optional(),
});
export type CreateAppRoleDto = z.infer<typeof CreateAppRoleSchema>;

// 更新角色 DTO
export const UpdateAppRoleSchema = z.object({
    id: z.number(),
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["ENABLE", "DISABLE"]).optional(),
    menus: z.array(z.number()).optional(),
});
export type UpdateAppRoleDto = z.infer<typeof UpdateAppRoleSchema>;

// 查询参数类型
export interface AppRoleListParams {
    name?: string;
    code?: string;
    status?: string;
    page: number;
    page_size: number;
}

// 获取 App 角色列表
export function getAppRoleList(params: AppRoleListParams) {
    return request({
        url: "/app/role/list",
        method: "get",
        params,
    });
}


// 获取所有 App 角色（不分页）
export function getAllAppRoles() {
    return request({
        url: "/app/role/all",
        method: "get",
    });
}

// 获取单个 App 角色详情
export function getAppRole(id: number) {
    return request({
        url: "/app/role/detail",
        method: "get",
        params: { id },
    });
}

// 创建 App 角色
export function createAppRole(data: CreateAppRoleDto) {
    return request({
        url: "/app/role/create",
        method: "post",
        data,
    });
}

// 更新 App 角色
export function updateAppRole(data: UpdateAppRoleDto) {
    return request({
        url: "/app/role/update",
        method: "post",
        data,
    });
}

// 删除 App 角色
export function deleteAppRole(id: number) {
    return request({
        url: "/app/role/delete",
        method: "post",
        params: { id },
    });
}

// 为角色分配菜单权限
export function assignAppRoleMenus(roleId: number, menuIds: number[]) {
    return request({
        url: "/app/role/assign-menus",
        method: "post",
        data: { roleId, menuIds },
    });
}

// 获取角色已分配的菜单 ID 列表
export function getAppRoleMenus(roleId: number) {
    return request({
        url: "/app/role/menus",
        method: "get",
        params: { roleId },
    });
}
