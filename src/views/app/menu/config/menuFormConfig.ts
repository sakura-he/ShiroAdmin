import IconSelector from "@/components/IconSelector.vue";
import { NaFormInputItem, NaFormInputProps } from "@/components/NaForm/type";
import { AppMenuType, AppMenuStatus } from "@/api/appMenu";

// 菜单ID字段
export const id: NaFormInputItem = {
    label: "菜单ID",
    field: "id",
    type: "input",
    colProps: {
        span: 12,
    },
    formInputProps: {
        disabled: true,
    } as NaFormInputProps,
};

// 创建时间字段
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
        disabled: true,
    },
};

// 更新时间字段
export const updated_at: NaFormInputItem = {
    label: "更新时间",
    field: "updated_at",
    type: "date-picker",
    colProps: {
        span: 12,
    },
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "请选择更新时间",
        valueFormat: "Date",
        disabled: true,
    },
};

// 菜单类型 - 用于详情和编辑时显示（只读slot）
export const type: NaFormInputItem = {
    label: "菜单类型",
    field: "type",
    type: "slot",
    colProps: {
        span: 24,
    },
};

// 目录下新增菜单时的类型选择（可选目录或页面）
const CatalogAddTypeRadio: NaFormInputItem = {
    label: "菜单类型",
    field: "type",
    type: "radio-group",
    colProps: {
        span: 24,
    },
    formInputProps: {
        placeholder: "请选择菜单类型",
        type: "button",
        options: [
            { label: "目录", value: AppMenuType.Catalog },
            { label: "页面", value: AppMenuType.Page },
        ],
    },
};

// 页面下新增菜单时的类型选择（可选页面或按钮）
const PageAddTypeRadio: NaFormInputItem = {
    label: "菜单类型",
    field: "type",
    type: "radio-group",
    colProps: {
        span: 24,
    },
    formInputProps: {
        placeholder: "请选择菜单类型",
        type: "button",
        options: [
            { label: "页面", value: AppMenuType.Page },
            { label: "按钮", value: AppMenuType.Button },
        ],
    },
};

// 根菜单新增时的类型选择（与目录相同）
const RootAddTypeRadio: NaFormInputItem = CatalogAddTypeRadio;

// 父级菜单字段
const pid: NaFormInputItem = {
    label: "父级菜单",
    field: "pid",
    type: "tree-select",
    formInputProps: {
        placeholder: "请选择父级菜单",
        allowClear: true,
        treeProps: { showLine: true },
    },
};

// 菜单标题字段
const title: NaFormInputItem = {
    label: "菜单标题",
    field: "title",
    type: "input",
    formInputProps: {
        placeholder: "请输入菜单标题",
        allowClear: true,
        showWordLimit: true,
        maxLength: 100,
    } as NaFormInputProps,
};

// 权限标识字段
const permission: NaFormInputItem = {
    label: "权限标识",
    field: "permission",
    type: "input",
    formInputProps: {
        placeholder: "请输入权限标识",
        allowClear: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};

// 路径字段
const path: NaFormInputItem = {
    label: "路径",
    field: "path",
    type: "input",
    formInputProps: {
        placeholder: "请输入路径",
        allowClear: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};

// 排序字段
const order: NaFormInputItem = {
    label: "排序",
    field: "order",
    type: "input-number",
    formInputProps: {
        placeholder: "请输入排序值",
        min: 0,
    },
};

// 图标字段
const icon: NaFormInputItem = {
    label: "菜单图标",
    field: "icon",
    type: IconSelector,
    formInputProps: {
        placeholder: "请选择菜单图标",
        allowClear: true,
    } as NaFormInputProps,
};

// 状态字段
const status: NaFormInputItem = {
    label: "状态",
    field: "status",
    type: "switch",
    formInputProps: {
        checkedValue: AppMenuStatus.ENABLE,
        checkedText: "启用",
        uncheckedText: "禁用",
        uncheckedValue: AppMenuStatus.DISABLE,
    } as NaFormInputProps,
};

// ==================== 目录类型表单配置 ====================

// 目录 - 新增表单项
export const MenuFormInputItemsCatalogAdd: NaFormInputItem[] = [
    { ...CatalogAddTypeRadio },
    pid,
    title,
    permission,
    path,
    icon,
    order,
    status,
];

// 目录 - 编辑表单项
export const MenuFormInputItemsCatalogEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    permission,
    path,
    icon,
    order,
    status,
];

// 目录 - 详情表单项
export const MenuFormInputItemsCatalogDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    permission,
    path,
    icon,
    order,
    status,
    created_at,
    updated_at,
];

// ==================== 页面类型表单配置 ====================

// 页面 - 新增表单项
export const MenuFormInputItemsPageAdd: NaFormInputItem[] = [
    { ...PageAddTypeRadio },
    { ...pid },
    title,
    permission,
    path,
    icon,
    order,
    status,
];

// 页面 - 编辑表单项
export const MenuFormInputItemsPageEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    permission,
    path,
    icon,
    order,
    status,
];

// 页面 - 详情表单项
export const MenuFormInputItemsPageDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    permission,
    path,
    icon,
    order,
    status,
    created_at,
    updated_at,
];

// ==================== 按钮类型表单配置 ====================

// 按钮 - 新增表单项
export const MenuFormInputItemsButtonAdd: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    permission,
    icon,
    order,
    status,
];

// 按钮 - 编辑表单项
export const MenuFormInputItemsButtonEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    permission,
    icon,
    order,
    status,
];

// 按钮 - 详情表单项
export const MenuFormInputItemsButtonDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    permission,
    icon,
    order,
    status,
    created_at,
    updated_at,
];

// ==================== 根菜单表单配置 ====================

// 根菜单 - 新增表单项（无父级菜单）
export const MenuFormInputItemsRootAdd: NaFormInputItem[] = [
    { ...RootAddTypeRadio },
    title,
    permission,
    path,
    icon,
    order,
    status,
];

// ==================== 表单布局配置 ====================

// 菜单表单标签配置
export const menuFormLabelProps = {
    showColon: true,
    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};

// 菜单表单列配置
export const menuFormColProps = {
    span: 12,
};

// 菜单表单配置
export const menuFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};

// 菜单表单行配置
export const menuFormRowProps = {
    gutter: 12,
};

// 菜单表单按钮列配置
export const menuFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};
