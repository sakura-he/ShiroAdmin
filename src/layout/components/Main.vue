<!-- 匹配到的路由页面将会被在这组件中渲染 -->
<template>
    <div
        class="main tw-flex-row tw-transition-all"
        ref="mainLayout"
    >
        <router-view
            v-slot="{ Component, route }"
            v-if="showRouter"
        >
            <PageTransition
                mode="out-in"
                :in-name="configStore.config.openingAnimation"
                :out-name="configStore.config.quitAnimation"
            >
                <keep-alive :include="cacheList">
                    <component
                        :is="Component"
                        :key="route.fullPath"
                        v-show="!isIframe"
                    />
                </keep-alive>
            </PageTransition>
        </router-view>
        <Iframe v-show="isIframe"></Iframe>
    </div>
</template>

<script setup lang="ts">
    import Iframe from "@/layout/components/Iframe.vue";
import PageTransition from "@/layout/components/PageTransition.vue";
import { PageTypeEnum } from "@/router/type";
import { useConfigStore } from "@/store";
import { useMultipleTabs } from "@/store/modules/multipleTab";
import { provide, ref, Ref } from "vue";
import { RouterView, useRoute } from "vue-router";
    let currentRoute = useRoute();
    // 判断当前路由组件是不是iframe,如果是,则不在router-view中渲染,而是通过Iframe组件进行渲染
    let isIframe = computed(() => currentRoute.meta.page_type === PageTypeEnum.IFrame);
    let configStore = useConfigStore();
    let multipleTabs = useMultipleTabs();
    let cacheList = computed(() => {
        let arr = Array.from(multipleTabs.cacheList);
        return arr;
    });
    let showRouter = inject("showRouter")!; // 控制刷新
    let mainLayout = ref<HTMLElement>();

    // 通过 provide 提供 ref
    provide<Ref<HTMLElement>>("MainLayout", mainLayout as Ref<HTMLElement>);
</script>

<style scoped lang="scss">
    .main {
        position: relative;
        margin: 0 auto;
        flex: 1 0 auto;
        width: 100%;
        padding-left: var(--page-pd-x);
        padding-right: var(--page-pd-x);
        padding-top: var(--page-pd-y);
        padding-bottom: var(--page-pd-y);
        box-sizing: border-box;
        border-radius: var(--border-radius-small);
        background-clip: content-box;
    }
</style>
