<template>
    <div
        class="na-page-header tw-bg-cbg-2"
        :class="containerClass"
        :style="$attrs.sytle as StyleValue"
    >
        <a-page-header v-bind="_attrs">
            <template
                v-for="(value, key) in $slots"
                v-slot:[key]
                :key="key"
            >
                <slot :name="key"></slot>
            </template>
        </a-page-header>
    </div>
</template>
<script lang="ts">
    import { StyleValue } from "vue";

    export default defineComponent({
        inheritAttrs: false,
        props: {
            full: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { attrs, slots }) {
          
            // vue3开始 class和style将传递给attrs,需要去除
            let _attrs = computed(() => {
                return { ...attrs, class: undefined, style: undefined };
            });
            let containerClass = computed<string[]>(() => {
                const classes = [] as string[];
                if (props.full) {
                    classes.push("full");
                }
                classes.push((attrs.class as string) || "");
                return classes;
            });
            return { _attrs, containerClass };
        },
    });
</script>
<style scoped lang="scss">
    .na-page-header.full {
        margin-left: calc(var(--page-pd-x) * -1);
        margin-right: calc(var(--page-pd-x) * -1);
        margin-top: calc(var(--page-pd-y) * -1);
        margin-bottom: calc(var(--page-pd-y) );
    }
</style>
