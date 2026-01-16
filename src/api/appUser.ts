import { request } from "./index";
import { z } from "zod";

// 用户状态枚举
export enum AppUserStatus {
    ENABLE = 1,
    DISABLE = 0,
}

// 用户数据类型
export const AppUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    nickname: z.string().nullable(),
    avatar: z.string().nullable(),
    status: z.number(),
    is_delete: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});
export type AppUser = z.infer<typeof AppUserSchema>;

// 创建用户 DTO
export const CreateAppUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    nickname: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    status: z.number().optional(),
    roles: z.array(z.number()).optional(),
});
export type CreateAppUserDto = z.infer<typeof CreateAppUserSchema>;

// 更新用户 DTO
export const UpdateAppUserSchema = z.object({
    id: z.number(),
    username: z.string().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    nickname: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    status: z.number().optional(),
    roles: z.array(z.number()).optional(),
});
export type UpdateAppUserDto = z.infer<typeof UpdateAppUserSchema>;

// 查询参数类型
export interface AppUserListParams {
    username?: string;
    email?: string;
    phone?: string;
    status?: number;
    page: number;
    page_size: number;
}


// 获取 App 用户列表
export function getAppUserList(params: AppUserListParams) {
    return request({
        url: "/app/user/list",
        method: "get",
        params,
    });
}

// 获取单个 App 用户详情
export function getAppUser(id: number) {
    return request({
        url: "/app/user/detail",
        method: "get",
        params: { id },
    });
}

// 创建 App 用户
export function createAppUser(data: CreateAppUserDto) {
    return request({
        url: "/app/user/create",
        method: "post",
        data,
    });
}

// 更新 App 用户
export function updateAppUser(data: UpdateAppUserDto) {
    return request({
        url: "/app/user/update",
        method: "post",
        data,
    });
}

// 删除 App 用户
export function deleteAppUser(id: number) {
    return request({
        url: "/app/user/delete",
        method: "post",
        data: { id },
    });
}

// 重置 App 用户密码
export function resetAppUserPassword(id: number, password: string) {
    return request({
        url: "/app/user/reset-password",
        method: "post",
        data: { id, password },
    });
}

// 更新 App 用户状态
export function updateAppUserStatus(id: number, status: number) {
    return request({
        url: "/app/user/update-status",
        method: "post",
        data: { id, status },
    });
}

// 获取 App 用户的角色列表
export function getAppUserRoles(userId: number) {
    return request({
        url: "/app/user/roles",
        method: "get",
        params: { userId },
    });
}
