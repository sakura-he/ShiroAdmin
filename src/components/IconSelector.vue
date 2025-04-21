<!--  图标选择器  -->
<template>
    <a-Popover
        :trigger="'click'"
        position="bottom"
        auto-fit-position
        update-at-scroll
        render-to-body
        :content-style="{ width: '300px', overflow: 'auto', height: '220px' }"
        :unmount-on-close="false"
    >
        <a-input
            v-bind="props"
            :modelValue="props.modelValue"
            :placeholder="'请选择图标'"
            @update:modelValue="onUpdateModelValue"
        >
            <template #prepend>
                <DynamicIcon :icon="props.modelValue" />
            </template>
        </a-input>
        <template #content>
            <div class="tw-w-full tw-text-center tw-mb-2 tw-text-title-1">图标选择器</div>
            <div class="tw-grid tw-grid-cols-6 tw-gap-2 tw-grid-flow-row">
                <div
                    v-for="item in icons"
                    @click="onIconClick(item)"
                    class="tw-text-c-2 tw-h-8 tw-box-border tw-border tw-border-cb-2 tw-border-solid tw-text-title-2 hover:tw-bg-cf-2 tw-rounded hover:tw-text-p-6 tw-flex tw-justify-center tw-items-center tw-transition-all"
                >
                    <component :is="item" />
                </div>
            </div>
        </template>
    </a-Popover>
</template>

<script setup lang="ts">
    import * as arcoIcons from "@arco-design/web-vue/es/icon";
    let props = defineProps<{
        modelValue: string;
    }>();
    type IconsType = Partial<typeof arcoIcons>;
    let icons: IconsType = Object.assign({}, arcoIcons);
    delete icons.default;
    let emits = defineEmits<{
        (e: "update:modelValue", value: string): void;
    }>();
    function onUpdateModelValue(value: string) {
        emits("update:modelValue", value);
    }
    function onIconClick(evt: any) {
        emits("update:modelValue", evt.name);
    }
</script>

<style scoped></style>
