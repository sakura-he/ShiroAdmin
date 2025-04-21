<script lang="tsx">
    import { h, resolveComponent, VNode } from "vue";

    export default defineComponent({
        props: {
            icon: {
                type: String,
                required: false,
            },
        },
        setup(props) {
            let iconComp: ReturnType<typeof resolveComponent>;
            return () => {
                if (props.icon) {
                    iconComp = resolveComponent(props.icon);
                    if (typeof iconComp !== "string") return h(iconComp);
                }

                console.error(`图标组件不存在: ${props.icon}`);
                // 这里可以返回一个默认的图标组件
                // 例如一个问号图标
                return <icon-question-circle-fill style="color:rgb(240,104,92)" />;
            };
        },
    });
</script>
