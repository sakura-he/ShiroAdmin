import "vue-router";
import { RouteMeta } from "vue-router";
export enum MenuEnum {
    Catalog = "Catalog",
    Page = "Page",
    Button = "Button",
}

export enum PageTypeEnum {
    Page = "PAGE",
    Link = "LINK",
    IFrame = "IFRAME",
}

export enum MenuStatusEnum {
    Enable = "Enable",
    Disable = "Disable",
}
export enum LayoutEnum {
    LAYOUT_DEFAULT = "LAYOUT_DEFAULT",
    LAYOUT_SIDE = "LAYOUT_SIDE",
    LAYOUT_TOP = "LAYOUT_TOP",
}
// 公共字段
interface BaseMeta  extends RouteMeta{
    id: number;
    pid: number | null;
    description: string | null;
    title: string;
    permission: string;
    icon?: string;
    order?: number;
    is_menu_visible: boolean;
    status: MenuStatusEnum;
    created_at?: Date;
    updated_at?: Date;
    [key: string]: any;
}

// Catalog 专属字段
export interface CatalogMeta extends BaseMeta {
    type: MenuEnum.Catalog;
    path: string;
    component_path: null;
    layout?: undefined;
    is_resident?: undefined;
    is_cache?: undefined;
    show_children: boolean;
}

// Page 专属字段
export interface PageMeta extends BaseMeta {
    type: MenuEnum.Page;
    path: string;
    component_path: string;
    component_name: string;
    layout: string;
    page_type: PageTypeEnum;
    is_resident: boolean;
    is_cache: boolean;
    is_tab_visible: boolean;
}

export interface ButtonMeta extends BaseMeta {
    type: MenuEnum.Button;
}
// 联合类型
export type StrictRouteMeta = CatalogMeta | PageMeta | ButtonMeta;
// src/types/router-meta.d.ts

declare module "vue-router" {
    interface RouteMeta {
        // 基础字段
        id?: number;
        pid?: number | null;
        description?: string | null;
        title?: string;
        permission?: string;
        icon?: string;
        order?: number;
        is_menu_visible?: boolean;
        status?: MenuStatusEnum;
        created_at?: Date;
        updated_at?: Date;

        // 菜单分类
        type?: MenuEnum;

        // Page 专属字段
        path?: string;
        component_path?: string|null;
        component_name?: string;
        layout?: LayoutEnum | string;
        page_type?: PageTypeEnum;
        is_resident?: boolean;
        is_cache?: boolean;
        is_tab_visible?: boolean;
        // Catalog 专属字段
        show_children?: boolean;

        // 其他字段兼容性兜底
        [key: string]: any;
    }
}
