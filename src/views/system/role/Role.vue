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
                    :disabled="true"
                    v-model="roleFormData"
                    :default-form-action-button-col-props="RoleFormConfig.RoleFormBtnColProps"
                    :default-form-col-props="RoleFormConfig.RoleDetailFormColProps"
                    :form-input-items="RoleFormInputItems"
                    :default-form-label-props="RoleFormConfig.RoleDetailFormLabelProps"
                    :form-props="ComputedRoleFormProps"
                    :default-form-row-props="RoleFormConfig.RoleDetailFormRowProps"
                    ref="formRef"
                >
                    <!-- <template #menus>
                        <a-tree-select
                            :data="menuList"
                            :fieldNames="{
                                key: 'id',
                                title: 'title',
                                children: 'children',
                                icon: null,
                            }"
                            allow-clear
                            size="large"
                            tree-checkable
                            multiple
                            :animation="true"
                            block-node
                        ></a-tree-select>
                    </template> -->
                </NaForm>
                <!-- 权限树 -->
                <a-collapse :default-active-key="['1', 2]">
                    <a-collapse-item
                        header="管理权限"
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
            <template v-slot:title>角色管理</template>
            <template v-slot:subtitle>测试</template>
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
                    :request-table-data-fn="getRoleListApi"
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
                        <ShiroAuth :permissions="['system.menu.export']">
                            <a-button size="small">
                                <template v-slot:icon>
                                    <icon-download class="tw-text-[16px]" />
                                </template>
                                <template #default>导出角色列表</template>
                            </a-button>
                        </ShiroAuth>
                    </template>
                    <!-- 表格过滤表单 -->
                    <template #filterForm>
                        <NaForm
                            v-model="searchFormData"
                            :default-form-action-button-col-props="roleTableSearchFormBtnColProps"
                            :default-form-col-props="roleTableSearchFormColProps"
                            :form-input-items="roleTableSearchInputItems"
                            :default-form-label-props="roleTableSearchFormLabelProps"
                            :form-props="ComputedRoleFormProps"
                            ref="formRef"
                            @action-reset="handleReset"
                            @action-submit="handleSubmit"
                        >
                            <template #created_at>
                                <a-range-picker
                                    v-model="searchFormData.created_at"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    show-time
                                    :disable-confirm="true"
                                    class="tw-flex-1"
                                    :time-picker-props="{
                                        defaultValue: ['00:00:00', '00:00:00'],
                                    }"
                                />
                            </template>
                        </NaForm>
                    </template>
                    <!-- 状态 -->
                    <template #status="{ record }">
                        <a-tag
                            color="red"
                            v-if="record.status === RoleStatus.DISABLE"
                            :size="NaTableRef?.NaTableContext.NaTableState.value.size"
                        >
                            禁用
                        </a-tag>
                        <a-tag
                            color="arcoblue"
                            v-if="record.status === RoleStatus.ENABLE"
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
                <!-- 表格 -->
            </div>
        </main>
    </div>
</template>

<script setup lang="tsx">
    import {
    createRoleApi,
    CreateRoleDto,
    deleteRoleApi,
    DetailRoleDto,
    getRoleListApi,
    getRoleMenusListApi,
    updateRoleApi,
    UpdateRoleDto,
} from "@/api/role";
import ShiroAuth from "@/components/ShiroAuth.vue";
import type { FormInstance } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";

    import { getMenuList } from "@/api/menu";
import { NaFormInputItem } from "@/components/NaForm/type";
import NaPageHeader from "@/components/NaPageHeader.vue";
import useNaTable from "@/components/NaTable/useNaTable";
import { flat2treeByMap } from "@/utils/treeCover";
import { cloneDeep } from "es-toolkit";
import { computed, ref } from "vue";
import RoleFormConfig from "./config/roleDetailFormConfig";
import roleTableSearchFormConfig from "./config/roleTableSearchFormConfig";
    const { NaTableComponent: NaTable, NaTableRef } = useNaTable();
    defineOptions({
        name: "Role",
    });
    onCreated();
    enum RoleStatus {
        DISABLE = "DISABLE",
        ENABLE = "ENABLE",
    }

    enum RoleFormStatus {
        CREATE = 1, // 新建角色
        EDIT, // 修改角色
        DETAIL, // 查看角色详情
        ASSIGN, // 分配选项状态
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
            title: "更新时间",
            dataIndex: "updated_at",
            align: "center",
        },
        {
            title: "操作",
            slotName: "action",
            dataIndex: "action",
            width: 250,
            align: "center",
        },
    ];
    // 表格过滤表单项配置
    // 表格过滤表单数据
    let searchFormData = ref<any>({
        name: null,
        status: null,
        code: null,
        created_at: [],
    });
    // 菜单数数据
    let menuList = ref<any>([]);
    const roleTableSearchInputItems = ref<NaFormInputItem[]>(
        roleTableSearchFormConfig.roleTableSearchInputItems
    );
    const roleTableSearchFormColProps = ref(roleTableSearchFormConfig.roleTableSearchFormColProps);
    const roleTableSearchFormLabelProps = ref(
        roleTableSearchFormConfig.roleTableSearchFormLabelProps
    );
    const roleTableSearchFormBtnColProps = ref(
        roleTableSearchFormConfig.roleTableSearchFormBtnColProps
    );
    const formRef = ref<FormInstance>();
    const roleTablePinColumns = ["id", "status", "action"];
    let swtich = ref({
        checkedValue: "ENABLED",
        uncheckedValue: "DISABLED",
        checkedText: " 启用",
        uncheckedText: "禁用",
    });
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
            case RoleFormStatus.ASSIGN:
                return RoleFormConfig.RoleFormDetailInputItems;
            default:
                return [];
        }
    });
    // 计算表单项 fromProps
    let ComputedRoleFormProps = computed(() => {
        if (
            currentRoleFormStatus.value === RoleFormStatus.ASSIGN ||
            currentRoleFormStatus.value === RoleFormStatus.DETAIL
        ) {
            return { ...RoleFormConfig.RoleDetailFormProps, disabled: true };
        }
        return RoleFormConfig.RoleDetailFormProps;
    });

    // 重置搜索表单项
    const handleReset = () => {
        searchFormData.value = {
            name: "",
            status: "",
            created_at: [],
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
    //  当前角色选择的权限
    let selectedMenuIds = ref<number[]>([]);
    // 当前点击的角色
    let currentRole = ref<DetailRoleDto>({} as DetailRoleDto);
    const roleFormDataAddInit = {
        name: "",
        code: "",
        description: null,
        status: swtich.value.checkedValue,
        menus: [],
    };
    // 模态框角色详情表单数据
    let roleFormData = ref<CreateRoleDto | UpdateRoleDto | DetailRoleDto>(
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
        await getAllMenuListTree(); // 重新获取菜单树
        originalMenuIds.value = [];
        selectedMenuIds.value = originalMenuIds.value;
    }
    // 查看角色详情
    const showRoleDetail = async (record: any) => {
        currentRole.value = record;
        currentRoleFormStatus.value = RoleFormStatus.DETAIL;
        showRoleDetailModal.value = true;
        roleFormData.value = cloneDeep(record);
        await getAllMenuListTree(); // 重新获取菜单树
        const res = await getRoleMenusListApi(record.id); // 获取点击的角色的所有菜单 id
        originalMenuIds.value = res.data.map((menu: any) => {
            return menu.menu_id;
        });
        selectedMenuIds.value = originalMenuIds.value;
    };

    // 编辑角色
    const editRole = async (record: any) => {
        currentRole.value = cloneDeep(record);
        currentRoleFormStatus.value = RoleFormStatus.EDIT;
        showRoleDetailModal.value = true;
        await getAllMenuListTree(); // 重新获取菜单树
        const res = await getRoleMenusListApi(record.id); // 获取点击的角色的所有菜单 id
        originalMenuIds.value = res.data.map((menu: any) => {
            return menu.menu_id;
        });
        selectedMenuIds.value = originalMenuIds.value;
        roleFormData.value = cloneDeep(record);
    };
    // 删除角色
    const deleteRole = async (record: any) => {
        try {
            await deleteRoleApi(record.id);
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
        // 重置表单数据
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
        await createRoleApi({ ...data, menus: unref(selectedMenuIds) } as CreateRoleDto);
        Message.success("创建成功");
    }
    // 确认角色编辑
    async function onRoleFormEdit() {
        let data = cloneDeep(unref(roleFormData));
        await updateRoleApi(currentRole.value.id, {
            ...data,
            menus: unref(selectedMenuIds),
        } as UpdateRoleDto);
        Message.success("更新成功");
    }
    function refreshTable() {
        NaTableRef.value?.NaTableContext.NaTableMethods.getTableData();
    }
    // 获取菜单树
    async function getAllMenuListTree() {
        const res = await getMenuList({});
        // 如果是状态是查看详情,则禁用复选框
        if (currentRoleFormStatus.value === RoleFormStatus.DETAIL)
            res.data.forEach((menu: any) => {
                menu.disableCheckbox = true;
            });
        const menuTree = flat2treeByMap(res.data, {
            fieldsPath: "order",
            sequential: false,
        });
        // 将菜单数据转为树形结构
        menuList.value = menuTree;
        return menuTree;
    }
    function onCreated() {
        refreshTable();
        getAllMenuListTree();
    }

    // 初始化加载
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
    #editor {
        height: 100px;
        width: 100%;
    }
</style>
