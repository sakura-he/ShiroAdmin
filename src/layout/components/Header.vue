<template>
    <!-- 左侧logo -->
    <a-row
        align="center"
        class="container"
    >
        <!-- 左侧logo -->
        <a-col
            :flex="`${menuWidth}`"
            class="left"
        >
            <div
                class="left-side"
                :class="[menuCollapse ? 'collapse' : '']"
            >
                <div class="logo">
                    <img
                        class="logo_img"
                        src="@/assets/logo2.svg"
                        alt=""
                    />
                </div>
                <transition name="title">
                    <h1
                        class="title"
                        v-show="!menuCollapse"
                    >
                        Shiro Admin
                    </h1>
                </transition>
            </div>
        </a-col>
        <a-col flex="initial">
            <!-- 控制侧边菜单折叠按钮(手机模式下现实) -->
            <a-button
                type="text"
                class="nav-btn"
                @click="updateMenuCollapse(!menuCollapse)"
                v-if="configStore.config.device <= deviceEnum['sm']"
            >
                <template
                    #icon
                    color="#333"
                >
                    <!-- 已隐藏 -->
                    <icon-menu-fold v-if="menuCollapse" />
                    <!-- 已展开 -->
                    <icon-menu-unfold v-else />
                </template>
            </a-button>
            <!--刷新按钮 -->
        </a-col>
        <!-- 中间区域 -->
        <a-col
            class="tw-h-full tw-flex tw-items-center"
            flex="1"
            v-if="configStore.config.device > deviceEnum['sm']"
        >
            <Menu
                v-if="props.layout === LayoutEnum.LAYOUT_TOP"
                mode="horizontal"
                :name="'1'"
                :show_icon="false"
            />
            <a-breadcrumb v-show="props.layout !== LayoutEnum.LAYOUT_TOP">
                <a-breadcrumb-item
                    :key="item.id"
                    v-for="item in breadcurmb"
                >
                    {{ item.title }}
                </a-breadcrumb-item>
            </a-breadcrumb>
        </a-col>
        <!-- 右侧按钮组 -->
        <a-col
            flex="initial"
            class="right-side__col"
        >
            <!-- 顶部导航栏按钮组 -->
            <a-space>
                <!-- 颜色模式切换 -->
                <ColorModeSwitch v-slot="icon">
                    <a-button :shape="'circle'">
                        <template v-slot:icon>
                            <DynamicIcon :icon="icon.icon" />
                        </template>
                    </a-button>
                </ColorModeSwitch>
                <!-- 全屏按钮 -->
                <a-button
                    type="secondary"
                    shape="circle"
                    class="right-side__btn"
                    @click="toggleFullscreen"
                >
                    <icon-fullscreen v-show="!isFullscreen" />
                    <icon-fullscreen-exit v-show="isFullscreen" />
                </a-button>
                <!-- 设置按钮 -->
                <a-button
                    type="secondary"
                    shape="circle"
                    class="right-side__btn"
                    @click="onSetting"
                >
                    <icon-settings />
                </a-button>
            </a-space>
            <!-- 右侧头像 -->
            <a-dropdown trigger="hover">
                <div class="right-side__avatar">
                    <img
                        src="@/assets/avatar.png"
                        alt=""
                        class="right-side__avatar-img"
                    />
                </div>
                <template v-slot:content>
                    <a-doption>
                        <a-space>
                            <icon-user />
                            <span>用户中心</span>
                        </a-space>
                    </a-doption>
                    <a-doption @click="logout">
                        <a-space>
                            <icon-export />
                            <span>退出登录</span>
                        </a-space>
                    </a-doption>
                </template>
            </a-dropdown>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
    import { useConfigStore, useNavigateStore, useUserStore } from "@/store";
    // 刷新按钮组件，复用
    import DynamicIcon from "@/components/DynamicIcon.vue";
import Menu from "@/layout/components/Menu.vue";
import { LayoutEnum } from "@/router/type";
import { deviceEnum } from "@/store/modules/config/types";
import { useFullscreen } from "@vueuse/core";
import { Ref } from "vue";
import ColorModeSwitch from "./ColorModeSwitch.vue";
    let props = defineProps({
        layout: {
            type: String,
            default: LayoutEnum.LAYOUT_SIDE,
        },
    });
    let userStore = useUserStore();
    let configStore = useConfigStore();
    let navigateStore = useNavigateStore();
    let breadcurmb = computed(() => navigateStore.breadCrumb);
    let menuCollapse = inject<Ref<boolean>>("menuCollapse")!;
    let updateMenuCollapse = inject<(value: boolean) => void>("updateMenuCollapse")!;
    let menuWidth = computed(() => {
        if (menuCollapse.value) return 48 + "px";
        return configStore.config.menuWidth + "px";
    });
    let styleMenuWidth = computed(() => configStore.config.menuWidth + "px");
    // 打开全局设置
    function onSetting() {
        console.log('configStore',configStore.config.globalSettings)
        configStore.config.globalSettings = !configStore.config.globalSettings;
    }
    function logout() {
        userStore.logout();
    }
    // 切换全屏以及全屏状态
    let { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
</script>

<style scoped lang="scss">
    .container {
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0px 1px 1px var(--color-border-1);
        overflow: hidden;
        z-index: 10;
        background-color: var(--color-bg-opacity-2);
        backdrop-filter: blur(25px) saturate(150%);
    }

    .left {
        transition: flex 0.2s;
        min-width: 0;
        overflow: hidden;
    }

    .left-side {
        display: flex;
        transition: width 0.2s;
        overflow: hidden;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        height: 60px;
        overflow: hidden;

        &.collapse {
            padding: 0;
            justify-content: center;
        }

        .logo {
            flex: none;

            height: 100%;
            display: flex;
            align-items: center;
            min-width: 0;
            .logo_img {
                height: 70%;
                object-fit: contain;
                transition: all 0.2s;
            }
        }

        .title {
            min-width: 0;
            flex: 1;
            width: calc(v-bind(styleMenuWidth) - 80px);
            font-size: var(--font-size-title-1);
            color: var(--color-text-2);
            margin-left: 10px;
            line-height: 1.2em;
        }
    }

    .right-side__col {
        padding-right: 20px;
        display: flex;
        align-items: center;
        margin-left: auto;
    }

    .right-side__col > * {
        margin-left: 20px;
    }

    .right-side {
        display: flex;
        align-items: center;
    }

    .right-side__item:not(:first-of-type) {
        margin-left: 10px;
    }

    .right-side__avatar {
        border-radius: 999vw;
        width: 40px;
        height: 40px;
        overflow: hidden;
    }

    .right-side__btn {
        border-color: rgb(var(--gray-2)) !important;
        color: rgb(var(--gray-8)) !important;
        font-size: 16px;
    }

    .right-side__avatar-img {
        width: 100%;
    }

    .title-enter-from {
        opacity: 0;
    }

    .title-enter-active {
        transition: all 0.2s;
    }
</style>
