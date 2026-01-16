<template>
    <div class="page tw-flex tw-flex-col">
        <a-modal
            v-model:visible="showRoleDetailModal"
            v-model="roleFormData"
            @cancel="handleCancel"
            @ok="handleOk"
            width="50%"
            draggable
        >
            <template #title>{{ roleModalTitle }}</template>
            <div>
                <NaForm
                    :disabled="currentRoleFormStatus === RoleFormStatus.DETAIL"
                    v-model="roleFormData"
                    :default-form-action-button-col-props="RoleFormConfig.RoleFormBtnColProps"
                    :default-form-col-props="RoleFormConfig.RoleDetailFormColProps"
                    :form-input-items="RoleFormInputItems"
                    :default-form-label-props="RoleFormConfig.RoleDetailFormLabelProps"
                    :form-props="ComputedRoleFormProps"
                    :default-form-row-props="RoleFormConfig.RoleDetailFormRowProps"
                    ref="formRef"
                >
                </NaForm>
                <!-- 权限树 -->
                <a-collapse :default-active-key="['1']">
                    <a-collapse-item
                        header="菜单权限"
                        key="1"
                    >
                        <a-tree
                            :fieldNames="{
                                key: 'id',
                                title: 'title',
                                children: 'children',
                                icon: null,
                            }"
                            check-strictly
                            :checkable="true"
                            :animation="true"
                            :data="menuList"
                            block-node
                            v-model:checked-keys="selectedMenuIds"
                            v-model:selected-keys="selectedMenuIds"
                            :disabled="currentRoleFormStatus === RoleFormStatus.DETAIL"
                        ></a-tree>
                    </a-collapse-item>
                </a-collapse>
            </div>
        </a-modal>
        <NaPageHeader
            :show-back="false"
            full
            class="tw-mb-4 tw-flex-none"
        >
            <template v-slot:title>App 角色管理</template>
            <template v-slot:subtitle>管理 App 端角色</template>
        </NaPageHeader>
        <main class="tw-flex-none">
            <div class="!tw-rounded tw-overflow-hidden tw-bg-cbg-1 tw-p-4">
                <!-- 表格筛选表单 -->
                <NaTable
                    title="角色列表"
                    :columns="cols"
                    :data="tableData"
                    :pin-columns="roleTablePinColumns"
                    :scroll="{ x: '100%', y: '100%', minWidth: 1500 }"
                    :scrollbar="true"
                    size="small"
                    :sticky-header="60"
                    :stripe="true"
                    :is-bordered="true"
                    :request-table-data-fn="getAppRoleList"
                    :filter-value="searchFormData"
                    :is-enable-pagination="true"
                    :is-show-filter="true"
                    :is-enable-filter="true"
                >
                    <template #leftToolBar>
                        <a-button
                            type="primary"
                            size="small"
                            @click="createRole"
                        >
                            <template v-slot:icon>
                                <icon-plus class="tw-text-[16px]" />
                            </template>
                            <template #default>创建新角色</template>
                        </a-button>
                    </template>
                    <!-- 表格过滤表单 -->
                    <template #filterForm>
                        <NaForm
                            v-model="searchFormData"
                            :default-form-action-button-col-props="SearchFormConfig.SearchFormBtnColProps"
                            :default-form-col-props="SearchFormConfig.SearchFormColProps"
                            :form-input-items="SearchFormConfig.SearchInputItems"
                            :default-form-label-props="SearchFormConfig.SearchFormLabelProps"
                            :form-props="SearchFormConfig.SearchFormProps"
                            ref="searchFormRef"
                            @action-reset="handleReset"
                            @action-submit="handleSubmit"
                        >
                        </NaForm>
                    </template>
                    <!-- 状态 -->
                    <template #status="{ record }">
                        <a-tag
                            color="red"
                            v-if="record.status === AppRoleStatus.DISABLE"
                            :size="NaTableRef?.NaTableContext.NaTableState.value.size"
                        >
                            禁用
                        </a-tag>
                        <a-tag
                            color="arcoblue"
                            v-if="record.status === AppRoleStatus.ENABLE"
                            :size="NaTableRef?.NaTableContext.NaTableState.value.size"
                        >
                            启用
                        </a-tag>
                    </template>
                    <!-- 操作按钮 -->
                    <template #action="{ record }">
                        <a-space
                            wrap
                            size="mini"
                        >
                            <a-link @click="showRoleDetail(record)">详情</a-link>
                            <a-link
                                type="primary"
                                @click="editRole(record)"
                            >
                                编辑
                            </a-link>
                            <a-popconfirm
                                content="确定要删除该角色吗?"
                                @ok="deleteRole(record)"
                            >
                                <a-link
                                    status="danger"
                                    type="primary"
                                >
                                    删除
                                </a-link>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </NaTable>
            </div>
        </main>
    </div>
</template>

<script setup lang="tsx">
import {
    getAppRoleList,
    createAppRole,
    updateAppRole,
    deleteAppRole as deleteAppRoleApi,
    getAppRoleMenus,
    assignAppRoleMenus,
    AppRoleStatus,
    CreateAppRoleDto,
    UpdateAppRoleDto,
    AppRole,
} from "@/api/appRole";
import { getAppMenuList } from "@/api/appMenu";
import type { FormInstance } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
import { NaFormInputItem } from "@/components/NaForm/type";
import NaPageHeader from "@/components/NaPageHeader.vue";
import useNaTable from "@/components/NaTable/useNaTable";
import { flat2treeByMap } from "@/utils/treeCover";
import { cloneDeep } from "es-toolkit";
import { computed, ref, unref } from "vue";
import RoleFormConfig from "./config/roleDetailFormConfig";
import SearchFormConfig from "./config/roleTableSearchFormConfig";

const { NaTableComponent: NaTable, NaTableRef } = useNaTable();

defineOptions({
    name: "AppRole",
});

onCreated();

enum RoleFormStatus {
    CREATE = 1, // 新建角色
    EDIT, // 修改角色
    DETAIL, // 查看角色详情
}

const cols = [
    {
        title: "ID",
        dataIndex: "id",
        width: 70,
        align: "center",
    },
    {
        title: "角色名称",
        dataIndex: "name",
        width: 150,
        align: "center",
    },
    {
        title: "角色代码",
        dataIndex: "code",
        width: 150,
        align: "center",
    },
    {
        title: "描述",
        dataIndex: "description",
        align: "center",
    },
    {
        title: "状态",
        slotName: "status",
        dataIndex: "status",
        width: 100,
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "created_at",
        align: "center",
    },
    {
        title: "操作",
        slotName: "action",
        dataIndex: "action",
        width: 200,
        align: "center",
    },
];

// 表格过滤表单数据
let searchFormData = ref<any>({
    name: null,
    code: null,
    status: null,
});

// 菜单树数据
let menuList = ref<any>([]);

const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const roleTablePinColumns = ["id", "status", "action"];

// 当前模态框状态
let currentRoleFormStatus = ref(RoleFormStatus.CREATE);
// 是否显示模态弹窗
let showRoleDetailModal = ref(false);

// 角色模态框表单输入项
const RoleFormInputItems = computed(() => {
    switch (currentRoleFormStatus.value) {
        case RoleFormStatus.CREATE:
            return RoleFormConfig.RoleFormAddInputItems;
        case RoleFormStatus.DETAIL:
            return RoleFormConfig.RoleFormDetailInputItems;
        case RoleFormStatus.EDIT:
            return RoleFormConfig.RoleFormEditInputItems;
        default:
            return [];
    }
});

// 计算表单项 fromProps
let ComputedRoleFormProps = computed(() => {
    if (currentRoleFormStatus.value === RoleFormStatus.DETAIL) {
        return { ...RoleFormConfig.RoleDetailFormProps, disabled: true };
    }
    return RoleFormConfig.RoleDetailFormProps;
});

// 重置搜索表单项
const handleReset = () => {
    searchFormData.value = {
        name: null,
        code: null,
        status: null,
    };
    NaTableRef.value?.NaTableContext.NaTableMethods.resetFilterForm();
};

const handleSubmit = () => {
    NaTableRef.value?.NaTableContext.NaTableMethods.filterFormSubmit();
};

// 角色列表数据
const tableData = ref<any>([]);

// 当前角色拥有的权限 id 数组
let originalMenuIds = ref<number[]>([]);
// 当前角色选择的权限
let selectedMenuIds = ref<number[]>([]);
// 当前点击的角色
let currentRole = ref<AppRole>({} as AppRole);

const roleFormDataAddInit = {
    name: "",
    code: "",
    description: null,
    status: AppRoleStatus.ENABLE,
    menus: [],
};

// 模态框角色详情表单数据
let roleFormData = ref<CreateAppRoleDto | UpdateAppRoleDto | AppRole>(
    cloneDeep(roleFormDataAddInit)
);

// 模态框标题
const roleModalTitle = computed(() => {
    switch (currentRoleFormStatus.value) {
        case RoleFormStatus.CREATE:
            return "创建角色";
        case RoleFormStatus.EDIT:
            return "修改角色";
        case RoleFormStatus.DETAIL:
            return "角色详情";
        default:
            return "";
    }
});

// 创建角色
async function createRole() {
    currentRoleFormStatus.value = RoleFormStatus.CREATE;
    showRoleDetailModal.value = true;
    roleFormData.value = cloneDeep(roleFormDataAddInit);
    await getAllMenuListTree();
    originalMenuIds.value = [];
    selectedMenuIds.value = originalMenuIds.value;
}

// 查看角色详情
const showRoleDetail = async (record: AppRole) => {
    currentRole.value = record;
    currentRoleFormStatus.value = RoleFormStatus.DETAIL;
    showRoleDetailModal.value = true;
    roleFormData.value = cloneDeep(record);
    await getAllMenuListTree();
    try {
        const res = await getAppRoleMenus(record.id);
        originalMenuIds.value = res.data || [];
        selectedMenuIds.value = originalMenuIds.value;
    } catch (error) {
        originalMenuIds.value = [];
        selectedMenuIds.value = [];
    }
};

// 编辑角色
const editRole = async (record: AppRole) => {
    currentRole.value = cloneDeep(record);
    currentRoleFormStatus.value = RoleFormStatus.EDIT;
    showRoleDetailModal.value = true;
    await getAllMenuListTree();
    try {
        const res = await getAppRoleMenus(record.id);
        originalMenuIds.value = res.data || [];
        selectedMenuIds.value = originalMenuIds.value;
    } catch (error) {
        originalMenuIds.value = [];
        selectedMenuIds.value = [];
    }
    roleFormData.value = cloneDeep(record);
};

// 删除角色
const deleteRole = async (record: AppRole) => {
    try {
        await deleteAppRoleApi(record.id);
        Message.success("删除成功");
        refreshTable();
    } catch (error) {
        Message.error("删除失败");
    }
};

// 弹窗取消
const handleCancel = () => {
    showRoleDetailModal.value = false;
    formRef.value?.resetFields();
    roleFormData.value = cloneDeep(roleFormDataAddInit);
};

// 弹窗确认
const handleOk = async () => {
    try {
        if (currentRoleFormStatus.value === RoleFormStatus.EDIT) {
            await onRoleFormEdit();
        } else if (currentRoleFormStatus.value === RoleFormStatus.CREATE) {
            await onRoleFormCreate();
        }
        showRoleDetailModal.value = false;
        refreshTable();
    } catch (error) {
        console.log(error);
        Message.error("操作失败");
    }
};

// 确认创建角色数据
async function onRoleFormCreate() {
    let data = cloneDeep(unref(roleFormData));
    await createAppRole({ ...data, menus: unref(selectedMenuIds) } as CreateAppRoleDto);
    // 如果选择了菜单权限，则分配菜单
    if (selectedMenuIds.value.length > 0) {
        // 创建后需要获取新角色ID来分配菜单，这里暂时跳过
        // 因为创建时可以直接传入 menus 参数
    }
    Message.success("创建成功");
}

// 确认角色编辑
async function onRoleFormEdit() {
    let data = cloneDeep(unref(roleFormData));
    await updateAppRole({
        ...data,
        id: currentRole.value.id,
    } as UpdateAppRoleDto);
    // 分配菜单权限
    await assignAppRoleMenus(currentRole.value.id, unref(selectedMenuIds));
    Message.success("更新成功");
}

function refreshTable() {
    NaTableRef.value?.NaTableContext.NaTableMethods.getTableData();
}

// 获取菜单树
async function getAllMenuListTree() {
    try {
        const res = await getAppMenuList();
        const menuData = res.data || [];
        // 如果是状态是查看详情,则禁用复选框
        if (currentRoleFormStatus.value === RoleFormStatus.DETAIL) {
            menuData.forEach((menu: any) => {
                menu.disableCheckbox = true;
            });
        }
        const menuTree = flat2treeByMap(menuData, {
            fieldsPath: "order",
            sequential: false,
        });
        menuList.value = menuTree;
        return menuTree;
    } catch (error) {
        menuList.value = [];
        return [];
    }
}

function onCreated() {
    refreshTable();
    getAllMenuListTree();
}
</script>

<style scoped lang="scss">
.page {
    min-height: 100%;
}

.na-table__table {
    flex: auto;
    min-height: 0;
}

main {
    min-height: 0;
}
</style>
