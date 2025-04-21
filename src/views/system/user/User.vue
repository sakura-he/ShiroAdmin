<template>
    <div class="page tw-flex tw-flex-col">
        <a-modal
            v-model:visible="showUserDetailModal"
            @cancel="handleCancel"
            @before-ok="onUserFormModalBeforeOk"
            width="50%"
        >
            <template #title>{{ getUserDetailModalTitle }}</template>
            <div>
                <NaForm
                    v-model="userFormData"
                    :default-form-action-button-col-props="UserFormBtnColProps"
                    :default-form-col-props="UserFormColProps"
                    :form-input-items="UserFormInputItems"
                    :default-form-label-props="UserFormLabelProps"
                    :form-props="computedUserFormProps"
                    :default-form-row-props="UserFormRowProps"
                    ref="formRef"
                />
            </div>
        </a-modal>
        <NaPageHeader
            :show-back="false"
            full
            class="tw-mb-4 tw-flex-none"
        >
            <template v-slot:title>用户管理</template>
        </NaPageHeader>
        <main class="tw-flex-none !tw-rounded tw-overflow-hidden tw-bg-cbg-1 tw-p-3">
            <a-row :gutter="12">
                <a-col
                    :xs="24"
                    :sm="5"
                >
                    <div class="tw-text-title-1 tw-font-bold tw-pb-4">部门列表</div>
                    <a-tree :data="treeData"></a-tree>
                </a-col>
                <a-col
                    :xs="24"
                    :sm="19"
                >
                    <div>
                        <!-- 表格筛选表单 -->
                        <NaTable
                            title="用户列表"
                            :columns="cols"
                            :data="tableData"
                            :pin-columns="userTablePinColumns"
                            :scroll="{ x: '100%', y: '100%', minWidth: 2000 }"
                            :scrollbar="true"
                            size="small"
                            :stripe="true"
                            :is-bordered="true"
                            :request-table-data-fn="getUserList"
                            :filter-value="searchFormData"
                            :is-enable-pagination="true"
                            :is-show-filter="true"
                            :is-enable-filter="true"
                        >
                            <template #leftToolBar>
                                <a-button
                                    type="primary"
                                    size="small"
                                    @click="onOpenCreateUser"
                                >
                                    <template v-slot:icon>
                                        <icon-plus class="tw-text-[16px]" />
                                    </template>
                                    <template #default>创建新用户</template>
                                </a-button>
                                <a-button size="small">
                                    <template v-slot:icon>
                                        <icon-download class="tw-text-[16px]" />
                                    </template>
                                    <template #default>导出用户列表</template>
                                </a-button>
                            </template>
                            <!-- 表格过滤表单 -->
                            <template #filterForm>
                                <NaForm
                                    v-model="searchFormData"
                                    :default-form-action-button-col-props="SearchFormBtnColProps"
                                    :default-form-col-props="SearchFormColProps"
                                    :form-input-items="SearchInputItems"
                                    :default-form-label-props="SearchFormLabelProps"
                                    :form-props="SearchFormProps"
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

                            <!-- 操作按钮 -->
                            <template #action="{ record }">
                                <a-space
                                    wrap
                                    size="mini"
                                >
                                    <a-link
                                        type="primary"
                                        @click="onOpenEditUser(record)"
                                    >
                                        修改
                                    </a-link>
                                    <a-link @click="onOpenUserDetail(record)">用户详情</a-link>

                                    <a-popconfirm type="warning" content="确定要删除该用户吗?" @ok="deleteUser(record)">
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
                </a-col>
            </a-row>
        </main>
    </div>
</template>

<script setup lang="tsx">
    import { getRoleListApi } from "@/api/role";
import {
    createUserApi,
    CreateUserFormDto,
    deleteUserApi,
    getUserList,
    updateUserApi,
    UpdateUserFormDto,
    UserDetailFormDto,
    UserEnumApi,
} from "@/api/user2";
import { NaFormInputItem } from "@/components/NaForm";
import NaPageHeader from "@/components/NaPageHeader.vue";
import useNaTable from "@/components/NaTable/useNaTable";
import { Message, type FormInstance } from "@arco-design/web-vue";
import { cloneDeep } from "es-toolkit";
import { computed, reactive, ref } from "vue";
import {
    UserFormBtnColProps,
    UserFormColProps,
    UserFormInputItemsUserAdd,
    UserFormInputItemsUserDetail,
    UserFormInputItemsUserEdit,
    UserFormLabelProps,
    UserFormProps,
    UserFormRowProps,
} from "./config/userFormConfig";
import {
    SearchFormBtnColProps,
    SearchFormColProps,
    SearchFormLabelProps,
    SearchFormProps,
    SearchInputItems,
} from "./config/userTableSearchFormConfig";
    defineOptions({
        name: "User",
    });
    const { NaTableComponent: NaTable, NaTableRef } = useNaTable();
    let roleListOptions = ref<any[]>([]);
    const treeData = [
        {
            title: "Trunk 0-0",
            key: "0-0",
            children: [
                {
                    title: "Branch 0-0-0",
                    key: "0-0-0",
                    children: [
                        {
                            title: "Leaf",
                            key: "0-0-0-0",
                        },
                        {
                            title: "Leaf",
                            key: "0-0-0-1",
                        },
                    ],
                },
                {
                    title: "Branch 0-0-1",
                    key: "0-0-1",
                    children: [
                        {
                            title: "Leaf",
                            key: "0-0-1-0",
                        },
                    ],
                },
            ],
        },
    ];
    // onCreated();

    enum UserStatus {
        DISABLE = 2,
        ENABLE = 1,
    }

    enum UserModalType {
        ADD = 1, // 新建用户
        EDIT, // 修改用户
        DETAIL, // 查看用户详情
    }
    const cols = [
        {
            dataIndex: "id",
            title: "id",
            width: "70",
            align: "center",
            fixed: "left",
        },
        {
            dataIndex: "username",
            title: "用户名称",
            width: 200,
            fixed: "left",
            align: "center",
        },
        {
            dataIndex: "nickname",
            title: "用户昵称",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "remark",
            title: "备注",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "phone",
            align: "center",
            title: "手机号",
        },
        {
            dataIndex: "is_lock",
            title: "锁定状态",
            align: "center",
        },

        {
            dataIndex: "status",

            align: "center",
            title: "状态",
            width: 100,
        },

        {
            dataIndex: "created_at",
            align: "center",
            title: "创建时间",
            width: 150,
        },
        {
            dataIndex: "updated_at",
            title: "更新时间",
            align: "center",
            width: 150,
        },
        {
            slotName: "action",
            title: "操作",
            width: 180,
            align: "center",
            fixed: "right",
        },
    ];
    // 表格过滤表单项配置
    // 表格过滤表单数据
    let searchFormData = ref<any>({
        name: "",
        status: "",
        strategy: "",
        created_at: [],
    });

    const formRef = ref<FormInstance>();
    const userTablePinColumns = ["id", "status", "action"];
    // 当前模态框状态
    let currentUserModalType = ref(UserModalType.ADD);
    // 是否显示模态弹窗
    let showUserDetailModal = ref(false);
    let computedUserFormProps = computed(() => {
        if (currentUserModalType.value === UserModalType.DETAIL) {
            return { ...UserFormProps, disabled: true };
        }
        return UserFormProps;
    });
    // 用户详情表单输入项配置
    const UserFormInputItems = computed(() => {
        let inputItem: NaFormInputItem[] | undefined = undefined;
        switch (currentUserModalType.value) {
            case UserModalType.ADD:
                inputItem = UserFormInputItemsUserAdd;
            case UserModalType.DETAIL:
                inputItem = UserFormInputItemsUserDetail;
            case UserModalType.EDIT:
                inputItem = UserFormInputItemsUserEdit;
            default:
                inputItem = UserFormInputItemsUserAdd;
        }
        inputItem = inputItem.map((field) => {
            if (field.field === "roles") {
                let _field = cloneDeep(field);
                _field.formInputProps = {
                    ..._field.formInputProps,
                    options: [...roleListOptions.value],
                    fieldNames: { value: "id", label: "name" },
                };
                return _field;
            }
            return field;
        });
        return inputItem;
    });

    // 表格配置
    const tableConfig = reactive({
        page: 1,
        pageSize: 10,
        stripe: false,
    });
    const handleReset = () => {
        searchFormData.value = {
            name: "",
            status: "",
            strategy: "",
            created_at: [],
        };
        NaTableRef.value?.NaTableContext.NaTableMethods.resetFilterForm();
    };
    const handleSubmit = () => {
        NaTableRef.value?.NaTableContext.NaTableMethods.filterFormSubmit();
    };

    // 用户列表数据
    const tableData = ref<any>([]);
    const userFormDataUserAddInit = {
        username: "",
        status: UserEnumApi.ENABLE,
        password: "",
        nickname: null,
        remark: null,
        phone: null,
        email: null,
        avatar: null,
        is_lock: false,
        roles: [],
    };
    // 模态框用户详情表单数据
    let userFormData = ref<CreateUserFormDto | UpdateUserFormDto | UserDetailFormDto>({
        ...userFormDataUserAddInit,
    });
    // 模态框标题
    const getUserDetailModalTitle = computed(() => {
        switch (currentUserModalType.value) {
            case UserModalType.ADD:
                return "创建用户";
            case UserModalType.EDIT:
                return "修改用户";
            case UserModalType.DETAIL:
                return "用户详情";
            default:
                return "创建用户";
        }
    });
    // 创建用户弹窗
    function onOpenCreateUser() {
        currentUserModalType.value = UserModalType.ADD;
        showUserDetailModal.value = true;
        // 初始化用户信息表单值
        userFormData.value = cloneDeep(userFormDataUserAddInit);
    }
    // 查看用户详情弹窗
    const onOpenUserDetail = (record: any) => {
        let _record: any = cloneDeep(record);
        _record.roles.forEach((role: any, index: number) => {
            _record.roles[index] = role.role_id;
        });
        currentUserModalType.value = UserModalType.DETAIL;
        showUserDetailModal.value = true;

        // 更新用户信息表单值
        userFormData.value = _record;
    };

    // 编辑用户弹窗
    const onOpenEditUser = (record: any) => {
        let _record: any = cloneDeep(record);
        _record.roles.forEach((role: any, index: number) => {
            _record.roles[index] = role.role_id;
        });
        userFormData.value = _record;
        currentUserModalType.value = UserModalType.EDIT;
        showUserDetailModal.value = true;
    };
    async function onUserFormModalBeforeOk() {
        try {
            if (currentUserModalType.value === UserModalType.ADD) {
                await createUserApi(unref(userFormData.value) as CreateUserFormDto);
            }
            if (currentUserModalType.value === UserModalType.DETAIL) {
            }
            if (currentUserModalType.value === UserModalType.EDIT) {
                const data = unref(userFormData.value) as UpdateUserFormDto;
                await updateUserApi(data.id, data);
            }
            console.log("onUserFormModalBeforeOk", userFormData.value);

            return true;
        } catch (error) {
            return false;
        }
    }

    // 删除用户
    const deleteUser = async (record: any) => {
        try {
            await deleteUserApi(record.id);
            Message.success("删除成功");
            refreshTable();
        } catch (error) {
            Message.error("删除失败");
        }
    };

    // 弹窗取消
    const handleCancel = () => {
        showUserDetailModal.value = false;
        formRef.value?.resetFields();
        // 重置表单数据
        userFormData.value = cloneDeep(userFormDataUserAddInit);
    };
    function refreshTable() {
        NaTableRef.value?.NaTableContext.NaTableMethods.getTableData();
    }

    async function onCreated() {
        let res = await getRoleListApi({});
        let roles = res.data.records;
        console.log(roles);
        roleListOptions.value.length = 0;
        roleListOptions.value.push(...roles);
    }
    // 初始化加载
    onCreated();
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
