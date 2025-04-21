import { NaFormInputItem } from "@/components/NaForm";

// 表格过滤表单项配置
export const SearchInputItems: NaFormInputItem[] = [
    {
        field: "name",
        label: "任务名称",
        type: "input",
    },
    {
        field: "status",
        label: "状态",
        type: "select",
        formInputProps: {
            options: [],
        },
    },
    {
        field: "created_at",
        label: "创建时间",
        type: "date-picker",

        colProps: {
            span: 12,
        },
    },
];

export const SearchFormColProps = {
    span: 8,
};
export const SearchFormLabelProps = {
    showColon: true,
};

export const SearchFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};
// 角色详情表单配置
export const SearchFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};
export default {
    SearchInputItems,
    SearchFormProps,
    SearchFormColProps,
    SearchFormLabelProps,
    SearchFormBtnColProps,
};

