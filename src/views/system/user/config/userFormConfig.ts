import { NaFormInputItem, NaFormInputProps } from "@/components/NaForm/type";

export const id: NaFormInputItem = {
    label: "用户ID",
    field: "id",
    type: "input",
    colProps: {
        span: 12,
    },
};
const nickname: NaFormInputItem = {
    label: "用户名称",
    field: "nickname",
    type: "input",
    formInputProps: {
        placeholder: "请输入用户昵称",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const username: NaFormInputItem = {
    label: "用户名",
    field: "username",
    type: "input",
    formInputProps: {
        placeholder: "请输入用户名",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};

const password: NaFormInputItem = {
    label: "密码",
    field: "password",
    type: "input",
    formInputProps: {
        placeholder: "请输入密码",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const email: NaFormInputItem = {
    label: "绑定邮箱",
    field: "email",
    type: "input",
    formInputProps: {
        placeholder: "请输入绑定邮箱",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const phone: NaFormInputItem = {
    label: "手机号",
    field: "phone",
    type: "input",
    formInputProps: {
        placeholder: "请输入绑定手机号",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const remark: NaFormInputItem = {
    label: "用户描述",
    field: "remark",
    type: "textarea",
    formInputProps: {
        autoSize: true,
        placeholder: "请输入用户备注",
        clearable: true,
        showWordLimit: true,
        maxLength: 300,
    },
};

const status: NaFormInputItem = {
    label: "状态",
    field: "status",
    type: "switch",
    formInputProps: {
        placeholder: "请选择状态",
        // 自定义状态
        checkedValue: 1,
        checkedText: "启用",
        uncheckedText: "禁用",
        uncheckedValue: 2,
    } as NaFormInputProps,
};
const is_lock: NaFormInputItem = {
    label: "锁定状态",
    field: "is_lock",
    type: "switch",
    formInputProps: {
        placeholder: "锁定状态",

        // 自定义状态
        checkedValue: true,
        checkedText: "锁定",
        uncheckedText: "正常",
        uncheckedValue: false,
    },
};
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
    },
};
export const updated_at: NaFormInputItem = {
    label: "更新时间",
    field: "updated_at",
    type: "date-picker",
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "请选择更新时间",
        valueFormat: "Date",
    },
    colProps: {
        span: 12,
    },
};
export const last_login: NaFormInputItem = {
    label: "最后登录时间",
    field: "last_login",
    type: "date-picker",
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "最后登录时间",
        valueFormat: "Date",
    },
    colProps: {
        span: 12,
    },
};
export const roles :NaFormInputItem = {
    label: "角色",
    field: "roles",
    type: "select",
    formInputProps: {
        placeholder:'请选择角色',
        multiple:true,
        allowClear:false
    },
    colProps: {
        span: 24,
    },
}
export const UserFormInputItemsUserAdd: NaFormInputItem[] = [
    username,
    nickname,
    password,
    email,
    phone,
    remark,
    status,
    is_lock,
    roles
];
export const UserFormInputItemsUserEdit: NaFormInputItem[] = [
    username,
    nickname,
    password,
    email,
    phone,
    remark,
    status,
    is_lock,
    roles
];
export const UserFormInputItemsUserDetail: NaFormInputItem[] = [
    id,
    username,
    nickname,
    email,
    phone,
    remark,
    status,
    is_lock,
    created_at,
    updated_at,
    last_login,
    roles
];

// 角色详情表单标签配置
export const UserFormLabelProps = {
    showColon: true,

    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};
export const UserFormColProps = {
    span: 12,
};
// 角色详情表单配置
export const UserFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
    disabled:false,
};
// 角色详情表单行配置
export const UserFormRowProps = {
    gutter: 12,
};
// 角色详情表单按钮列配置
export const UserFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: false,
};
 