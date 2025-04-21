<template>
    <div class="tw-w-full tw-h-full tw-bg-cbg-1">
        <div
            class="tw-w-full tw-h-full"
            v-for="[routesMapKey, routesMapValue] in openedIframes"
            :key="routesMapKey"
            v-show="route.name === routesMapKey"
            v-loading="!routesMapValue.loaded && route.name === routesMapKey"
        >
            <iframe
                :src="routesMapValue.meta.component_path as string"
                frameborder="0"
                allow="fullscreen"
                allowfullscreen
                width="100%"
                height="100%"
                v-if="routesMapValue.loaded || route.name === routesMapKey"
                @load="onIframeLoad(routesMapValue)"
            ></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter, useRoute, RouteRecordNormalized, RouteMeta } from "vue-router";
    import { useMultipleTabs } from "@/store/index";
    import { MenuEnum, PageTypeEnum } from "@/router/type";
    let multipleTabs = useMultipleTabs();
    let route = useRoute();
    type IIframeRoutesMapValue = {
        loaded: boolean;
        meta: RouteMeta;
    };
    let allIframeRoutesMap = new Map();
    let lastOpenedIframesMap: typeof allIframeRoutesMap = new Map();
    // 获取多标签中打开的 iframe类型的route
    let openedIframes = computed(() => {
        let openedIframesMap: typeof allIframeRoutesMap = new Map();
        
        multipleTabs.tabs.forEach((tab) => {
            if (tab.meta.type === MenuEnum.Page && tab.meta.page_type === PageTypeEnum.IFrame) {
                let oldIframe = lastOpenedIframesMap.get(tab.name as string);
                // 旧的合并,新的赋值初始值
                openedIframesMap.set(
                    tab.name as string,
                    oldIframe ?? shallowReactive({ loaded: false, meta: tab.meta })
                );
            }
        });
        if (route.meta.type === MenuEnum.Page && route.meta.page_type === PageTypeEnum.IFrame) {
            let oldIframe = lastOpenedIframesMap.get(route.name as string);
            // 旧的合并,新的赋值初始值
            openedIframesMap.set(
                route.name as string,
                oldIframe ?? shallowReactive({ loaded: false, meta: route.meta })
            );
        }
        // 备份
        lastOpenedIframesMap = openedIframesMap;
        return openedIframesMap;
    });
    function onIframeLoad(routeValue: IIframeRoutesMapValue) {
        routeValue.loaded = true;
    }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        background: var(--color-fill-1);
    }
</style>
