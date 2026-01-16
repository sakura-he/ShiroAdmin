import { getAccountMenuListApi } from "@/api/account";
import { router } from "@/router";
import { coverRoute, firstRoute } from "@/router/routes";
import { NOT_FOUND_ROUTE } from "@/router/routes/base";
import { HOME, LOGIN } from "@/router/routes/constant";
import { MenuEnum } from "@/router/type";
import { recursiveTreeByLastLevel } from "@/utils/breadcrumb";
import createCache, { removeStoreByPrefix } from "@/utils/cache";
import { flat2treeByMap, flatOrder } from "@/utils/treeCover";
import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import { TabMeta, useMultipleTabs } from "../multipleTab";
export const STORE_ID = "navigate";
interface INavigateState {
    asyncMenuList: any[]; // 后端返回的原始菜单数组
    treeRoutes: any[]; // 生成的树桩路由数组
    flatRoutes: any[]; // 扁平化路由数组
    breadCrumb: any[]; // 面包屑数组
    currentRouter2MenuTreeLevel: number[];
    startPage: RouteRecordRaw | undefined;
}
let cache = createCache(STORE_ID);
export const useNavigateStore = defineStore(STORE_ID, () => {
    const asyncMenuList = ref<any[]>([]);
    const flatRoutes = ref<RouteRecordRaw[]>([]);
    const treeRoutes = ref<any[]>([]);
    const breadCrumb = ref<any[]>([]);
    const currentRouter2MenuTreeLevel = ref<number[]>([]);
    const startPage = ref<RouteRecordRaw | undefined>(undefined);
    const getAsyncMenu = async () => {
        try {
            let multipleStore = useMultipleTabs();
            const res = await getAccountMenuListApi();
            let asyncMenuListRes = res.data;
            // 排序,拼接完整路由路径
            asyncMenuListRes = flatOrder(asyncMenuListRes, {
                fieldsPath: "order",
                sequential: false,
            });
            asyncMenuList.value.length = 0;
            asyncMenuList.value.push(...asyncMenuListRes);
            // 生成vue-router路由记录
            let routeRecords = coverRoute(asyncMenuListRes);
            // 生成路由树提供给面包屑和菜单使用
            treeRoutes.value.length = 0;
            treeRoutes.value.push(
                ...flat2treeByMap(asyncMenuListRes, {
                    fieldsPath: "order",
                    sequential: false,
                })
            );

            // 返回第一个单页面,作为登录后的起始页
            startPage.value = firstRoute(routeRecords);
            if (startPage.value === undefined) {
                throw new Error("没有找到有效的起始页");
            }
            // 更改/路径的路由为第一个有效页面(以前是login)
            routeRecords.unshift({
                name: HOME,
                path: "/",
                redirect: {
                    name: startPage.value.name,
                },
            });
            // 最后,添加404路由
            routeRecords.push(NOT_FOUND_ROUTE as any);
            // 把生成的路由记录加载到vue-router中
            routeRecords.forEach((routeRecord: RouteRecordRaw) => {
                router.addRoute(routeRecord);
            });
            // 将路由中设置了 meta.is_resident 的路由添加到tab中
            router.getRoutes().forEach((routeRecord) => {
                if (routeRecord.meta.is_resident && routeRecord.meta.type === MenuEnum.Page) {
                    // 添加到tab中

                    let tabMeta: TabMeta = {
                        matchedComponentName: [routeRecord.meta.component_name as string],
                        isPin: true,
                    };
                    // 固定标签的要求:最终路径只能是 meta 中定义的路径和父路由拼接后的路径,不能是由 query
                    // 和 params 拼接的路径,同时,meta 中设置的 component_name 值要和路由最终匹配的
                    // 组件名称一致,否则会影响组件缓存
                    multipleStore.addResidentTab({
                        ...routeRecord,
                        fullPath: routeRecord.path,
                        query: {},
                        params: {},
                        hash: "",
                        tabMeta,
                    });
                }
            });
            // 更新store的routes,方便别的地方使用
            flatRoutes.value.length = 0;
            flatRoutes.value.push(...routeRecords);
            // 生成菜单和路由
        } catch (error) {
            console.log("@store/user/index/getAsyncMenu 获取异步菜单错误", error);
            return Promise.reject(error);
        }
    };
    const updateBreadcrumb = (id: number) => {
        // 更新面包屑
        let matches = recursiveTreeByLastLevel(id, treeRoutes.value, "id");

        breadCrumb.value = matches.rData;
        currentRouter2MenuTreeLevel.value = matches.floorArr;
    };
    const reset = () => {
        asyncMenuList.value.length = 0;
        flatRoutes.value.length = 0;
        treeRoutes.value.length = 0;
        breadCrumb.value.length = 0;
        currentRouter2MenuTreeLevel.value.length = 0;
        startPage.value = undefined;
        removeStoreByPrefix(STORE_ID);
        // 清空路由记录
        router.getRoutes().forEach((routeRecord) => {
            if (
                routeRecord.name &&
                routeRecord.name !== HOME &&
                routeRecord.name !== LOGIN &&
                routeRecord.name !== NOT_FOUND_ROUTE.name
            ) {
                router.removeRoute(routeRecord.name);
            }
        });
    };
    return {
        asyncMenuList,
        flatRoutes,
        treeRoutes,
        breadCrumb,
        currentRouter2MenuTreeLevel,
        startPage,
        getAsyncMenu,
        updateBreadcrumb,
        reset,
    };
});

type useNavigateStoreType = typeof useNavigateStore;
// 监听state指定键值改变并持久化到本地存储
export function subscribeNavigateStore(store: ReturnType<useNavigateStoreType>) {
   
    store.$subscribe(
        (mutation, state) => {
            
        },
        { detached: true }
    );
}
