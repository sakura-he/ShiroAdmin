<template>
    <div class="page">
        <div class="tw-mb-4">
            <NaPageHeader full title="菜单管理" subtitle="编辑全局菜单项" :show-back="false" />
        </div>
        <!-- <a-spin style="width:100%" :loading="true"> -->
        <div na-loading-text="加载中" v-loading="false"
            class="content tw-overflow-hidden tw-mt-[10px] tw-text-c-1 tw-py-[10px] tw-bg-cbg-1 tw-rounded lg:tw-flex tw-flex-wrap">
            <!-- 左侧菜单 -->
            <div
                class="menu-tree tw-flex-grow-[1] tw-bord lg:tw-border-r lg:tw-border-b-0 tw-border-solid tw-border-cb-1 tw-pr-4 tw-px-5 tw-pb-5 tw-mb-4 tw-border-b">
                <!-- 头部 -->
                <div class="tw-items-center tw-flex tw-pb-[10px] tw-mb-2 tw-border-b tw-border-solid tw-border-cb-1">
                    <span class="tw-text-title-1 tw-font-bold tw-leading-snug">菜单列表</span>
                    <div class="tw-ml-auto">
                        <a-button size="small" type="secondary" @click="onAddRootMenu">
                            新增根菜单
                        </a-button>
                    </div>
                </div>

                <a-tree :fieldNames="{
                    key: 'id',
                    title: 'title',
                    children: 'children',
                    icon: null,
                }" :animation="true" :data="menuList" block-node v-mode:selected-keys="treeSelectedKeys"
                    @select="onSelectedkeysUpdate">
                    <template #icon="{ node }">
                        <DynamicIcon :icon="node.icon" />
                    </template>
                </a-tree>
            </div>
            <!-- 右侧菜单详情 -->
            <div class="menu-detail tw-px-5 tw-flex-1 tw-flex-grow-[4]">
                <div
                    class="tw-text-title-1 tw-flex tw-items-center tw-justify-start tw-flex-wrap tw-pb-[10px] tw-mb-2 tw-border-b tw-border-solid tw-border-cb-1">
                    <DynamicIcon :icon="currentMenuNode.icon" class="tw-text-title-1" />
                    <span class="tw-text-title-1 tw-leading-snug tw-font-bold tw-ml-2">
                        {{
                            currentMenuStatus === MenuStatusEnum.Add
                                ? "新增菜单"
                                : currentMenuStatus === MenuStatusEnum.Edit
                                    ? "编辑菜单"
                                    : "菜单详情"
                        }}: [
                        {{
                            currentMenuType === MenuType.Catalog
                                ? "目录"
                                : currentMenuType === MenuType.Page
                                    ? "页面"
                                    : currentMenuType === MenuType.Button
                                        ? "按钮"
                                        : currentMenuType === MenuType.Root
                                            ? "根菜单"
                                            : ""
                        }}
                        ]
                    </span>
                    <a-button-group class="tw-ml-auto" v-if="currentMenuType !== MenuType.Root">
                        <a-button size="small" :type="currentMenuStatus === MenuStatusEnum.Add ? 'primary' : 'secondary'
                            " v-if="currentMenuType !== MenuType.Button" @click="onAddMenu">
                            {{ currentMenuStatus === MenuStatusEnum.Add ? "取消" : "增加菜单" }}
                        </a-button>
                        <a-button size="small" :type="currentMenuStatus === MenuStatusEnum.Edit ? 'primary' : 'secondary'
                            " @click="onEditMenu">
                            {{ currentMenuStatus === MenuStatusEnum.Edit ? "取消" : "编辑" }}
                        </a-button>

                        <a-popconfirm content="确定要删除吗?" type="info" cancel-text="取消" ok-text="删除">
                            <a-button size="small" type="secondary" v-bind:status="'danger'" @click="onDeleteMenu">
                                删除
                            </a-button>
                        </a-popconfirm>
                    </a-button-group>
                </div>
                <div>
                    <a-alert type="info" show-icon>
                        请选择在右侧菜单树中选择菜单或点击【添加顶级菜单】进行操作
                    </a-alert>
                    <a-breadcrumb class="!tw-text-body-1 tw-mb-4">
                        <a-breadcrumb-item v-for="item in selectedMenuDetail" :key="item.name">
                            <DynamicIcon :icon="item.meta.icon" />
                            {{ item.meta.title }}
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>

                <NaForm ref="menuForm" v-model="menuFormValue" :default-form-col-props="menuDetailFormColProps"
                    :formInputItems="currentFormInputItems" :default-form-label-props="menuDetailFormLabelProps"
                    :form-props="menuFormProps" :default-form-row-props="menuDetailFormRowProps"
                    v-bind:default-form-action-button-col-props="menuFormBtnColProps" @action-submit="onMenuFormSubmit"
                    @action-reset="onMenuFormReset">
                    <template #type>
                        <a-radio-group v-model="menuFormValue.type" type="button"
                            :options="menuFormTypeOptions"></a-radio-group>
                    </template>
                </NaForm>
            </div>
        </div>
        <!-- </a-spin> -->
    </div>
</template>

<script setup lang="ts">
import { createMenu, deleteMenu, getMenuList, updateMenu } from "@/api/menu";
import DynamicIcon from "@/components/DynamicIcon.vue";
import { NaForm, NaFormInputItem } from "@/components/NaForm";
import NaPageHeader from "@/components/NaPageHeader.vue";
import { flat2treeByArr, flat2treeByMap } from "@/utils/treeCover";
import { TreeNodeData } from "@arco-design/web-vue";
import { Ref } from "vue";
import {
    menuDetailFormColProps,
    menuDetailFormLabelProps,
    menuDetailFormProps,
    menuDetailFormRowProps,
    menuFormBtnColProps,
    MenuFormInputItemsButtonAdd,
    MenuFormInputItemsButtonDetail,
    MenuFormInputItemsButtonEdit,
    MenuFormInputItemsCatalogAdd,
    MenuFormInputItemsCatalogDetail,
    MenuFormInputItemsCatalogEdit,
    MenuFormInputItemsPageAdd,
    MenuFormInputItemsPageDetail,
    MenuFormInputItemsPageEdit,
    MenuFormInputItemsRootAdd,
} from "./config/menuForm";
defineOptions({
    name: "Menu",
});
// 后台返回的菜单数据
let menuList: Ref<any[]> = ref([]);
let icon = ref("icon-folder");
enum MenuStatusEnum {
    Add = "Add", // 新增
    Detail = "Detail", // 详情
    Edit = "Edit", // 编辑
}
enum MenuType {
    Catalog = "Catalog", // 目录
    Page = "Page", // 页面
    Button = "Button", // 按钮
    Root = "Root", // 根菜单
}
let menuFormTypeOptions = computed(() => {
    const map = new Map([
        [
            `${MenuStatusEnum.Detail}-${MenuType.Button}`,
            [{ label: "按钮", value: MenuType.Button }],
        ],
        [
            `${MenuStatusEnum.Detail}-${MenuType.Catalog}`,
            [{ label: "目录", value: MenuType.Catalog }],
        ],
        [
            `${MenuStatusEnum.Detail}-${MenuType.Page}`,
            [{ label: "页面", value: MenuType.Page }],
        ],
        [
            `${MenuStatusEnum.Edit}-${MenuType.Button}`,
            [{ label: "按钮", value: MenuType.Button }],
        ],
        [
            `${MenuStatusEnum.Edit}-${MenuType.Catalog}`,
            [{ label: "目录", value: MenuType.Catalog }],
        ],
        [`${MenuStatusEnum.Edit}-${MenuType.Page}`, [{ label: "页面", value: MenuType.Page }]],
        [
            `${MenuStatusEnum.Add}-${MenuType.Button}`,
            [{ label: "按钮", value: MenuType.Button }],
        ],
        [
            `${MenuStatusEnum.Add}-${MenuType.Catalog}`,
            [
                { label: "目录", value: MenuType.Catalog },
                { label: "页面", value: MenuType.Page },
            ],
        ],
        [`${MenuStatusEnum.Add}-${MenuType.Page}`, [{ label: "按钮", value: MenuType.Button }]],
        [
            `${MenuStatusEnum.Add}-${MenuType.Root}`,
            [
                { label: "目录", value: MenuType.Catalog },
                { label: "页面", value: MenuType.Page },
            ],
        ],
    ]);
    const options = map.get(`${currentMenuStatus.value}-${currentMenuType.value}`);
    return options || [];
});

let currentMenuStatus = ref<MenuStatusEnum>(MenuStatusEnum.Detail); // 当前菜单操作状态
let currentMenuType = ref<MenuType>(MenuType.Root); // 当前的操作的菜单类型
let currentMenuNode = ref<TreeNodeData | null>({}); // 当前操作的菜单节点
let menuFormValue = ref<any>({}); // 表单的值
// 根据当前表单状态和类型动态生成表单项
let currentFormInputItems = computed(() => {
    const status = currentMenuStatus.value;
    // 如果当前状态为新增菜单状态,表单项的配置取决于当前新增菜单的选择的类型
    // 详情及编辑状态,表单项配置由当前菜单(currentMenuType)的 type 属性决定
    const type =
        status === MenuStatusEnum.Add ? menuFormValue.value.type : currentMenuType.value;
    const mapping: Record<any, NaFormInputItem[]> = {
        [`${MenuType.Catalog}-${MenuStatusEnum.Add}`]: MenuFormInputItemsCatalogAdd,
        [`${MenuType.Catalog}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsCatalogEdit,
        [`${MenuType.Catalog}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsCatalogDetail,
        [`${MenuType.Page}-${MenuStatusEnum.Add}`]: MenuFormInputItemsPageAdd,
        [`${MenuType.Page}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsPageEdit,
        [`${MenuType.Page}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsPageDetail,
        [`${MenuType.Button}-${MenuStatusEnum.Add}`]: MenuFormInputItemsButtonAdd,
        [`${MenuType.Button}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsButtonEdit,
        [`${MenuType.Button}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsButtonDetail,
        [`${MenuType.Root}-${MenuStatusEnum.Add}`]: MenuFormInputItemsRootAdd,
    };
    let currentMenuFormInputItems = mapping[`${type}-${status}`];

    if (currentMenuFormInputItems && (type === MenuType.Catalog || type === MenuType.Page)) {
        currentMenuFormInputItems.forEach((item) => {
            if (item.field === "pid") {
                // 如果表单项是目录,增改查的表单的 pid 菜单树只能包含目录节点(去掉按钮节点及页面节点)
                item.formInputProps = reactive({
                    ...item.formInputProps,
                    data: [],
                    fieldNames: {
                        key: "id",
                        title: "title",
                        children: "children",
                        icon: "icon",
                    },
                });
                getCatalogMenuListTree().then((res) => (item.formInputProps.data = res));
            }
        });
    }
    if (currentMenuFormInputItems && type === MenuType.Button) {
        // 如果表单项是按钮,增改查的表单的 pid 菜单树只能包含目录节点和页面节点(去掉按钮节点)
        currentMenuFormInputItems.forEach((item) => {
            if (item.field === "pid") {
                item.formInputProps = reactive({
                    ...item.formInputProps,
                    data: [],
                    fieldNames: {
                        key: "id",
                        title: "title",
                        children: "children",
                        icon: "icon",
                    },
                });
                getCatalogPageMenuListTree().then((res) => (item.formInputProps.data = res));
            }
        });
    }
    return currentMenuFormInputItems;
});

// 角色详情表单配置
let menuFormProps = computed(() => {
    // 如果为详情模式,禁止表单编辑
    if (currentMenuStatus.value === MenuStatusEnum.Detail) {
        return { disabled: true, ...menuDetailFormProps };
    }
    return menuDetailFormProps;
});

// 新增根菜单
async function onAddRootMenu() {
    currentMenuStatus.value = MenuStatusEnum.Add;
    currentMenuType.value = MenuType.Root;
    menuFormValue.value = { type: MenuType.Catalog };
    menuFormValue.value.type = MenuType.Catalog;
}
// 菜单详情
function onDetailMenu() {
    nextTick(() => {
        currentMenuType.value = currentMenuNode.value.type
            ? currentMenuNode.value.type
            : "Root";
        currentMenuStatus.value = MenuStatusEnum.Detail;
        menuFormValue.value = currentMenuNode.value;
    });
}
// 编辑菜单/取消编辑
function onEditMenu() {
    // 取消编辑状态,进入详情状态
    if (currentMenuStatus.value === MenuStatusEnum.Edit) {
        onDetailMenu();
        return;
    }
    // 进入编辑状态
    currentMenuStatus.value = MenuStatusEnum.Edit;
    menuFormValue.value = JSON.parse(JSON.stringify(currentMenuNode.value));
}
// 新增菜单
function onAddMenu() {
    // 取消编辑状态,进入详情状态
    if (currentMenuStatus.value === MenuStatusEnum.Add) {
        onDetailMenu();
        return;
    }
    currentMenuStatus.value = MenuStatusEnum.Add;
    menuFormValue.value = {
        pid: currentMenuNode.value?.id ? currentMenuNode.value?.id : null,
    };
    console.log("currentMenuNode.value", currentMenuNode.value);
    //  因为新增菜单的表单项的配置取决于menuFormValue.type ,所以通过设置menuFormValue.type 来动态生成默认的表单项
    if (currentMenuNode.value.type === MenuType.Catalog) {
        menuFormValue.value.type = MenuType.Catalog;
    }
    if (currentMenuNode.value.type === MenuType.Page) {
        menuFormValue.value.type = MenuType.Button;
    }
}
// 提交编辑表单
async function onMenuFormSubmit() {
    let formData = menuFormValue.value;

    if (currentMenuType.value === MenuType.Root) {
        formData = { pid: null, ...formData };
    }
    if (currentMenuStatus.value === MenuStatusEnum.Edit) {
        return await updateMenu(formData);
    }
    if (currentMenuStatus.value === MenuStatusEnum.Add) {
        return await createMenu(formData);
    }
}
// 重置表单

function onMenuFormReset() {
    menuFormValue.value = {};
}
async function onDeleteMenu() {
    await deleteMenu(currentMenuNode.value.id);
}

// 已选择的菜单key,是个数组,由于没有开启多选,数组元素最多一个
const treeSelectedKeys = ref<Array<string | number>>([]);
// 当前选择的菜单的详情数据和他的所有的上级菜单的数据
let selectedMenuDetail = ref<any[]>([]);

async function getAllMenuListTree() {
    const res = await getMenuList({});
    menuList.value = res.data;

    const menuTree = flat2treeByMap(res.data, {
        fieldsPath: "order",
        sequential: false,
    });
    // 将菜单数据转为树形结构
    menuList.value = menuTree;
    return menuTree;
}
// 获取只包含目录和页面的路由树
async function getCatalogPageMenuListTree() {
    const res = await getMenuList({});
    let menuList = res.data;
    // 过滤掉按钮类型的菜单
    if (menuList && menuList.length) {
        menuList = menuList.filter((menu: any) => {
            let icon = menu.icon;
            console.log("icon", menu.icon);
            menu.icon = () => h(DynamicIcon, { icon });
            if (menu.type === MenuType.Catalog) {
                // 设置禁止选中状态
                menu.disabled = true;
            }
            return menu.type === MenuType.Catalog || menu.type === MenuType.Page;
        });
    }
    const menuTree = flat2treeByMap(menuList, {
        fieldsPath: "order",
        sequential: false,
    });
    // 将菜单数据转为树形结构
    return menuTree;
}
// 获取只包含目录的路由树
async function getCatalogMenuListTree() {
    const res = await getMenuList({});
    let menuList = res.data;
    // 过滤掉按钮类型的菜单
    if (menuList && menuList.length) {
        menuList = menuList.filter((menu: any) => {
            return menu.type === MenuType.Catalog;
        });
        menuList.forEach((menu: any) => {
            let icon = menu.icon;
            menu.icon = () => h(DynamicIcon, { icon });
        });
    }
    const menuTree = flat2treeByArr(menuList, {
        fieldsPath: "order",
        sequential: false,
    });

    // 将菜单数据转为树形结构
    return menuTree;
}
let onSelectedkeysUpdate = (
    selectedKeys: Array<string | number>,
    data: { selected?: boolean; selectedNodes: TreeNodeData[]; node?: TreeNodeData; e?: Event }
) => {
    treeSelectedKeys.value = selectedKeys;
    currentMenuNode.value = data.node;
    // 进入详情模式
    onDetailMenu();
};
function onload() {
    getAllMenuListTree();
}
onload();
</script>

<style scoped lang="scss">
.page {
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    padding-bottom: -10px;
    height: 100%;
}

.header {
    background-color: var(--color-bg-1);
    margin-left: calc(-1 * var(--page-pd-x));
    margin-right: calc(-1 * var(--page-pd-x));
    margin-top: calc(-1 * var(--page-pd-y));
    margin-bottom: var(--page-pd-y);
}

.arco-breadcrumb :deep(.arco-breadcrumb-item) {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>
