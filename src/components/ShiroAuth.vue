<template>
    <slot v-if="isAuth"></slot>
</template>
<script lang="ts" setup>
    /*
     * @description: 权限控制组件
     * 使用 hasPermission() 验证 传给 props.permissions 权限
     *
     */
    import { hasPermission } from "@/utils/permission";
    defineOptions({
        name: "ShiroAuthConponent",
    });
    const props = defineProps<{
        permissions: string[] | string;
    }>();
    let isAuth = computed(() => {
        if (props.permissions) return hasPermission(props.permissions);
        console.warn('ShiroAuth组件未设置权限,默认允许访问, 请通过设置组件 permissions 属性来设置权限')
        return true
    });
</script>
<style lang="scss" scoped></style>
