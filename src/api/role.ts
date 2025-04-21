import { request } from "@/api/index";
import { mapValues } from "es-toolkit";
import { z } from "zod";

export const QueryListSchema = z.object({
    page_size: z.number().optional(),
    page: z.number().optional(),
});
export type QueryListDto = z.infer<typeof QueryListSchema>;
export const DetailRoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.union([z.string(), z.null()]),
    status: z.string(),
    code: z.string(),
    menus: z.array(z.number()),
    created_at: z.string(),
    updated_at: z.string(),
});
export type DetailRoleDto = z.infer<typeof DetailRoleSchema>;
export const CreateRoleSchema = z.object({
    name: z.string().trim(),
    description: z.union([z.string().trim().min(1), z.null()]),
    status: z.string(),
    code: z.string(),
    menus: z.array(z.number()),
});
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export const UpdateRoleSchema = z.object({
    name: z.string(),
    description: z.union([z.string().trim().min(1), z.null()]),
    status: z.string(),
    code: z.string(),
    menus: z.array(z.number()),
});
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;

// 获取角色列表
export function getRoleListApi(params: {} & QueryListDto) {
    return request({
        url: "/role/get_all_roles",
        method: "get",
        params,
    });
}

// 创建角色
export function createRoleApi(data: CreateRoleDto) {
    return request({
        url: "/role/create_role",
        method: "post",
        data: mapValues(data, (value) => {
            if (value === "") return null;
            return value;
        }),
    });
}

// 更新角色
export function updateRoleApi(id: number, data: UpdateRoleDto) {
    return request({
        url: "/role/update_role",
        method: "post",
        params: { id },
        data: mapValues(data, (value) => {
            if (value === "") return null;
            return value;
        }),
    });
}

// 删除角色
export function deleteRoleApi(id: number) {
    return request({
        url: `/role/delete_role`,
        method: "post",
        params: { id },
    });
}
// 获取指定角色的权限
export function getRoleMenusListApi(id: number) {
    return request({
        url: `/role/get_role_menus`,
        method: "get",
        params: { id },
    });
}
// 分配角色权限
export function assignRoleMenusApi(data: { role_id: number; menu_ids: number[] }) {
    return request({
        url: `/role/assign_menu`,
        method: "post",
        data,
    });
}
