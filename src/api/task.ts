import { request } from "@/api/index";

export interface TaskForm {
    user_id?: number | undefined;
    name: string | undefined;
    cron: string | undefined;
    remark: string | undefined;
    options: string | undefined;
    params: string | undefined;
    handler: string | undefined;
    strategy: string | undefined;
    status: string | undefined;
    [key: string]: any;
}

// 获取任务列表
export function getTaskList(params: { page: number; pageSize: number }) {
    
    return request({
        url: "/system/task/get_task_list",
        method: "get",
        params,
    });
}
export function getTaskStatusOption() {
    return request({
        url: "/system/task/get_task_status_option",
        method: "get",
    });
}
export function getTaskStrategyOption() {
    return request({
        url: "/system/task/get_task_strategy_option",
        method: "get",
    });
}

// 创建任务
export function createTask(data: any) {
    return request({
        url: "/system/task/create_task",
        method: "post",
        data,
    });
}

// 更新任务
export function updateTask(data: TaskForm) {
    return request({
        url: "/system/task/update_task",
        method: "post",
        data,
    });
}

// 删除任务
export function deleteTask(id: number) {
    return request({
        url: `/system/task/delete_task`,
        method: "post",
        data: {
            id,
        },
    });
}

// 更新任务状态
export function updateTaskStatusApi(data: { id: number; status: string }) {
    return request({
        url: `/system/task/update_task_status`,
        method: "post",
        data,
    });
}

// 执行一次任务
export function runTaskOnce(id: number) {
    return request({
        url: `/system/task/run_task`,
        method: "post",
        data: {
            task_id: id,
        },
    });
}
