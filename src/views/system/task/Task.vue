<template>
    <div class="page tw-flex tw-flex-col">
        <a-modal
            v-model:visible="showTaskDetailModal"
            v-model="taskDetailFormData"
            @cancel="handleCancel"
            @ok="handleOk"
            width="50%"
        >
            <template #title>{{ getTaskDetailModalTitle }}</template>
            <div>
                <NaForm
                    v-model="taskDetailFormData"
                    :default-form-action-button-col-props="taskFormBtnColProps"
                    :default-form-col-props="taskDetailFormColProps"
                    :form-input-items="taskFormInputItems"
                    :default-form-label-props="taskDetailFormLabelProps"
                    :form-props="taskDetailFormProps"
                    :default-form-row-props="taskDetailFormRowProps"
                    ref="formRef"
                />
            </div>
        </a-modal>
        <NaPageHeader
            :show-back="false"
            full
            class="tw-mb-4 tw-flex-none"
        >
            <template v-slot:title>任务管理</template>
            <template v-slot:subtitle>测试</template>
        </NaPageHeader>
        <main class="tw-flex-none">
            <div class="!tw-rounded tw-overflow-hidden tw-bg-cbg-1 tw-p-4">
                <!-- 表格筛选表单 -->
                <NaTable
                    title="任务列表"
                    :columns="cols"
                    :data="tableData"
                    :pin-columns="taskTablePinColumns"
                    :scroll="{ x: '100%', y: '100%', minWidth: 2000 }"
                    :scrollbar="true"
                    size="small"
                    :stripe="true"
                    :is-bordered="true"
                    :request-table-data-fn="getTaskList"
                    :filter-value="taskTableSearchModelValue"
                    :is-enable-pagination="true"
                    :is-show-filter="true"
                    :is-enable-filter="true"
                >
                    <template #leftToolBar>
                        <a-button
                            type="primary"
                            size="small"
                            @click="createTask"
                        >
                            <template v-slot:icon>
                                <icon-plus class="tw-text-[16px]" />
                            </template>
                            <template #default>创建新任务</template>
                        </a-button>
                        <a-button size="small">
                            <template v-slot:icon>
                                <icon-download class="tw-text-[16px]" />
                            </template>
                            <template #default>导出任务列表</template>
                        </a-button>
                    </template>
                    <!-- 表格过滤表单 -->
                    <template #filterForm>
                        <NaForm
                            v-model="taskTableSearchModelValue"
                            :default-form-action-button-col-props="taskTableSearchFormBtnColProps"
                            :default-form-col-props="taskTableSearchFormColProps"
                            :form-input-items="taskTableSearchInputItems"
                            :default-form-label-props="taskTableSearchFormLabelProps"
                            :form-props="taskDetailFormProps"
                            ref="formRef"
                            @action-reset="handleReset"
                            @action-submit="handleSubmit"
                        >
                            <template #created_at>
                                <a-range-picker
                                    v-model="taskTableSearchModelValue.created_at"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    show-time
                                    :disable-confirm="true"
                                    class="tw-flex-1"
                                    :time-picker-props="{
                                        defaultValue: ['00:00:00', '00:00:00'],
                                    }"
                                />
                            </template>
                        </NaForm>
                    </template>
                    <!-- 状态 -->
                    <template #status="{ record }">
                        <a-switch
                            v-bind="swtich"
                            v-model="record.status"
                            :beforeChange=" (newValue: any)=>  updateTaskStatus(record,newValue)"
                        />
                    </template>
                    <!-- 操作按钮 -->
                    <template #action="{ record }">
                        <a-button-group
                            size="mini"
                            type="secondary"
                        >
                            <a-space
                                wrap
                                size="mini"
                            >
                                <a-button
                                    type="primary"
                                    @click="editTask(record)"
                                >
                                    修改
                                </a-button>
                                <a-button @click="showTaskDetail(record)">任务详情</a-button>

                                <a-button @click="runTask(record)">
                                    <template #icon>
                                        <icon-play-arrow />
                                    </template>
                                    <template #default>运行一次</template>
                                </a-button>

                                <a-popconfirm
                                    content="确定要删除该任务吗?"
                                    @ok="deleteTask(record)"
                                >
                                    <a-button
                                        status="danger"
                                        type="primary"
                                    >
                                        删除
                                    </a-button>
                                </a-popconfirm>
                            </a-space>
                        </a-button-group>
                    </template>
                </NaTable>
                <!-- 表格 -->
            </div>
        </main>
    </div>
</template>

<script setup lang="tsx">
    import type { FormInstance, SelectInstance } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";

    import {
    createTask as createTaskApi,
    deleteTask as deleteTaskApi,
    getTaskList,
    getTaskStatusOption,
    getTaskStrategyOption,
    runTaskOnce,
    TaskForm,
    updateTask as updateTaskApi,
    updateTaskStatusApi,
} from "@/api/task";
import { NaFormInputItem } from "@/components/NaForm/type";
import NaPageHeader from "@/components/NaPageHeader.vue";
import useNaTable from "@/components/NaTable/useNaTable";
import { computed, reactive, ref } from "vue";
import taskDetailFormConfig from "./config/taskDetailFormConfig";
import taskTableSearchFormConfig from "./config/taskTableSearchFormConfig";
    defineOptions({
        name: "Task",
    });
    const { NaTableComponent: NaTable, NaTableRef } = useNaTable();

    onCreated();

    enum TaskStatus {
        DISABLE = "DISABLE",
        ENABLE = "ENABLE",
    }

    enum TaskStrategy {
        AUTO = "AUTO",
        MANUAL = "MANUAL",
        ONCE_AND_AUTO = "ONCE_AND_AUTO",
    }

    enum TaskModalType {
        CREATE = 1, // 新建任务
        MODIFY, // 修改任务
        DETAIL, // 查看任务详情
    }
    const cols = [
        {
            dataIndex: "id",
            title: "id",
            width: "70",
            align: "center",
            fixed: "left",
        },
        {
            dataIndex: "name",
            title: "任务名称",
            width: 200,
            fixed: "left",
        },
        {
            dataIndex: "cron",
            title: "CRON表达式",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "remark",
            title: "任务说明",
            width: 200,
        },
        {
            dataIndex: "options",
            title: "执行选项",
        },
        {
            dataIndex: "params",
            title: "执行参数",
        },
        {
            dataIndex: "handler",
            title: "Handler",
            width: 400,
            align: "center",
        },
        {
            dataIndex: "status",
            slotName: "status",
            title: "状态",
            width: 100,
        },
        {
            dataIndex: "strategy",
            title: "策略",
        },
        {
            dataIndex: "created_at",
            title: "创建时间",
            width: 150,
        },
        {
            dataIndex: "updated_at",
            title: "更新时间",
            width: 150,
        },
        {
            slotName: "action",
            title: "操作",
            width: 320,
            fixed: "right",
        },
    ];
    // 表格过滤表单项配置
    // 表格过滤表单数据
    let taskTableSearchModelValue = ref({
        name: "",
        status: "",
        strategy: "",
        created_at: [],
    });
    const taskTableSearchInputItems = ref<NaFormInputItem[]>(
        taskTableSearchFormConfig.taskTableSearchInputItems
    );
    const taskTableSearchFormColProps = ref(taskTableSearchFormConfig.taskTableSearchFormColProps);
    const taskTableSearchFormLabelProps = ref(
        taskTableSearchFormConfig.taskTableSearchFormLabelProps
    );
    const taskTableSearchFormBtnColProps = ref(
        taskTableSearchFormConfig.taskTableSearchFormBtnColProps
    );
    const formRef = ref<FormInstance>();
    const taskTablePinColumns = ["id", "status", "action"];
    let swtich = ref({
        checkedValue: "",
        uncheckedValue: "",
        checkedText: "",
        uncheckedText: "",
    });

    // 当前模态框状态
    let taskModalType = ref(TaskModalType.CREATE);
    // 是否显示模态弹窗
    let showTaskDetailModal = ref(false);
    const taskDetailFormColProps = taskDetailFormConfig.taskDetailFormColProps;
    // 模态框公有的任务详情表单项配置(也是创建任务表单项配置)
    const taskFormPublicInputItems = ref<NaFormInputItem[]>(
        taskDetailFormConfig.taskFormPublicInputItems
    );
    // 任务详情表单项配置
    const taskFormDetailInputItems = ref<NaFormInputItem[]>(
        taskDetailFormConfig.taskFormDetailInputItems
    );
    // 任务详情编辑表单项配置
    const taskFormEditInputItems = ref<NaFormInputItem[]>(
        taskDetailFormConfig.taskFormEditInputItems
    );
    // 任务详情表单输入项
    const taskFormInputItems = computed(() => {
        switch (taskModalType.value) {
            case TaskModalType.CREATE:
                return taskFormPublicInputItems.value;
            case TaskModalType.DETAIL:
                return taskFormDetailInputItems.value;
            case TaskModalType.MODIFY:
                return taskFormEditInputItems.value;
            default:
                return [];
        }
    });

    // 任务详情表单标签配置
    const taskDetailFormLabelProps = ref(taskDetailFormConfig.taskDetailFormLabelProps);
    // 任务详情表单配置
    const taskDetailFormProps = ref(taskDetailFormConfig.taskDetailFormProps);
    // 任务详情表单行配置
    const taskDetailFormRowProps = ref(taskDetailFormConfig.taskDetailFormRowProps);
    // 任务详情表单按钮列配置
    const taskFormBtnColProps = ref(taskDetailFormConfig.taskFormBtnColProps);

    // 表格配置
    const tableConfig = reactive({
        page: 1,
        pageSize: 10,
        stripe: false,
    });
    const handleReset = () => {
        taskTableSearchModelValue.value = {
            name: "",
            status: "",
            strategy: "",
            created_at: [],
        };
        NaTableRef.value?.NaTableContext.NaTableMethods.resetFilterForm();
    };
    const handleSubmit = () => {
        NaTableRef.value?.NaTableContext.NaTableMethods.filterFormSubmit();
    };

    // 任务列表数据
    const tableData = ref<any>([]);

    // 模态框任务详情表单数据
    let taskDetailFormData = ref<TaskForm>({} as TaskForm);
    // 模态框标题
    const getTaskDetailModalTitle = computed(() => {
        switch (taskModalType.value) {
            case TaskModalType.CREATE:
                return "创建任务";
            case TaskModalType.MODIFY:
                return "修改任务";
            case TaskModalType.DETAIL:
                return "任务详情";
            default:
                return "";
        }
    });
    // 创建任务
    function createTask() {
        taskModalType.value = TaskModalType.CREATE;
        taskDetailFormLabelProps.value.disabled = false;
        showTaskDetailModal.value = true;
        taskDetailFormData.value = {
            cron: undefined,
            handler: undefined,
            name: undefined,
            options: undefined,
            params: undefined,
            remark: undefined,
            status: swtich.value.checkedValue,
            strategy: undefined,
        };
    }
    // 查看任务详情
    const showTaskDetail = (record: any) => {
        taskModalType.value = TaskModalType.DETAIL;
        taskDetailFormLabelProps.value.disabled = true;
        showTaskDetailModal.value = true;
        taskDetailFormData.value = {
            cron: record.cron,
            handler: record.handler,
            name: record.name,
            options: record.options,
            params: record.params,
            remark: record.remark,
            status: record.status,
            strategy: record.strategy,
            id: record.id,
            created_at: record.created_at,
            updated_at: record.updated_at,
            lastRunAt: record.lastRunAt,
        };
    };

    // 编辑任务
    const editTask = (record: any) => {
        taskModalType.value = TaskModalType.MODIFY;
        taskDetailFormLabelProps.value.disabled = false;
        showTaskDetailModal.value = true;
        taskDetailFormData.value = {
            cron: record.cron,
            handler: record.handler,
            name: record.name,
            options: record.options,
            params: record.params,
            remark: record.remark,
            status: record.status,
            strategy: record.strategy,
            id: record.id,
            created_at: record.created_at,
            updated_at: record.updated_at,
            lastRunAt: record.lastRunAt,
        };
    };
    // 删除任务
    const deleteTask = async (record: any) => {
        try {
            await deleteTaskApi(record.id);
            Message.success("删除成功");
            refreshTable();
        } catch (error) {
            Message.error("删除失败");
        }
    };

    // 弹窗取消
    const handleCancel = () => {
        showTaskDetailModal.value = false;
        formRef.value?.resetFields();
        // 重置表单数据
        Object.assign(taskDetailFormData, {
            cron: undefined,
            handler: undefined,
            id: undefined,
            name: undefined,
            options: undefined,
            params: undefined,
            remark: undefined,
            status: TaskStatus.ENABLE,
            strategy: TaskStrategy.AUTO,
        });
    };
    // 弹窗确认
    const handleOk = async () => {
        try {
            if (taskModalType.value === TaskModalType.MODIFY) {
                let data = { ...taskDetailFormData.value };
                const props = Object.keys(data);
                props.forEach((key) => {
                    if (data[key] === "") {
                        data[key] = JSON.stringify(null);
                    }
                });
                await updateTaskApi(data);
                Message.success("更新成功");
            } else if (taskModalType.value === TaskModalType.CREATE) {
                let data = { ...taskDetailFormData.value };
                const props = Object.keys(data);
                props.forEach((key) => {
                    if (data[key] === "") {
                        data[key] = JSON.stringify(null);
                    }
                });
                await createTaskApi(data);
                Message.success("创建成功");
            }
            showTaskDetailModal.value = false;
            refreshTable();
        } catch (error) {
            Message.error("操作失败");
        }
    };

    function refreshTable() {
        NaTableRef.value?.NaTableContext.NaTableMethods.getTableData();
    }

    // 运行任务
    const runTask = async (record: any) => {
        try {
            await runTaskOnce(record.id);
            Message.success("任务执行成功");
        } catch (error) {
            Message.error("任务执行失败");
        }
    };

    // 切换任务运行状态
    async function updateTaskStatus(record: any, newValue: any) {
        try {
            await updateTaskStatusApi({ id: record.id, status: newValue });
            Message.success("更新成功");
            return true;
        } catch (error) {
            Message.error("更新失败");
            throw error;
        }
    }
    function onCreated() {
        refreshTable();
        getTaskStatusOption().then((res) => {
            // 表格将中开关的提示和选中未选中的值 设置为从后台获取到的值
            res.data.forEach((item: any) => {
                if (item.isEnabled) {
                    swtich.value.checkedValue = item.value;
                    swtich.value.checkedText = item.label;
                } else if (!item.isEnabled) {
                    swtich.value.uncheckedValue = item.value;
                    swtich.value.uncheckedText = item.label;
                }
            });
            // 更新表格过滤表单的status表单项options
            const taskTableSearchStatusFiledIndex = taskTableSearchInputItems.value.findIndex(
                (item) => item.field === "status"
            );
            if (taskTableSearchStatusFiledIndex !== -1) {
                (
                    taskTableSearchInputItems.value[taskTableSearchStatusFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).options = res.data;
            }
            // 更新任务详情表单的status字段options
            const taskDetailStatusFiledIndex = taskFormPublicInputItems.value.findIndex(
                (item) => item.field === "status"
            );
            if (taskDetailStatusFiledIndex !== -1) {
                (
                    taskFormPublicInputItems.value[taskDetailStatusFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).checkedValue = swtich.value.checkedValue;
                (
                    taskFormPublicInputItems.value[taskDetailStatusFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).checkedText = swtich.value.checkedText;
                (
                    taskFormPublicInputItems.value[taskDetailStatusFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).uncheckedValue = swtich.value.uncheckedValue;
                (
                    taskFormPublicInputItems.value[taskDetailStatusFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).uncheckedText = swtich.value.uncheckedText;
            }
        });
        getTaskStrategyOption().then((res) => {
            // 更新表格过滤表单的strategy字段options
            const taskTableSearchStrategyFiledIndex = taskTableSearchInputItems.value.findIndex(
                (item) => item.field === "strategy"
            );
            if (taskTableSearchStrategyFiledIndex !== -1) {
                (
                    taskTableSearchInputItems.value[taskTableSearchStrategyFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).options = res.data;
            }

            // 更新任务详情表单的strategy字段options
            const taskDetailStrategyFiledIndex = taskFormPublicInputItems.value.findIndex(
                (item) => item.field === "strategy"
            );
            if (taskDetailStrategyFiledIndex !== -1) {
                (
                    taskFormPublicInputItems.value[taskDetailStrategyFiledIndex]
                        .formInputProps as SelectInstance["$props"]
                ).options = res.data;
            }
        });
    }
    // 初始化加载
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
    #editor {
        height: 100px;
        width: 100%;
    }
</style>
