<template>
    <div class="page">
        <div class="tw-mb-4">
            <NaPageHeader
                full
                title="App 菜单管理"
                subtitle="编辑 App 端菜单项"
                :show-back="false"
            />
        </div>
        <div
            na-loading-text="加载中"
            v-loading="loading"
            class="content tw-overflow-hidden tw-mt-[10px] tw-text-c-1 tw-py-[10px] tw-bg-cbg-1 tw-rounded lg:tw-flex tw-flex-wrap"
        >
            <!-- 左侧菜单树 -->
            <div
                class="menu-tree tw-flex-grow-[1] lg:tw-border-r lg:tw-border-b-0 tw-border-solid tw-border-cb-1 tw-pr-4 tw-px-5 tw-pb-5 tw-mb-4 tw-border-b"
            >
                <!-- 头部 -->
                <div
                    class="tw-items-center tw-flex tw-pb-[10px] tw-mb-2 tw-border-b tw-border-solid tw-border-cb-1"
                >
                    <span class="tw-text-title-1 tw-font-bold tw-leading-snug">菜单列表</span>
                    <div class="tw-ml-auto">
                        <a-button
                            size="small"
                            type="secondary"
                            @click="onAddRootMenu"
                        >
                            新增根菜单
                        </a-button>
                    </div>
                </div>

                <a-tree
                    :fieldNames="{
                        key: 'id',
                        title: 'title',
                        children: 'children',
                        icon: null,
                    }"
                    :animation="true"
                    :data="menuList"
                    block-node
                    v-model:selected-keys="treeSelectedKeys"
                    @select="onSelectedkeysUpdate"
                >
                    <template #icon="{ node }">
                        <DynamicIcon :icon="node.icon" />
                    </template>
                </a-tree>
            </div>
            <!-- 右侧菜单详情 -->
            <div class="menu-detail tw-px-5 tw-flex-1 tw-flex-grow-[4]">
                <div
                    class="tw-text-title-1 tw-flex tw-items-center tw-justify-start tw-flex-wrap tw-pb-[10px] tw-mb-2 tw-border-b tw-border-solid tw-border-cb-1"
                >
                    <DynamicIcon
                        :icon="currentMenuNode.icon"
                        class="tw-text-title-1"
                    />
                    <span class="tw-text-title-1 tw-leading-snug tw-font-bold tw-ml-2">
                        {{
                            currentMenuStatus === MenuStatusEnum.Add
                                ? "新增菜单"
                                : currentMenuStatus === MenuStatusEnum.Edit
                                ? "编辑菜单"
                                : "菜单详情"
                        }}: [
                        {{
                            currentMenuType === AppMenuType.Catalog
                                ? "目录"
                                : currentMenuType === AppMenuType.Page
                                ? "页面"
                                : currentMenuType === AppMenuType.Button
                                ? "按钮"
                                : currentMenuType === MenuTypeRoot
                                ? "根菜单"
                                : ""
                        }}
                        ]
                    </span>
                    <a-button-group
                        class="tw-ml-auto"
                        v-if="currentMenuType !== MenuTypeRoot"
                    >
                        <a-button
                            size="small"
                            :type="
                                currentMenuStatus === MenuStatusEnum.Add ? 'primary' : 'secondary'
                            "
                            v-if="currentMenuType !== AppMenuType.Button"
                            @click="onAddMenu"
                        >
                            {{ currentMenuStatus === MenuStatusEnum.Add ? "取消" : "增加子菜单" }}
                        </a-button>
                        <a-button
                            size="small"
                            :type="
                                currentMenuStatus === MenuStatusEnum.Edit ? 'primary' : 'secondary'
                            "
                            @click="onEditMenu"
                        >
                            {{ currentMenuStatus === MenuStatusEnum.Edit ? "取消" : "编辑" }}
                        </a-button>

                        <a-popconfirm
                            content="确定要删除吗? 子菜单也会被删除"
                            type="warning"
                            cancel-text="取消"
                            ok-text="删除"
                            @ok="onDeleteMenu"
                        >
                            <a-button
                                size="small"
                                type="secondary"
                                status="danger"
                            >
                                删除
                            </a-button>
                        </a-popconfirm>
                    </a-button-group>
                </div>
                <div>
                    <a-alert
                        v-if="currentMenuType === MenuTypeRoot && currentMenuStatus !== MenuStatusEnum.Add"
                        type="info"
                        show-icon
                    >
                        请在左侧菜单树中选择菜单或点击【新增根菜单】进行操作
                    </a-alert>
                    <a-breadcrumb class="!tw-text-body-1 tw-mb-4">
                        <a-breadcrumb-item
                            v-for="item in selectedMenuBreadcrumb"
                            :key="item.id"
                        >
                            <DynamicIcon :icon="item.icon" />
                            {{ item.title }}
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>

                <NaForm
                    ref="menuFormRef"
                    v-model="menuFormValue"
                    :default-form-col-props="menuFormColProps"
                    :formInputItems="currentFormInputItems"
                    :default-form-label-props="menuFormLabelProps"
                    :form-props="menuFormPropsComputed"
                    :default-form-row-props="menuFormRowProps"
                    :default-form-action-button-col-props="menuFormBtnColProps"
                    @action-submit="onMenuFormSubmit"
                    @action-reset="onMenuFormReset"
                >
                    <template #type>
                        <a-radio-group
                            v-model="menuFormValue.type"
                            type="button"
                            :options="menuFormTypeOptions"
                        ></a-radio-group>
                    </template>
                </NaForm>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { 
    getAppMenuTree, 
    getAppMenuList, 
    createAppMenu, 
    updateAppMenu, 
    deleteAppMenu,
    AppMenuType,
    AppMenuStatus,
    type AppMenu,
    type AppMenuTreeNode,
} from "@/api/appMenu";
import DynamicIcon from "@/components/DynamicIcon.vue";
import { NaForm, NaFormInputItem } from "@/components/NaForm";
import NaPageHeader from "@/components/NaPageHeader.vue";
import { flat2treeByMap } from "@/utils/treeCover";
import { TreeNodeData } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
import { Ref, ref, computed, reactive, nextTick, h } from "vue";
import {
    menuFormColProps,
    menuFormLabelProps,
    menuFormProps,
    menuFormRowProps,
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
} from "./config/menuFormConfig";

defineOptions({
    name: "AppMenu",
});

// 加载状态
const loading = ref(false);

// 后台返回的菜单数据（树形结构）
const menuList: Ref<AppMenuTreeNode[]> = ref([]);

// 菜单操作状态枚举
enum MenuStatusEnum {
    Add = "Add",       // 新增
    Detail = "Detail", // 详情
    Edit = "Edit",     // 编辑
}

// 根菜单类型标识
const MenuTypeRoot = "Root";

// 菜单类型选项（根据当前状态和类型动态生成）
const menuFormTypeOptions = computed(() => {
    const map = new Map([
        [`${MenuStatusEnum.Detail}-${AppMenuType.Button}`, [{ label: "按钮", value: AppMenuType.Button }]],
        [`${MenuStatusEnum.Detail}-${AppMenuType.Catalog}`, [{ label: "目录", value: AppMenuType.Catalog }]],
        [`${MenuStatusEnum.Detail}-${AppMenuType.Page}`, [{ label: "页面", value: AppMenuType.Page }]],
        [`${MenuStatusEnum.Edit}-${AppMenuType.Button}`, [{ label: "按钮", value: AppMenuType.Button }]],
        [`${MenuStatusEnum.Edit}-${AppMenuType.Catalog}`, [{ label: "目录", value: AppMenuType.Catalog }]],
        [`${MenuStatusEnum.Edit}-${AppMenuType.Page}`, [{ label: "页面", value: AppMenuType.Page }]],
        [`${MenuStatusEnum.Add}-${AppMenuType.Button}`, [{ label: "按钮", value: AppMenuType.Button }]],
        [`${MenuStatusEnum.Add}-${AppMenuType.Catalog}`, [
            { label: "目录", value: AppMenuType.Catalog },
            { label: "页面", value: AppMenuType.Page },
        ]],
        [`${MenuStatusEnum.Add}-${AppMenuType.Page}`, [{ label: "按钮", value: AppMenuType.Button }]],
        [`${MenuStatusEnum.Add}-${MenuTypeRoot}`, [
            { label: "目录", value: AppMenuType.Catalog },
            { label: "页面", value: AppMenuType.Page },
        ]],
    ]);
    const options = map.get(`${currentMenuStatus.value}-${currentMenuType.value}`);
    return options || [];
});

// 当前菜单操作状态
const currentMenuStatus = ref<MenuStatusEnum>(MenuStatusEnum.Detail);
// 当前操作的菜单类型
const currentMenuType = ref<string>(MenuTypeRoot);
// 当前操作的菜单节点
const currentMenuNode = ref<TreeNodeData | any>({});
// 表单的值
const menuFormValue = ref<any>({});
// 表单引用
const menuFormRef = ref<InstanceType<typeof NaForm> | null>(null);

// 根据当前表单状态和类型动态生成表单项
const currentFormInputItems = computed(() => {
    const status = currentMenuStatus.value;
    // 如果当前状态为新增菜单状态，表单项的配置取决于当前新增菜单选择的类型
    // 详情及编辑状态，表单项配置由当前菜单的 type 属性决定
    const type = status === MenuStatusEnum.Add ? menuFormValue.value.type : currentMenuType.value;
    
    const mapping: Record<string, NaFormInputItem[]> = {
        [`${AppMenuType.Catalog}-${MenuStatusEnum.Add}`]: MenuFormInputItemsCatalogAdd,
        [`${AppMenuType.Catalog}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsCatalogEdit,
        [`${AppMenuType.Catalog}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsCatalogDetail,
        [`${AppMenuType.Page}-${MenuStatusEnum.Add}`]: MenuFormInputItemsPageAdd,
        [`${AppMenuType.Page}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsPageEdit,
        [`${AppMenuType.Page}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsPageDetail,
        [`${AppMenuType.Button}-${MenuStatusEnum.Add}`]: MenuFormInputItemsButtonAdd,
        [`${AppMenuType.Button}-${MenuStatusEnum.Edit}`]: MenuFormInputItemsButtonEdit,
        [`${AppMenuType.Button}-${MenuStatusEnum.Detail}`]: MenuFormInputItemsButtonDetail,
        [`${MenuTypeRoot}-${MenuStatusEnum.Add}`]: MenuFormInputItemsRootAdd,
    };
    
    let currentMenuFormInputItems = mapping[`${type}-${status}`];

    if (currentMenuFormInputItems && (type === AppMenuType.Catalog || type === AppMenuType.Page)) {
        currentMenuFormInputItems = currentMenuFormInputItems.map(item => {
            if (item.field === "pid") {
                // 如果表单项是目录或页面，pid 菜单树只能包含目录节点
                const newItem = { ...item };
                newItem.formInputProps = reactive({
                    ...item.formInputProps,
                    data: [],
                    fieldNames: {
                        key: "id",
                        title: "title",
                        children: "children",
                        icon: "icon",
                    },
                });
                getCatalogMenuListTree().then((res) => {
                    if (newItem.formInputProps) {
                        newItem.formInputProps.data = res;
                    }
                });
                return newItem;
            }
            return item;
        });
    }
    
    if (currentMenuFormInputItems && type === AppMenuType.Button) {
        // 如果表单项是按钮，pid 菜单树只能包含目录节点和页面节点
        currentMenuFormInputItems = currentMenuFormInputItems.map(item => {
            if (item.field === "pid") {
                const newItem = { ...item };
                newItem.formInputProps = reactive({
                    ...item.formInputProps,
                    data: [],
                    fieldNames: {
                        key: "id",
                        title: "title",
                        children: "children",
                        icon: "icon",
                    },
                });
                getCatalogPageMenuListTree().then((res) => {
                    if (newItem.formInputProps) {
                        newItem.formInputProps.data = res;
                    }
                });
                return newItem;
            }
            return item;
        });
    }
    
    return currentMenuFormInputItems || [];
});

// 表单配置（详情模式禁用编辑）
const menuFormPropsComputed = computed(() => {
    if (currentMenuStatus.value === MenuStatusEnum.Detail) {
        return { disabled: true, ...menuFormProps };
    }
    return menuFormProps;
});

// 已选择的菜单key
const treeSelectedKeys = ref<Array<string | number>>([]);

// 当前选择的菜单的面包屑路径
const selectedMenuBreadcrumb = ref<any[]>([]);

// 获取所有菜单树
async function getAllMenuListTree() {
    loading.value = true;
    try {
        const res = await getAppMenuTree();
        menuList.value = res.data || [];
    } catch (error) {
        Message.error("加载菜单数据失败");
        console.error(error);
    } finally {
        loading.value = false;
    }
}

// 获取只包含目录和页面的菜单树（用于按钮的父级选择）
async function getCatalogPageMenuListTree() {
    try {
        const res = await getAppMenuList();
        let list = res.data || [];
        // 过滤掉按钮类型的菜单
        list = list.filter((menu: AppMenu) => {
            return menu.type === AppMenuType.Catalog || menu.type === AppMenuType.Page;
        });
        // 为目录类型设置禁止选中状态
        list = list.map((menu: any) => {
            const icon = menu.icon;
            return {
                ...menu,
                icon: () => h(DynamicIcon, { icon }),
                disabled: menu.type === AppMenuType.Catalog,
            };
        });
        return flat2treeByMap(list, { fieldsPath: "order", sequential: true });
    } catch (error) {
        console.error(error);
        return [];
    }
}

// 获取只包含目录的菜单树（用于目录和页面的父级选择）
async function getCatalogMenuListTree() {
    try {
        const res = await getAppMenuList();
        let list = res.data || [];
        // 过滤掉按钮和页面类型的菜单
        list = list.filter((menu: AppMenu) => {
            return menu.type === AppMenuType.Catalog;
        });
        list = list.map((menu: any) => {
            const icon = menu.icon;
            return {
                ...menu,
                icon: () => h(DynamicIcon, { icon }),
            };
        });
        return flat2treeByMap(list, { fieldsPath: "order", sequential: true });
    } catch (error) {
        console.error(error);
        return [];
    }
}

// 构建面包屑路径
function buildBreadcrumb(menuId: number | string, menuTree: AppMenuTreeNode[]): any[] {
    const path: any[] = [];
    
    function findPath(nodes: AppMenuTreeNode[], targetId: number | string): boolean {
        for (const node of nodes) {
            path.push(node);
            if (node.id === targetId) {
                return true;
            }
            if (node.children && node.children.length > 0) {
                if (findPath(node.children, targetId)) {
                    return true;
                }
            }
            path.pop();
        }
        return false;
    }
    
    findPath(menuTree, menuId);
    return path;
}

// 新增根菜单
function onAddRootMenu() {
    currentMenuStatus.value = MenuStatusEnum.Add;
    currentMenuType.value = MenuTypeRoot;
    menuFormValue.value = { type: AppMenuType.Catalog, status: AppMenuStatus.ENABLE };
    treeSelectedKeys.value = [];
    selectedMenuBreadcrumb.value = [];
}

// 菜单详情
function onDetailMenu() {
    nextTick(() => {
        currentMenuType.value = currentMenuNode.value.type || MenuTypeRoot;
        currentMenuStatus.value = MenuStatusEnum.Detail;
        menuFormValue.value = { ...currentMenuNode.value };
    });
}

// 编辑菜单/取消编辑
function onEditMenu() {
    // 取消编辑状态，进入详情状态
    if (currentMenuStatus.value === MenuStatusEnum.Edit) {
        onDetailMenu();
        return;
    }
    // 进入编辑状态
    currentMenuStatus.value = MenuStatusEnum.Edit;
    menuFormValue.value = JSON.parse(JSON.stringify(currentMenuNode.value));
}

// 新增子菜单
function onAddMenu() {
    // 取消新增状态，进入详情状态
    if (currentMenuStatus.value === MenuStatusEnum.Add) {
        onDetailMenu();
        return;
    }
    currentMenuStatus.value = MenuStatusEnum.Add;
    menuFormValue.value = {
        pid: currentMenuNode.value?.id || null,
        status: AppMenuStatus.ENABLE,
    };
    // 根据当前菜单类型设置默认的新增菜单类型
    if (currentMenuNode.value.type === AppMenuType.Catalog) {
        menuFormValue.value.type = AppMenuType.Catalog;
    }
    if (currentMenuNode.value.type === AppMenuType.Page) {
        menuFormValue.value.type = AppMenuType.Button;
    }
}

// 提交表单
async function onMenuFormSubmit() {
    let formData = { ...menuFormValue.value };
    
    // 根菜单的 pid 设为 null
    if (currentMenuType.value === MenuTypeRoot) {
        formData.pid = null;
    }
    
    try {
        if (currentMenuStatus.value === MenuStatusEnum.Edit) {
            await updateAppMenu(formData);
            Message.success("更新菜单成功");
        } else if (currentMenuStatus.value === MenuStatusEnum.Add) {
            await createAppMenu(formData);
            Message.success("创建菜单成功");
        }
        // 刷新菜单树
        await getAllMenuListTree();
        // 重置状态
        currentMenuStatus.value = MenuStatusEnum.Detail;
        currentMenuType.value = MenuTypeRoot;
        currentMenuNode.value = {};
        menuFormValue.value = {};
        treeSelectedKeys.value = [];
        selectedMenuBreadcrumb.value = [];
    } catch (error: any) {
        Message.error(error?.message || "操作失败");
    }
}

// 重置表单
function onMenuFormReset() {
    if (currentMenuStatus.value === MenuStatusEnum.Edit) {
        menuFormValue.value = JSON.parse(JSON.stringify(currentMenuNode.value));
    } else {
        menuFormValue.value = { 
            type: currentMenuType.value === MenuTypeRoot ? AppMenuType.Catalog : menuFormValue.value.type,
            status: AppMenuStatus.ENABLE,
        };
    }
}

// 删除菜单
async function onDeleteMenu() {
    if (!currentMenuNode.value?.id) {
        Message.warning("请先选择要删除的菜单");
        return;
    }
    
    try {
        await deleteAppMenu(currentMenuNode.value.id);
        Message.success("删除菜单成功");
        // 刷新菜单树
        await getAllMenuListTree();
        // 重置状态
        currentMenuStatus.value = MenuStatusEnum.Detail;
        currentMenuType.value = MenuTypeRoot;
        currentMenuNode.value = {};
        menuFormValue.value = {};
        treeSelectedKeys.value = [];
        selectedMenuBreadcrumb.value = [];
    } catch (error: any) {
        Message.error(error?.message || "删除失败");
    }
}

// 菜单树节点选择事件
function onSelectedkeysUpdate(
    selectedKeys: Array<string | number>,
    data: { selected?: boolean; selectedNodes: TreeNodeData[]; node?: TreeNodeData; e?: Event }
) {
    treeSelectedKeys.value = selectedKeys;
    currentMenuNode.value = data.node || {};
    // 构建面包屑
    if (data.node?.id) {
        selectedMenuBreadcrumb.value = buildBreadcrumb(data.node.id, menuList.value);
    }
    // 进入详情模式
    onDetailMenu();
}

// 初始化加载
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
