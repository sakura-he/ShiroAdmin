import { router } from "@/router";
import { WHITE_LIST } from "@/router/routes/constant";
import { PageTypeEnum } from "@/router/type";
import { removeStoreByPrefix } from "@/utils/cache";
import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";

import {
    CACHE_PREFIX,
    CACHE_TABS_CACHE_NAME,
    TABS_CACHE_NAME,
} from "@/store/modules/multipleTab/const";
import createCache from "@/utils/cache";
export type TTabRoute = Omit<RouteLocationNormalized, "matched" | "redirectedFrom"> & {
    tabMeta: {
        matchedComponentName: string[];
        isPin: boolean;
    };
};
export interface IMultipleTabState {
    tabs: TTabRoute[];
    cacheList: Set<string>;
    hasRefresh: boolean;
}
export interface TabMeta {
    matchedComponentName: string[];
    isPin: boolean;
}
const STORE_ID = "multiple_tab";
const MUTIPLE_TAB = "mutiple_table";
const multipleCache = createCache(CACHE_PREFIX);
// 初始化多标签页
let locationStorageCacheTabs = multipleCache.getCache(TABS_CACHE_NAME);
export const useMultipleTabs = defineStore(STORE_ID, () => {
    let tabs = ref<TTabRoute[]>([]);
    let cacheList = ref<Set<string>>(new Set());
    let hasRefresh = ref<boolean>(false);
    if (locationStorageCacheTabs instanceof Array && locationStorageCacheTabs.length) {
        initTab(locationStorageCacheTabs);
    }
    function addTab(route: TTabRoute) {
        if (!canAddRoute(route)) {
            return;
        }
        tabs.value.push(route);
        updateCacheList();
    }
    function addResidentTab(route: TTabRoute) {
        if (!canAddRoute(route)) {
            return;
        }
        tabs.value.push(route);
        updateCacheList();
    }
    // 是否允许添加新的路由对象到tabs数组中
    function canAddRoute(route: TTabRoute): boolean {
        let hasTab = tabs.value.findIndex((tab) => tab.fullPath === route.fullPath) >= 0;
        let is_tab_visible = route.meta.is_tab_visible as boolean;
        return !hasTab && is_tab_visible;
    }
    // 根据当前打开的标签页更新缓存的页面组件
    function updateCacheList() {
        let newCacheList: typeof cacheList.value = new Set();
        tabs.value.forEach((tab) => {
            if (canCacheTab(tab)) {
                console.log("验证通过", tab.tabMeta.matchedComponentName);
                tab.tabMeta.matchedComponentName.forEach((name) => {
                    newCacheList.add(name);
                });
            }
        });
        cacheList.value = newCacheList;
    }
    // 判断是否缓存标签页
    function canCacheTab(route: TTabRoute): boolean {
        // link 组件直接缓存,防止出现切换到 link 组件重复创建新的外部页面
        if (route.meta.page_type === PageTypeEnum.Link) return true;
        if (
            typeof route.name == "symbol" ||
            !route.meta?.is_cache ||
            WHITE_LIST.includes(route.name!)
        ) {
            return false;
        }
        return true;
    }
    // 关闭标签页
    function closeTab(index: number) {
        // 判断当前关闭的标签页时不是正在浏览的标签页
        let currentRoute = router.currentRoute.value;
        if (tabs.value[index].fullPath === currentRoute.fullPath) {
            // 关闭的是正在浏览的标签页
            closeCurrentTab();
        } else {
            tabs.value.splice(index, 1);
        }
        // 在keep-alive的缓存数组中一并删除
        updateCacheList();
    }
    // 关闭当前标签页
    function closeCurrentTab() {
        const currentRoute = router.currentRoute.value;
        const index = tabs.value.findIndex((tab) => tab.fullPath === currentRoute.fullPath);
        if (index === tabs.value.length - 1) {
            // 当前打开的页面为最右侧的标签页,关闭后激活剩余标签页的最后一个标签
            tabs.value.pop();
            tabs.value.length && router.replace(tabs.value[tabs.value.length - 1].fullPath);
        } else {
            // 不是最后的标签,关闭后激活右侧的标签
            tabs.value.splice(index, 1);
            router.replace(tabs.value[index].fullPath);
        }
    }
    // 关闭指定标签页的右侧标签页
    function closeRigthTabs(tabIndex: number) {
        let currentRoute = router.currentRoute.value;
        let newTabs: TTabRoute[];
        newTabs = tabs.value.filter((item, index) => {
            // 保存指定标签及左侧的标签
            let isSaveIndex = index <= tabIndex;
            // 判断标签是否是已固定
            let isResidentTab = item.tabMeta.isPin;
            return isSaveIndex || isResidentTab;
        });
        tabs.value = newTabs;
        updateCacheList();
        // 判断当前打开的标签页有没有关闭,没有关闭就不跳转路由,关闭了,跳转到tabIndex页面
        let hasCurrentRoute =
            newTabs.findIndex((tab) => tab.fullPath === currentRoute.fullPath) > 0 ? true : false;
        if (!hasCurrentRoute) {
            router.replace(tabs.value[tabIndex].fullPath);
        }
    }
    // 关闭左侧标签页
    function closeLeftTabs(tabIndex: number) {
        let currentRoute = router.currentRoute.value;
        let newTabs: TTabRoute[];
        newTabs = tabs.value.filter((item, index) => {
            let isSaveIndex = index >= tabIndex;
            let isPin = item.tabMeta.isPin;
            return isSaveIndex || isPin;
        });
        tabs.value = newTabs;
        updateCacheList();
        // 判断当前打开的标签页有没有关闭,没有关闭就不跳转路由,关闭了,跳转到tabIndex页面
        let hasCurrentRoute =
            newTabs.findIndex((tab) => tab.fullPath === currentRoute.fullPath) > 0 ? true : false;
        if (!hasCurrentRoute) {
            router.replace(tabs.value[tabIndex].fullPath);
        }
    }
    // 关闭所有标签页
    function closeAllTabs(tabIndex: number) {
        let currentRoute = router.currentRoute.value;
        let newTabs: TTabRoute[];
        newTabs = tabs.value.filter((item, index) => {
            let isPin = item.tabMeta.isPin;
            return isPin;
        });
        tabs.value = newTabs;
        updateCacheList();
        // 判断当前打开的标签页有没有关闭,没有关闭就不跳转路由,关闭了,跳转到tabIndex页面
        let hasCurrentRoute =
            newTabs.findIndex((tab) => tab.fullPath === currentRoute.fullPath) > 0 ? true : false;
        if (!hasCurrentRoute) {
            // bug 跳转到 fistroute
            // router.replace();
        }
    }

    // 关闭其他标签页
    function closeOtherTabs(tabIndex: number) {
        let currentRoute = router.currentRoute.value;
        let newTabs: TTabRoute[];
        newTabs = tabs.value.filter((item, index) => {
            let isSaveIndex = index == tabIndex;
            let isPin = item.tabMeta.isPin;
            return isSaveIndex || isPin;
        });
        tabs.value = newTabs;
        updateCacheList();
        // 判断当前打开的标签页有没有关闭,没有关闭就不跳转路由,关闭了,跳转到tabIndex页面
        let hasCurrentRoute =
            newTabs.findIndex((tab) => tab.fullPath === currentRoute.fullPath) > 0 ? true : false;
        if (!hasCurrentRoute) {
            router.replace(tabs.value[tabIndex].fullPath);
        }
    }
    // 切换固定状态
    function switchResidentTab(index: number) {
        if (!tabs.value[index].meta.is_resident) {
            tabs.value[index].tabMeta.isPin = !tabs.value[index].tabMeta.isPin;
        }
    }
    // 初始化标签页
    function initTab(tabs: Array<TTabRoute>) {
        if (tabs && tabs instanceof Array && tabs.length) {
            tabs.forEach((tab) => {
                addTab(tab);
            });
        }
    }
    // 获取当前路由对应的 tab s
    function getCurrentTab() {
        const currentRoute = unref(router.currentRoute);
        return tabs.value.find((tab) => {
            return tab.fullPath === currentRoute.fullPath ? tab : null;
        });
    }
    // 设置指定标签页的标题，如果没有传 tab（标签页）则默认设置当前打开的标签页的标题
    function setTabTitle(title: string, tab?: TTabRoute) {
        let currentTab = tab || getCurrentTab();

        if (currentTab) {
            currentTab.meta.title = title;
            return;
        }
        new Error("未找到要设置标题的标签页");
    }

    // 模拟 store.$reset 的方式暴露出来
    function reset() {
        tabs.value = [];
        cacheList.value = new Set();
        hasRefresh.value = false;
        removeStoreByPrefix(MUTIPLE_TAB);
    }
    // 关闭页面或者刷新页面时保存 tabs 到本地缓存
    function updateTabs2LocalStorage() {
        multipleCache.removeCache(TABS_CACHE_NAME);
        multipleCache.removeCache(CACHE_TABS_CACHE_NAME);
        multipleCache.setCache(TABS_CACHE_NAME, tabs.value);
        multipleCache.setCache(CACHE_TABS_CACHE_NAME, cacheList.value);
    }
    return {
        tabs,
        cacheList,
        hasRefresh,
        reset,
        setTabTitle,
        getCurrentTab,
        closeTab,
        closeCurrentTab,
        closeRigthTabs,
        closeLeftTabs,
        closeAllTabs,
        closeOtherTabs,
        switchResidentTab,
        initTab,
        addTab,
        addResidentTab,
        updateCacheList,
        canCacheTab,
        canAddRoute,
        updateTabs2LocalStorage,
    };
});

type useUserStoreType = typeof useMultipleTabs;
// 监听state指定键值改变并持久化到本地存储
export function subscribeMultipleTabsStore(store: ReturnType<useUserStoreType>) {
    store.$subscribe(
        (mutation, state) => {
            store.updateTabs2LocalStorage();
        },
        { detached: true, immediate: true }
    );
}
