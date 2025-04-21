<template>
    <a-button
        type="text"
        class="nav-btn"
        @click="onRefresh"
    >
        <template
            #icon
            color="#333"
        >
            <icon-refresh />
        </template>
    </a-button>
</template>

<script setup lang="ts">
    import nProgress from "nprogress";
    let updateShowRouter = inject<(show: boolean) => any>("updateShowRouter")!;
    function onRefresh() {
        updateShowRouter(false);
        nProgress.start();
        nextTick(() => {
            updateShowRouter(true);
            nProgress.done();
        });
    }
</script>

<style scoped></style>
