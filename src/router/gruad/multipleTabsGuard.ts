import { useMultipleTabs, useNavigateStore } from "@/store";
import createCache from "@/utils/cache";
import NProgress from "nprogress";
import { Router } from "vue-router";

const MUTIPLE_CACHE = "multiple_tab";
const mutipleCache = createCache(MUTIPLE_CACHE);
export default function setupMultipleTabsGuard(router: Router) {
    router.afterEach((to, from) => {
        let routes = router.getRoutes();
        let multipleStore = useMultipleTabs();
        let navigateStore = useNavigateStore();

        let { matched, redirectedFrom, ...opt } = to;
        let tabMeta = {
            matchedComponentName: matched
                .filter((routeRecordNormalized) => {
                    return routeRecordNormalized.components?.default.name;
                })
                .map((routeRecordNormalized) => {
                    return routeRecordNormalized.components!.default.name;
                }) as string[],
            isPin: opt.meta.is_resident ? true : false,
        };
        multipleStore.addTab({
            ...opt,
            // 返回匹配到的路由的组件名称数组
            tabMeta,
        });
        // 更新面包屑
        navigateStore.updateBreadcrumb(to.meta?.id as number);

        NProgress.done();
    });
}
