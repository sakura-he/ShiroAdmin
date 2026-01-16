import { request } from "./index";
import { z } from "zod";

// 菜单类型枚举
export enum AppMenuType {
    Catalog = "Catalog",
    Page = "Page",
    Button = "Button",
}

// 菜单状态枚举
export enum AppMenuStatus {
    ENABLE = "ENABLE",
    DISABLE = "DISABLE",
}

// 菜单数据类型
export const AppMenuSchema = z.object({
    id: z.number(),
    pid: z.number().nullable(),
    title: z.string(),
    permission: z.string(),
    type: z.enum(["Catalog", "Page", "Button"]),
    path: z.string().nullable(),
    icon: z.string().nullable(),
    order: z.number(),
    status: z.enum(["ENABLE", "DISABLE"]),
    created_at: z.string(),
    updated_at: z.string(),
});
export type AppMenu = z.infer<typeof AppMenuSchema>;

// 菜单树节点类型
export interface AppMenuTreeNode extends AppMenu {
    children: AppMenuTreeNode[];
}

// 创建菜单 DTO
export const CreateAppMenuSchema = z.object({
    pid: z.number().nullable().optional(),
    title: z.string(),
    permission: z.string(),
    type: z.enum(["Catalog", "Page", "Button"]),
    path: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    order: z.number().optional(),
    status: z.enum(["ENABLE", "DISABLE"]).optional(),
});
export type CreateAppMenuDto = z.infer<typeof CreateAppMenuSchema>;

// 更新菜单 DTO
export const UpdateAppMenuSchema = z.object({
    id: z.number(),
    pid: z.number().nullable().optional(),
    title: z.string().optional(),
    permission: z.string().optional(),
    type: z.enum(["Catalog", "Page", "Button"]).optional(),
    path: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    order: z.number().optional(),
    status: z.enum(["ENABLE", "DISABLE"]).optional(),
});
export type UpdateAppMenuDto = z.infer<typeof UpdateAppMenuSchema>;

// 获取 App 菜单树
export function getAppMenuTree() {
    return request({
        url: "/app/menu/tree",
        method: "get",
    });
}

// 获取 App 菜单列表（扁平结构）
export function getAppMenuList() {
    return request({
        url: "/app/menu/list",
        method: "get",
    });
}

// 获取单个 App 菜单详情
export function getAppMenu(id: number) {
    return request({
        url: "/app/menu/detail",
        method: "get",
        params: { id },
    });
}

// 创建 App 菜单
export function createAppMenu(data: CreateAppMenuDto) {
    return request({
        url: "/app/menu/create",
        method: "post",
        data,
    });
}

// 更新 App 菜单
export function updateAppMenu(data: UpdateAppMenuDto) {
    return request({
        url: "/app/menu/update",
        method: "post",
        data,
    });
}

// 删除 App 菜单
export function deleteAppMenu(id: number) {
    return request({
        url: "/app/menu/delete",
        method: "post",
        params: { id },
    });
}
