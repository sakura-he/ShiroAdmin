import { NaFormInputItem } from "@/components/NaForm";

// 表格过滤表单项配置
export const SearchInputItems: NaFormInputItem[] = [
    {
        field: "username",
        label: "用户名",
        type: "input",
        formInputProps: {
            placeholder: "请输入用户名",
            clearable: true,
        },
    },
    {
        field: "email",
        label: "邮箱",
        type: "input",
        formInputProps: {
            placeholder: "请输入邮箱",
            clearable: true,
        },
    },
    {
        field: "phone",
        label: "手机号",
        type: "input",
        formInputProps: {
            placeholder: "请输入手机号",
            clearable: true,
        },
    },
    {
        field: "status",
        label: "状态",
        type: "select",
        formInputProps: {
            placeholder: "请选择状态",
            allowClear: true,
            options: [
                { label: "启用", value: 1 },
                { label: "禁用", value: 0 },
            ],
        },
    },
];

// 搜索表单列配置
export const SearchFormColProps = {
    span: 6,
};

// 搜索表单标签配置
export const SearchFormLabelProps = {
    showColon: true,
};

// 搜索表单配置
export const SearchFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};

// 搜索表单按钮列配置
export const SearchFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};

export default {
    SearchInputItems,
    SearchFormProps,
    SearchFormColProps,
    SearchFormLabelProps,
    SearchFormBtnColProps,
};
