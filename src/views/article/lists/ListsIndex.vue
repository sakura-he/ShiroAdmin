<template>
    <div>
        lists
        <input
            type="text"
            v-model="input"
        />
        <button @click="test">test</button>
    </div>
</template>
<script lang="ts" setup>
    import { useMultipleTabs } from "@/store";
    import { defineOptions } from "vue";
    defineOptions({
        name: "ListsIndex",
    });
    let multipleTabsStore = useMultipleTabs();
    let input = ref("");
    function test() {
        multipleTabsStore.setTabTitle(input.value);
    }
</script>
