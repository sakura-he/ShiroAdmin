<template>
    <div class="container">
        <div class="content">
            <!-- 风格和颜色 -->
            <div class="form">
                <div class="form-title">风格和颜色</div>
                <div class="form-item">
                    <div class="form-item__title">
                        设置主题颜色
                        <span class="tw-ml-4 tw-text-body-1">
                            当前颜色:
                            <span class="tw-text-p-6">{{ color }}</span>
                        </span>
                    </div>
                    <div
                        class="tw-flex-none tw-w-max tw-px-[2px] tw-py-[2px] tw-leading-none tw-rounded-sm tw-box-border tw-border-p-7 tw-border-solid tw-border"
                    >
                        <a-color-picker
                            :model-value="color"
                            :preset-colors="presetColors"
                            show-preset
                            showText
                            disabledAlpha
                            format="hex"
                            @change="colorChange"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="form-item__title">生成颜色预览</div>
                    <ul class="form-item tw-flex tw-rounded-sm tw-overflow-hidden">
                        <li
                            class="tw-h-7 tw-flex-1 tw-ring-inset tw-ring-p-8"
                            :style="{
                                backgroundColor: color,
                            }"
                            :class="{
                                'tw-mx-[2px]': index === 5,
                                'tw-ring-2': index === 5,
                            }"
                            v-for="(color, index) in colorPreviews"
                        ></li>
                    </ul>
                </div>
                <div class="form-item">
                    <div class="form-item__title">菜单栏宽度</div>
                    <a-slider
                        class="form-item__sw"
                        :model-value="configStore.config.menuWidth"
                        :min="150"
                        :max="270"
                        :show-input="true"
                        @update:modelValue="onUpdateMenuWidth"
                    />
                </div>
                <div
                    class="form-item row"
                    v-for="(item, index) in layoutOptions"
                >
                    <span class="form-item__title">{{ item.title }}</span>
                    <a-switch
                        class="form-item__sw"
                        size="small"
                        type="line"
                        :model-value="layoutOptions[index].value"
                        @update:model-value="layoutOptionsChang(index, $event)"
                    ></a-switch>
                </div>
                <div>
                    <div class="form-item row">
                        <span class="form-item__title">页面打开动画</span>
                        <a-select
                            style="width: max-content"
                            v-model="configStore.config.openingAnimation"
                            :trigger-props="{ autoFitPopupMinWidth: true }"
                            placeholder="请选择页面打开动画"
                        >
                            <a-optgroup
                                :label="transitionsNameGroupKey"
                                v-for="(
                                    transitionsNameGroup, transitionsNameGroupKey
                                ) in inTransitionNames"
                            >
                                <a-option
                                    v-for="transitionName in transitionsNameGroup"
                                    :value="transitionName"
                                >
                                    {{ transitionName }}
                                </a-option>
                            </a-optgroup>
                        </a-select>
                    </div>
                    <div class="form-item row">
                        <span class="form-item__title">页面退出动画</span>
                        <a-select
                            style="width: max-content"
                            v-model="configStore.config.quitAnimation"
                            :trigger-props="{ autoFitPopupMinWidth: true }"
                            placeholder="请选择页面退出动画"
                        >
                            <a-optgroup
                                :label="transitionsNameGroupKey"
                                v-for="(
                                    transitionsNameGroup, transitionsNameGroupKey
                                ) in outTransitionNames"
                            >
                                <a-option
                                    v-for="transitionName in transitionsNameGroup"
                                    :value="transitionName"
                                >
                                    {{ transitionName }}
                                </a-option>
                            </a-optgroup>
                        </a-select>
                    </div>
                    <!-- 动画预览 -->
                    <div class="form-item">
                        <div
                            class="tw-mx-auto tw-w-1/3 tw-h-[50px] tw-border-2 tw-border-solid tw-p-[2px] tw-rounded tw-border-p-5 tw-overflow-hidden"
                        >
                            <div class="tw-h-full tw-relative">
                                <PageTransition
                                    :in-name="configStore.config.openingAnimation"
                                    :out-name="configStore.config.quitAnimation"
                                    mode="out-in"
                                    :duration="0.3"
                                >
                                    <div
                                        class="tw-bg-p-3 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-text-title-1 tw-text-[#fff]"
                                        v-if="0 === transitionPreviewIndex"
                                        key="a"
                                    >
                                        标签页 A
                                    </div>
                                    <div
                                        class="tw-bg-p-3 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-text-title-1 tw-text-[#fff]"
                                        v-else
                                        key="b"
                                    >
                                        标签页 B
                                    </div>
                                </PageTransition>
                            </div>
                        </div>
                        <div class="tw-text-body-1 tw-text-c-2 tw-text-center tw-mt-2">
                            过渡动画预览
                        </div>
                    </div>
                </div>
            </div>
            <a-divider :margin="20" />
            <div class="form">
                <div class="form-title">其他设置</div>
                <div
                    class="form-item row"
                    v-for="(option, index) in otherOptions"
                >
                    <span class="form-item__title">{{ option[0] }}</span>
                    <a-switch
                        class="form-item__sw"
                        size="small"
                        type="line"
                        :model-value="option[1].value"
                        @update:model-value="onOtherOptionsChang(index, $event)"
                    ></a-switch>
                </div>
            </div>
            <a-divider :margin="20" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useConfigStore } from "@/store";
import { previewColor } from "@/utils/themeColor";
import { getPresetColors } from "@arco-design/color";

    import useColorMode from "@/hooks/useColorMode";
import PageTransition from "@/layout/components/PageTransition.vue";
import { Ref } from "vue";
    let transitionPreviewIndex = ref(0);
    let transitionPreviewIndexTimer = setInterval(() => {
        transitionPreviewIndex.value = transitionPreviewIndex.value ? 0 : 1;
    }, 3000);
    onUnmounted(() => {
        clearInterval(transitionPreviewIndexTimer);
    });
    let configStore = useConfigStore();
    let { colorWeak, tabBar, showTabsPinIcon, translucent, quitAnimation, openingAnimation } =
        toRefs(configStore.config);
    let color = ref(configStore.config.themeColor);
    let { isDarkMode } = useColorMode();
    // 获取arco预置颜色，设置给取色器的预置色板
    let presetColors = computed(() => {
        let presetColor = getPresetColors();
        let mode = isDarkMode.value ? "dark" : "light";
        return Object.keys(presetColor).map((color) => {
            return presetColor[color][mode][5];
        });
    });
    // 通过 arco/color 计算当前选择的颜色生成的颜色阶梯 预览
    let colorPreviews = computed(() => {
        let colors = previewColor(color.value, isDarkMode.value);
        return colors;
    });
    // 设置左侧菜单的宽度
    function onUpdateMenuWidth(evt: any) {
        configStore.updateMenuWidth(evt);
    }
    // 监听取色器组件的颜色改变事件（v-model）
    function colorChange(evt: any) {
        color.value = evt;
        configStore.setThemeColor(color.value);
    }
    // 布局选项
    let layoutOptions: Array<{ title: string; value: any }> = reactive([
        { title: "开启多标签", value: tabBar },
        { title: "显示标签页固定图标", value: showTabsPinIcon },
        { title: "透明效果", value: translucent },
    ]);
    function onQuitAnimationSelect(evt: any) {
        quitAnimation.value = evt;
    }
    function onOpeningAnimationSelect(evt: any) {
        openingAnimation.value = evt;
    }
    // 其他选项
    let otherOptions: Array<[string, Ref<boolean>]> = reactive([["色弱模式", colorWeak]]);
    function onOtherOptionsChang(index: number, event: any) {
        if (index === 0) {
            configStore.updateColorWeek(event);
        }
    }
    function layoutOptionsChang(index: number, event: any) {
        if (index === 0) {
            configStore.config.tabBar = event;
        }
        if (index === 1) {
            configStore.config.showTabsPinIcon = event;
        }
        if (index === 2) {
            configStore.updateTranslucent(event);
        }
    }

    let fadeIn = ["fade-in", "fade-in-down", "fade-in-left", "fade-in-right", "fade-in-up"];
    let fadeOut = ["fade-out", "fade-out-down", "fade-out-left", "fade-out-right", "fade-out-up"];
    let zoomIn = ["zoom-in", "zoom-in-down", "zoom-in-left", "zoom-in-right", "zoom-in-up"];
    let zoomOut = ["zoom-out", "zoom-out-down", "zoom-out-left", "zoom-out-right", "zoom-out-up"];
    let slideIn = ["slide-in-down", "slide-in-left", "slide-in-right", "slide-in-up"];
    let slideOut = ["slide-out-down", "slide-out-left", "slide-out-right", "slide-out-up"];
    let transitionIns = {
        fadeIn,
        zoomIn,
        slideIn,
    };
    let transitionOuts = {
        fadeOut,
        zoomOut,
        slideOut,
    };
    let inTransitionNames = reactive(transitionIns);
    let outTransitionNames = reactive(transitionOuts);
</script>

<style scoped lang="scss">
    $padding: 20px;
    $title-padding: 18px;
    $item-padding: 16px;
    $item-padding-sm: 12px;
    $item-title-size: var(--font--size-body-3);

    .container {
        border-radius: 0 0 var(--border-radius-small);
        height: 100%;
        box-sizing: border-box;
        line-height: 1.5;
        font-size: var(--font--size-body-2);
        color: var(--color-text-2);
        display: flex;
        flex-direction: column;
    }

    .form {
        &-title {
            text-align: left;
            color: var(--color-text-1);
            font-size: var(--font-size-title-1);
            margin-bottom: $title-padding;
        }

        &-item {
            margin-bottom: $item-padding;

            justify-content: space-between;

            &__title {
                font-size: $item-title-size;
                margin-bottom: $item-padding-sm;
            }

            &.row {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            &.row &__sw {
                margin-bottom: 0;
            }

            &.row &__title {
                font-size: $item-title-size;
                margin-bottom: 0;
            }
        }
    }

    .form-item__sw {
        flex: none;
    }

    // 颜色选择器的样式穿透
    :deep(.color-picker) {
        height: 15px !important;
    }

    :deep(.color-picker > .color-item) {
        width: 100% !important;
        border-radius: 2px !important;
        border: none !important;
        margin: 0 !important;
        height: 15px !important;
    }

    :deep(.color-picker > .picker) {
        border-radius: 2px !important;
        border: none !important;

        margin: 0 !important;
    }

    :deep(.scrollbar__inner) {
        height: 100%;
        overflow: auto;
    }
</style>
