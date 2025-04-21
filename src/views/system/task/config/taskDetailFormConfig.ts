import { NaFormInputItem } from "@/components/NaForm";

enum TaskStatus {
    DISABLE = "DISABLE",
    ENABLE = "ENABLE",
}

enum TaskStrategy {
    AUTO = "AUTO",
    MANUAL = "MANUAL",
    ONCE_AND_AUTO = "ONCE_AND_AUTO",
}

interface TaskForm {
    cron: string;
    handler: string;
    id?: string;
    name: string;
    options: string;
    params: string;
    remark: string;
    status: TaskStatus;
    strategy: TaskStrategy;
}
enum TaskModalType {
    CREATE = 1, // 新建任务
    MODIFY, // 修改任务
    DETAIL, // 查看任务详情
}
let taskModalType = ref(TaskModalType.CREATE);
const taskDetailFormColProps = {
    span: 12,
};
// 模态框公有的任务详情表单项配置(也是创建任务表单项配置)
const taskFormPublicInputItems: NaFormInputItem[] = [
    {
        field: "name",
        label: "任务名称",
        type: "input",
        formInputProps: {
            maxLength: 40,
        },
    },
    {
        field: "cron",
        label: "CRON表达式",
        type: "input",
    },
    {
        field: "remark",
        label: "任务说明",
        type: "textarea",
        formInputProps: {
            maxLength: 40,
        },
    },
    {
        field: "options",
        label: "执行选项",
        type: "input",
        formInputProps: {
            maxLength: 3000,
        },
    },
    {
        field: "params",
        label: "执行参数",
        type: "input",
        formInputProps: {
            maxLength: 400,
        },
    },
    {
        field: "handler",
        label: "Handler",
        type: "input",
        formInputProps: {
            maxLength: 200,
        },
    },
    {
        field: "strategy",
        formInputProps: {},
        label: "执行策略",
        type: "select",
    },
    {
        field: "status",
        formInputProps: {
            checkedValue: TaskStatus.ENABLE,
            uncheckedValue: TaskStatus.DISABLE,
        },
        label: "状态",
        type: "switch",
    },
];
// 任务详情表单项配置
const taskFormDetailInputItems: NaFormInputItem[] = [
    {
        field: "id",
        label: "任务ID",
        type: "input",
    },
    ...taskFormPublicInputItems,

    {
        field: "created_at",
        label: "创建时间",
        type: "input",
    },
    {
        field: "updated_at",
        label: "更新时间",
        type: "input",
    },
    {
        field: "lastRunAt",
        label: "最后运行时间",
        type: "input",
    },
];
// 任务详情编辑表单项配置
const taskFormEditInputItems: NaFormInputItem[] = [
    {
        field: "id",
        label: "任务ID",
        type: "input",
        formInputProps: {
            disabled: true,
        },
    },
    ...taskFormPublicInputItems,

    {
        field: "created_at",
        label: "创建时间",
        type: "input",
        formInputProps: {
            disabled: true,
        },
    },
    {
        field: "updated_at",
        label: "更新时间",
        type: "input",
        formInputProps: {
            disabled: true,
        },
    },
    {
        field: "lastRunAt",
        label: "最后运行时间",
        type: "input",
        formInputProps: {
            disabled: true,
        },
    },
];

// 任务详情表单标签配置
const taskDetailFormLabelProps = {
    showColon: true,
    disabled: taskModalType.value === TaskModalType.DETAIL,
    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};
// 任务详情表单配置
const taskDetailFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};
// 任务详情表单行配置
const taskDetailFormRowProps = {
    gutter: 12,
};
// 任务详情表单按钮列配置
const taskFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: false,
};
export default {
    taskFormPublicInputItems,
    taskFormDetailInputItems,
    taskFormEditInputItems,
    taskDetailFormLabelProps,
    taskDetailFormProps,
    taskDetailFormRowProps,
    taskFormBtnColProps,
    taskModalType,
    TaskStatus,
    TaskStrategy,
    TaskModalType,
    taskDetailFormColProps,
};
