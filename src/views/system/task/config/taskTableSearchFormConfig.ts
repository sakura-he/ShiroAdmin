import { NaFormInputItem } from "@/components/NaForm";

// 表格过滤表单项配置
const taskTableSearchInputItems: NaFormInputItem[] = [
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

const taskTableSearchFormColProps = {
    span: 8,
};
const taskTableSearchFormLabelProps = {
    showColon: true,
};

const taskTableSearchFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};
export default {
    taskTableSearchInputItems,

    taskTableSearchFormColProps,
    taskTableSearchFormLabelProps,
    taskTableSearchFormBtnColProps,
};
