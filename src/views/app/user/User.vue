<template>
    <div class="page tw-flex tw-flex-col">
        <!-- 用户创建/编辑/详情弹窗 -->
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

        <!-- 重置密码弹窗 -->
        <a-modal
            v-model:visible="showResetPasswordModal"
            @cancel="handleResetPasswordCancel"
            @before-ok="onResetPasswordBeforeOk"
            title="重置密码"
            width="400px"
        >
            <a-form :model="resetPasswordForm" ref="resetPasswordFormRef">
                <a-form-item
                    field="password"
                    label="新密码"
                    :rules="[{ required: true, message: '请输入新密码' }]"
                >
                    <a-input-password
                        v-model="resetPasswordForm.password"
                        placeholder="请输入新密码"
                        allow-clear
                    />
                </a-form-item>
                <a-form-item
                    field="confirmPassword"
                    label="确认密码"
                    :rules="[
                        { required: true, message: '请确认新密码' },
                        { validator: validateConfirmPassword }
                    ]"
                >
                    <a-input-password
                        v-model="resetPasswordForm.confirmPassword"
                        placeholder="请再次输入新密码"
                        allow-clear
                    />
                </a-form-item>
            </a-form>
        </a-modal>

        <NaPageHeader
            :show-back="false"
            full
            class="tw-mb-4 tw-flex-none"
        >
            <template v-slot:title>App 用户管理</template>
        </NaPageHeader>

        <main class="tw-flex-1 !tw-rounded tw-overflow-hidden tw-bg-cbg-1 tw-p-3">
            <NaTable
                title="用户列表"
                :columns="cols"
                :data="tableData"
                :pin-columns="userTablePinColumns"
                :scroll="{ x: '100%', y: '100%', minWidth: 1500 }"
                :scrollbar="true"
                size="small"
                :stripe="true"
                :is-bordered="true"
                :request-table-data-fn="getAppUserList"
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
                        ref="searchFormRef"
                        @action-reset="handleReset"
                        @action-submit="handleSubmit"
                    />
                </template>

                <!-- 头像列 -->
                <template #avatar="{ record }">
                    <a-avatar v-if="record.avatar" :size="32">
                        <img :src="record.avatar" alt="avatar" />
                    </a-avatar>
                    <a-avatar v-else :size="32">
                        <icon-user />
                    </a-avatar>
                </template>

                <!-- 状态列 -->
                <template #status="{ record }">
                    <a-tag :color="record.status === 1 ? 'green' : 'red'">
                        {{ record.status === 1 ? '启用' : '禁用' }}
                    </a-tag>
                </template>

                <!-- 操作按钮 -->
                <template #action="{ record }">
                    <a-space wrap size="mini">
                        <a-link type="primary" @click="onOpenEditUser(record)">
                            修改
                        </a-link>
                        <a-link @click="onOpenUserDetail(record)">
                            详情
                        </a-link>
                        <a-link @click="onOpenResetPassword(record)">
                            重置密码
                        </a-link>
                        <a-popconfirm
                            type="warning"
                            content="确定要删除该用户吗?"
                            @ok="deleteUser(record)"
                        >
                            <a-link status="danger" type="primary">
                                删除
                            </a-link>
                        </a-popconfirm>
                    </a-space>
                </template>
            </NaTable>
        </main>
    </div>
</template>

<script setup lang="tsx">
import {
    getAppUserList,
    createAppUser,
    updateAppUser,
    deleteAppUser,
    resetAppUserPassword,
    AppUserStatus,
    CreateAppUserDto,
    UpdateAppUserDto,
    AppUser,
} from "@/api/appUser";
import { getAllAppRoles, AppRole } from "@/api/appRole";
import { NaFormInputItem } from "@/components/NaForm";
import NaPageHeader from "@/components/NaPageHeader.vue";
import useNaTable from "@/components/NaTable/useNaTable";
import { Message, type FormInstance } from "@arco-design/web-vue";
import { cloneDeep } from "es-toolkit";
import { computed, reactive, ref, unref } from "vue";
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
    name: "AppUser",
});

const { NaTableComponent: NaTable, NaTableRef } = useNaTable();

// 角色列表选项
let roleListOptions = ref<AppRole[]>([]);

// 用户模态框类型枚举
enum UserModalType {
    ADD = 1,
    EDIT = 2,
    DETAIL = 3,
}

// 表格列配置
const cols = [
    {
        dataIndex: "id",
        title: "ID",
        width: 70,
        align: "center",
        fixed: "left",
    },
    {
        dataIndex: "username",
        title: "用户名",
        width: 150,
        fixed: "left",
        align: "center",
    },
    {
        dataIndex: "email",
        title: "邮箱",
        width: 200,
        align: "center",
    },
    {
        dataIndex: "phone",
        title: "手机号",
        width: 150,
        align: "center",
    },
    {
        dataIndex: "nickname",
        title: "昵称",
        width: 120,
        align: "center",
    },
    {
        dataIndex: "avatar",
        title: "头像",
        width: 80,
        align: "center",
        slotName: "avatar",
    },
    {
        dataIndex: "status",
        title: "状态",
        width: 100,
        align: "center",
        slotName: "status",
    },
    {
        dataIndex: "created_at",
        title: "创建时间",
        width: 180,
        align: "center",
    },
    {
        slotName: "action",
        title: "操作",
        width: 220,
        align: "center",
        fixed: "right",
    },
];

// 表格过滤表单数据
let searchFormData = ref<any>({
    username: "",
    email: "",
    phone: "",
    status: undefined,
});

const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const userTablePinColumns = ["id", "status", "action"];

// 当前模态框状态
let currentUserModalType = ref(UserModalType.ADD);
// 是否显示用户详情模态弹窗
let showUserDetailModal = ref(false);

// 重置密码相关
let showResetPasswordModal = ref(false);
let currentResetUserId = ref<number | null>(null);
let resetPasswordForm = ref({
    password: "",
    confirmPassword: "",
});
const resetPasswordFormRef = ref<FormInstance>();

// 计算用户表单属性
let computedUserFormProps = computed(() => {
    if (currentUserModalType.value === UserModalType.DETAIL) {
        return { ...UserFormProps, disabled: true };
    }
    return UserFormProps;
});

// 用户详情表单输入项配置
const UserFormInputItems = computed(() => {
    let inputItem: NaFormInputItem[] = [];
    switch (currentUserModalType.value) {
        case UserModalType.ADD:
            inputItem = UserFormInputItemsUserAdd;
            break;
        case UserModalType.DETAIL:
            inputItem = UserFormInputItemsUserDetail;
            break;
        case UserModalType.EDIT:
            inputItem = UserFormInputItemsUserEdit;
            break;
        default:
            inputItem = UserFormInputItemsUserAdd;
    }
    // 为角色字段添加选项
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

// 用户列表数据
const tableData = ref<any>([]);

// 用户表单初始数据
const userFormDataUserAddInit = {
    username: "",
    status: AppUserStatus.ENABLE,
    password: "",
    nickname: null,
    phone: null,
    email: null,
    avatar: null,
    roles: [],
};

// 模态框用户详情表单数据
let userFormData = ref<CreateAppUserDto | UpdateAppUserDto | AppUser>({
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

// 重置搜索表单
const handleReset = () => {
    searchFormData.value = {
        username: "",
        email: "",
        phone: "",
        status: undefined,
    };
    NaTableRef.value?.NaTableContext.NaTableMethods.resetFilterForm();
};

// 提交搜索表单
const handleSubmit = () => {
    NaTableRef.value?.NaTableContext.NaTableMethods.filterFormSubmit();
};

// 创建用户弹窗
function onOpenCreateUser() {
    currentUserModalType.value = UserModalType.ADD;
    showUserDetailModal.value = true;
    userFormData.value = cloneDeep(userFormDataUserAddInit);
}

// 查看用户详情弹窗
const onOpenUserDetail = (record: any) => {
    let _record: any = cloneDeep(record);
    // 处理角色数据
    if (_record.roles && Array.isArray(_record.roles)) {
        _record.roles = _record.roles.map((role: any) => 
            typeof role === 'object' ? role.role_id || role.id : role
        );
    }
    currentUserModalType.value = UserModalType.DETAIL;
    showUserDetailModal.value = true;
    userFormData.value = _record;
};

// 编辑用户弹窗
const onOpenEditUser = (record: any) => {
    let _record: any = cloneDeep(record);
    // 处理角色数据
    if (_record.roles && Array.isArray(_record.roles)) {
        _record.roles = _record.roles.map((role: any) => 
            typeof role === 'object' ? role.role_id || role.id : role
        );
    }
    userFormData.value = _record;
    currentUserModalType.value = UserModalType.EDIT;
    showUserDetailModal.value = true;
};

// 用户表单提交
async function onUserFormModalBeforeOk() {
    try {
        if (currentUserModalType.value === UserModalType.ADD) {
            await createAppUser(unref(userFormData.value) as CreateAppUserDto);
            Message.success("创建成功");
        }
        if (currentUserModalType.value === UserModalType.DETAIL) {
            return true;
        }
        if (currentUserModalType.value === UserModalType.EDIT) {
            const data = unref(userFormData.value) as UpdateAppUserDto;
            await updateAppUser(data);
            Message.success("更新成功");
        }
        refreshTable();
        return true;
    } catch (error) {
        Message.error("操作失败");
        return false;
    }
}

// 删除用户
const deleteUser = async (record: any) => {
    try {
        await deleteAppUser(record.id);
        Message.success("删除成功");
        refreshTable();
    } catch (error) {
        Message.error("删除失败");
    }
};

// 打开重置密码弹窗
const onOpenResetPassword = (record: any) => {
    currentResetUserId.value = record.id;
    resetPasswordForm.value = {
        password: "",
        confirmPassword: "",
    };
    showResetPasswordModal.value = true;
};

// 验证确认密码
const validateConfirmPassword = (value: string, callback: (error?: string) => void) => {
    if (value !== resetPasswordForm.value.password) {
        callback("两次输入的密码不一致");
    } else {
        callback();
    }
};

// 重置密码提交
async function onResetPasswordBeforeOk() {
    try {
        const valid = await resetPasswordFormRef.value?.validate();
        if (valid) {
            return false;
        }
        if (currentResetUserId.value) {
            await resetAppUserPassword(currentResetUserId.value, resetPasswordForm.value.password);
            Message.success("密码重置成功");
        }
        return true;
    } catch (error) {
        Message.error("密码重置失败");
        return false;
    }
}

// 取消重置密码弹窗
const handleResetPasswordCancel = () => {
    showResetPasswordModal.value = false;
    resetPasswordForm.value = {
        password: "",
        confirmPassword: "",
    };
    currentResetUserId.value = null;
};

// 弹窗取消
const handleCancel = () => {
    showUserDetailModal.value = false;
    formRef.value?.resetFields();
    userFormData.value = cloneDeep(userFormDataUserAddInit);
};

// 刷新表格
function refreshTable() {
    NaTableRef.value?.NaTableContext.NaTableMethods.getTableData();
}

// 加载角色列表
async function loadRoleList() {
    try {
        const res = await getAllAppRoles();
        roleListOptions.value = res.data || [];
    } catch (error) {
        console.error("加载角色列表失败", error);
    }
}

// 初始化
loadRoleList();
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
