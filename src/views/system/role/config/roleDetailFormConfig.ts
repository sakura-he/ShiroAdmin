import { NaFormInputItem } from "@/components/NaForm";

enum RoleStatus {
    DISABLE = "DISABLE",
    ENABLE = "ENABLE",
}

const RoleDetailFormColProps = {
    span: 12,
};
export const id = {
    field: "id",
    label: "角色ID",
    type: "input",
};
export const created_at = {
    field: "created_at",
    label: "创建时间",
    type: "input",
};
export const updated_at = {
    field: "updated_at",
    label: "更新时间",
    type: "input",
};
export const name = {
    field: "name",
    label: "角色名称",
    type: "input",
    formInputProps: {
        maxLength: 40,
    },
} as NaFormInputItem;
export const code = {
    field: "code",
    label: "角色代码",
    type: "input",
    formInputProps: {
        maxLength: 40,
    },
} as NaFormInputItem;
export const description = {
    field: "description",
    label: "备注",
    type: "textarea",
    formInputProps: {
        maxLength: 40,
    },
} as NaFormInputItem;
export const status = {
    field: "status",
    formInputProps: {
        checkedValue: RoleStatus.ENABLE,
        uncheckedValue: RoleStatus.DISABLE,
    },
    label: "状态",
    type: "switch",
};

// 角色详情表单项配置
const RoleFormDetailInputItems: NaFormInputItem[] = [
    id,
    name,
    code,
    description,
    status,
    created_at,
    updated_at,
];
// 角色详情编辑表单项配置
const RoleFormEditInputItems: NaFormInputItem[] = [id, name, code, description, status];
const RoleFormAddInputItems: NaFormInputItem[] = [name, code, description, status];
// 角色详情表单标签配置
const RoleDetailFormLabelProps = {
    showColon: true,
    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};
// 角色详情表单配置
const RoleDetailFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};
// 角色详情表单行配置
const RoleDetailFormRowProps = {
    gutter: 12,
};
// 角色详情表单按钮列配置
const RoleFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: false,
};
export default {
    RoleFormAddInputItems,
    RoleFormDetailInputItems,
    RoleFormEditInputItems,
    RoleDetailFormLabelProps,
    RoleDetailFormProps,
    RoleDetailFormRowProps,
    RoleFormBtnColProps,
    RoleStatus,
    RoleDetailFormColProps,
};
