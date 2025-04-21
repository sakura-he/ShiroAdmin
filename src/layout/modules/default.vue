<template>
    <router-view></router-view>
</template>

<script lang="ts">
    export default {
        name: LayoutEnum.LAYOUT_DEFAULT,
    };
</script>

<script lang="ts" setup>
    import { LayoutEnum } from "@/router/type";
</script>
<style lang="scss"></style>
