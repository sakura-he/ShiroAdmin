import { NaFormInputItem, NaFormInputProps } from "@/components/NaForm/type";

// 用户ID
export const id: NaFormInputItem = {
    label: "用户ID",
    field: "id",
    type: "input",
    colProps: {
        span: 12,
    },
    formInputProps: {
        disabled: true,
    } as NaFormInputProps,
};

// 用户名
const username: NaFormInputItem = {
    label: "用户名",
    field: "username",
    type: "input",
    formInputProps: {
        placeholder: "请输入用户名",
        clearable: true,
        showWordLimit: true,
        maxLength: 50,
    } as NaFormInputProps,
};

// 密码
const password: NaFormInputItem = {
    label: "密码",
    field: "password",
    type: "input",
    formInputProps: {
        placeholder: "请输入密码",
        clearable: true,
        showWordLimit: true,
        maxLength: 100,
        type: "password",
    } as NaFormInputProps,
};

// 邮箱
const email: NaFormInputItem = {
    label: "邮箱",
    field: "email",
    type: "input",
    formInputProps: {
        placeholder: "请输入邮箱",
        clearable: true,
        showWordLimit: true,
        maxLength: 100,
    } as NaFormInputProps,
};

// 手机号
const phone: NaFormInputItem = {
    label: "手机号",
    field: "phone",
    type: "input",
    formInputProps: {
        placeholder: "请输入手机号",
        clearable: true,
        showWordLimit: true,
        maxLength: 20,
    } as NaFormInputProps,
};


// 昵称
const nickname: NaFormInputItem = {
    label: "昵称",
    field: "nickname",
    type: "input",
    formInputProps: {
        placeholder: "请输入昵称",
        clearable: true,
        showWordLimit: true,
        maxLength: 50,
    } as NaFormInputProps,
};

// 头像
const avatar: NaFormInputItem = {
    label: "头像",
    field: "avatar",
    type: "input",
    formInputProps: {
        placeholder: "请输入头像URL",
        clearable: true,
        showWordLimit: true,
        maxLength: 255,
    } as NaFormInputProps,
};

// 状态
const status: NaFormInputItem = {
    label: "状态",
    field: "status",
    type: "switch",
    formInputProps: {
        placeholder: "请选择状态",
        checkedValue: 1,
        checkedText: "启用",
        uncheckedText: "禁用",
        uncheckedValue: 0,
    } as NaFormInputProps,
};

// 角色
export const roles: NaFormInputItem = {
    label: "角色",
    field: "roles",
    type: "select",
    formInputProps: {
        placeholder: "请选择角色",
        multiple: true,
        allowClear: true,
    } as NaFormInputProps,
    colProps: {
        span: 24,
    },
};

// 创建时间
export const created_at: NaFormInputItem = {
    label: "创建时间",
    field: "created_at",
    type: "date-picker",
    colProps: {
        span: 12,
    },
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "请选择创建时间",
        valueFormat: "Date",
        disabled: true,
    } as NaFormInputProps,
};

// 更新时间
export const updated_at: NaFormInputItem = {
    label: "更新时间",
    field: "updated_at",
    type: "date-picker",
    colProps: {
        span: 12,
    },
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "请选择更新时间",
        valueFormat: "Date",
        disabled: true,
    } as NaFormInputProps,
};


// 新增用户表单项
export const UserFormInputItemsUserAdd: NaFormInputItem[] = [
    username,
    password,
    email,
    phone,
    nickname,
    avatar,
    status,
    roles,
];

// 编辑用户表单项
export const UserFormInputItemsUserEdit: NaFormInputItem[] = [
    username,
    email,
    phone,
    nickname,
    avatar,
    status,
    roles,
];

// 用户详情表单项
export const UserFormInputItemsUserDetail: NaFormInputItem[] = [
    id,
    username,
    email,
    phone,
    nickname,
    avatar,
    status,
    created_at,
    updated_at,
    roles,
];

// 表单标签配置
export const UserFormLabelProps = {
    showColon: true,
    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};

// 表单列配置
export const UserFormColProps = {
    span: 12,
};

// 表单配置
export const UserFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
    disabled: false,
};

// 表单行配置
export const UserFormRowProps = {
    gutter: 12,
};

// 表单按钮列配置
export const UserFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: false,
};
