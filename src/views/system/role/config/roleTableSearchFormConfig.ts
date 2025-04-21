import { NaFormInputItem } from "@/components/NaForm";

// 表格过滤表单项配置
const roleTableSearchInputItems: NaFormInputItem[] = [
    {
        field: "name",
        label: "角色名称",
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
    },
];

const roleTableSearchFormColProps = {
    span: 8,
};
const roleTableSearchFormLabelProps = {
    showColon: true,
};

const roleTableSearchFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};
export default {
    roleTableSearchInputItems,

    roleTableSearchFormColProps,
    roleTableSearchFormLabelProps,
    roleTableSearchFormBtnColProps,
};
