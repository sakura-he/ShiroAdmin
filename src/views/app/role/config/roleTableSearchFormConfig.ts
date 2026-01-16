import { NaFormInputItem } from "@/components/NaForm";
import { AppRoleStatus } from "@/api/appRole";

// 搜索表单项配置
const SearchInputItems: NaFormInputItem[] = [
    {
        field: "name",
        label: "角色名称",
        type: "input",
        formInputProps: {
            placeholder: "请输入角色名称",
            allowClear: true,
        },
    },
    {
        field: "code",
        label: "角色代码",
        type: "input",
        formInputProps: {
            placeholder: "请输入角色代码",
            allowClear: true,
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
                { label: "启用", value: AppRoleStatus.ENABLE },
                { label: "禁用", value: AppRoleStatus.DISABLE },
            ],
        },
    },
];

// 搜索表单列配置
const SearchFormColProps = {
    span: 8,
};

// 搜索表单标签配置
const SearchFormLabelProps = {
    showColon: true,
};

// 搜索表单配置
const SearchFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};

// 搜索表单按钮列配置
const SearchFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};

export default {
    SearchInputItems,
    SearchFormColProps,
    SearchFormLabelProps,
    SearchFormProps,
    SearchFormBtnColProps,
};
