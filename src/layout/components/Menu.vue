<script lang="tsx">
    import { MenuEnum } from "@/router/type";
import { useNavigateStore } from "@/store/modules/navigate";
import { flat2treeByArr } from "@/utils/treeCover";
import { cloneDeep } from "lodash";
import { Ref } from "vue";
import { useRouter } from "vue-router";
import DynamicIcon from "../../components/DynamicIcon.vue";

    export default defineComponent({
        props: {
            show_icon: {
                type: Boolean,
                default: true,
            },
        },
        name: "MenuComponent",
        setup(props, ctx) {
            let openMenus: any[] = reactive([]);
            let navigateStore = useNavigateStore();
            let router = useRouter();
            let menuCollapse = inject<Ref<boolean>>("menuCollapse");
            let asyncMenuListRaw: any[] = [];
            function onSubMenuClick(key: string, openKey: any) {
                console.log("onSubMenuClick", key, openKey);
            }
            // 监听打开的菜单项数组的变化,如果改变了,更新openkeys打开的菜单
            watch(
                () => navigateStore.currentRouter2MenuTreeLevel,
                () => {
                    let catalogIndex: string[] = [];
                    navigateStore.breadCrumb.forEach((item, index) => {
                        if (item.type === MenuEnum.Catalog) {
                            catalogIndex.push(
                                navigateStore.currentRouter2MenuTreeLevel[index].toString()
                            );
                        }
                    });

                    openMenus.length = 0; // 折叠其他菜单
                    openMenus.push(catalogIndex.join("-")); // 只保留当前菜单的父级菜单
                }
            );

            // 点击菜单项跳转指定的路径
            function onMenuItemClick(key: string) {
                console.log("dianjide ", key);
                // arco返回的key的格式为 "1-2-2" 层级用-分隔; 需要获取到每层的路由对象
                // indexArr是分割后的菜单项,在父菜单中的层级索引
                let indexArr = key.split("-").map((item) => Number.parseInt(item));
                function getPath(asyncMenuListRaw: any, arr: number[]): any {
                    // 判断是不是最后一层菜单,是的话返回最后一个菜单对象，不是的话，返回本次对象和递归组成的数组
                    if (arr.length > 1) {
                        let currentIndex = arr.shift()!; // 记录当前层级的索引对应的路由地址(父路由路径片段),并递归寻找子级的
                        let newMenuList = asyncMenuListRaw[currentIndex].children;
                        let newArr = [...arr]; // 克隆去掉当前层级后的indexArr

                        return [asyncMenuListRaw[currentIndex], ...getPath(newMenuList, newArr)];
                    } else {
                        return [asyncMenuListRaw[arr.shift() as number]];
                    }
                }
                let currentFlatMenus = getPath(asyncMenuListRaw, indexArr);
                console.log("currentFlatMenus", currentFlatMenus);
                if (currentFlatMenus.length) {
                    let fullPath: string;
                    fullPath = currentFlatMenus.map((menu: any) => "" + menu.path).join("");
                    router.push(currentFlatMenus[currentFlatMenus.length - 1].path);
                }
            }
            // 根据菜单对象生成子菜单模板片段
            function createMenu(asyncMenuList: any[], floor: number[] = []) {
                return asyncMenuList.map((item, index) => {
                    let newFloor = [...floor, index];
                    // 如果是菜单递归获取
                    if (item.type === MenuEnum["Catalog"]) {
                        let nodes = createMenu(item.children, newFloor);
                        return (
                            <a-sub-menu key={newFloor.join("-")}>
                                {{
                                    title: () => item.title,
                                    icon: () =>
                                        props.show_icon ? <DynamicIcon icon={item.icon} /> : null,
                                    default: () => {
                                        return nodes;
                                    },
                                }}
                            </a-sub-menu>
                        );
                    } else if (item.type === MenuEnum["Page"]) {
                        return (
                            <a-menu-item key={newFloor.join("-")}>
                                {{
                                    icon: props.show_icon ? <DynamicIcon icon={item.icon} /> : null,
                                    default: () => {
                                        return <span>{item.title}</span>;
                                    },
                                }}
                            </a-menu-item>
                        );
                    }
                });
            }
            // 菜单项jsx
            const subMenu = computed(() => {
                //  后台返回的路由数组
                asyncMenuListRaw = cloneDeep(navigateStore.asyncMenuList);
                // 扁平化菜单转树状结构
                asyncMenuListRaw = flat2treeByArr(asyncMenuListRaw, {
                    fieldsPath: "order",
                    sequential: false,
                });
                return createMenu(asyncMenuListRaw);
            });
            console.log("props", props);
            return () => (
                <div class="menu-container">
                    <a-scrollbar
                        outer-style={{
                            minHeight: 0,
                            flex: "1 1 auto",
                            overflow: "hidden",
                        }}
                        class="scrollbar__inner"
                    >
                        <a-menu
                            {...ctx.attrs}
                            class="menu-container"
                            model:collapsed={menuCollapse!.value}
                            show-collapse-button={false}
                            onMenuItemClick={onMenuItemClick}
                            onSubMenuClick={onSubMenuClick}
                            onUpdate:openKeys={(evt: string) => {
                                console.log("onUpdate:openKeys", evt);
                                openMenus.length = 0;
                                openMenus.push(...evt);
                            }}
                            selected-keys={[navigateStore.currentRouter2MenuTreeLevel.join("-")]}
                            openKeys={openMenus}
                        >
                            {subMenu.value}
                        </a-menu>
                    </a-scrollbar>
                </div>
            );
        },
    });
</script>
<style scoped lang="scss">
    .menu-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .menu-container {
        min-height: 100%;
        user-select: none;
    }

    :deep(.arco-menu-inner) {
        .arco-menu-inline-header {
            display: flex;
            align-items: center;
        }

        .arco-icon {
            &:not(.arco-icon-down) {
                font-size: 18px;
            }
        }
    }

    // 内层scrollbar 样式
    :deep(.scrollbar__inner) {
        height: 100%;
        overflow: auto;
    }
</style>
