import LinkComponent from "@/layout/components/Link.vue";
import { hasPermission } from "@/utils/permission";
import NotMatchComponent from "@/views/exception/not-match-component/NotMatchComponent.vue";
import { RouteRecordRaw, RouterView } from "vue-router";
import { MenuEnum, PageTypeEnum, StrictRouteMeta } from "../type";
// 匹配views里面所有的.vue文件，动态引入
const modules = import.meta.glob("/src/views/**/*.vue");
// modules应该是一下结构的对象
// /src/views/login/index.vue: () => import("/src/views/login/index.vue"),
// /src/views/login/Login.vue: () => import("/src/views/login/Login.vue"),
// /src/views/setting/setting.vue: () => import("/src/views/setting/setting.vue"),
export function getModulesKey() {
    return Object.keys(modules).map((item) => item.replace("/src/views/", "").replace(".vue", ""));
}
/**
 * 整理路由配置对象(排序和鉴权)
 */
export function sortAsyncRoutes<AsyncRoutes extends Array<any>>(
    asyncRoutes: AsyncRoutes
): AsyncRoutes {
    // 过滤路由项
    asyncRoutes = asyncRoutes.filter((route) => {
        // 在菜单中排除没有权限的路由
        if (!hasPermission(route.meta.roles || [])) {
            return false;
        }
        if (route.children && route.children.length) {
            route.children = sortAsyncRoutes(route.children);
        }
        return true;
    }) as AsyncRoutes;
    return asyncRoutes;
}

// 扁平路由数据拼接父节点路径,先从祖先节点一层一层向下拼接,直到孙节点
export function flatJoinPath(menus: Array<any>, parentPath: string = "", pid: number | null): any {
    menus.forEach((menu) => {
        // 寻找当前节点的父节点,并拼接父节点的路径
        if (menu.pid === pid) {
            menu.path = parentPath + menu.path;
            // 再次寻找是否有把当前节点当成父节点的节点
            flatJoinPath(menus, menu.path, menu.id);
        }
    });
}

export function coverRoute(menus: StrictRouteMeta[]): RouteRecordRaw[] {
    return menus
        .filter((menu) => menu.type !== MenuEnum.Button) // 过滤掉按钮类型的菜单
        .map((menu) => {
            const routeRecordRaw: RouteRecordRaw = {
                path: menu.path,
                name: menu.title || Symbol(menu.path ?? ""), // 加 null 合法保护
                meta: menu,
                component: null as any,
            };
            if (menu.type === MenuEnum.Catalog) {
                routeRecordRaw.component = RouterView;
            } else if (menu.type === MenuEnum.Page) {
                if (menu.page_type === PageTypeEnum.IFrame) {
                    // IFrame 不处理组件
                } else if (menu.page_type === PageTypeEnum.Link) {
                    routeRecordRaw.component = LinkComponent;
                } else {
                    routeRecordRaw.component = loadComponent4String(menu.component_path!);
                }
            }
            return routeRecordRaw;
        });
}

// 根据后端的路由配置components字段值,动态加载import.meta.glob中的动态组件
export function loadComponent4String(component: string) {
    try {
        // 在import.meta.glob生成的vue页面对象中,寻找出对应属性名包含传入的component名字符串的属性
        const findComponentPath = Object.keys(modules).find((key) => {
            return key.includes(`${component}.vue`);
        });
        if (findComponentPath) {
            let mo = modules[findComponentPath];
            return mo;
        }
        throw Error(`找不到组件${component}，请确保组件路径正确`);
    } catch (error) {
        console.error(error);
        return NotMatchComponent;
    }
}
// 寻找vue router的路由记录对象中第一个页面,作为登陆后跳转的首页
export function firstRoute(routes: RouteRecordRaw[]): RouteRecordRaw | undefined {
    for (const route of routes) {
        // 判断当前路由记录是不是个目录,是的话,尝试在路由记录的chlidren记录中寻找
        if (route.meta?.type === MenuEnum["Catalog"] && route.children) {
            let children = firstRoute(route.children);
            if (children) {
                return children;
            }
        }
        // 如果遍历中遇到meta.type=Page类型的路由记录,说明是个单页,终止遍历并返回,
        if (route.meta?.type === MenuEnum["Page"]) {
            return route;
        }
    }
}
