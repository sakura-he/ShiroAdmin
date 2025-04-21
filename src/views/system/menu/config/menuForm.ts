import IconSelector from "@/components/IconSelector.vue";
import { NaFormInputItem, NaFormInputProps } from "@/components/NaForm/type";
enum MenuType {
    Catalog = "Catalog", // 目录
    Page = "Page", // 页面
    Button = "Button", // 按钮
    Root = "Root", // 根菜单
}
export const id: NaFormInputItem = {
    label: "节点ID",
    field: "id",
    type: "input",
    colProps: {
        span: 12,
    },
};
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
    },
};
export const updated_at: NaFormInputItem = {
    label: "更新时间",
    field: "updated_at",
    type: "date-picker",
    formInputProps: {
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
        placeholder: "请选择更新时间",
        valueFormat: "Date",
    },
    colProps: {
        span: 12,
    },
};
// 菜单类型
export const type: NaFormInputItem = {
    label: "节点类型",
    field: "type",
    type: "slot",
    colProps: {
        span: 24,
    },
};
const CatalogAddTypeRadio: NaFormInputItem = {
    label: "节点类型",
    field: "type",
    type: "radio-group",
    colProps: {
        span: 24,
    },
    formInputProps: {
        placeholder: "请选择节点类型",
        type: "button",
        options: [
            { label: "目录", value: MenuType.Catalog },
            { label: "页面", value: MenuType.Page },
        ],
    },
};
const PageAddTypeRadio: NaFormInputItem = {
    label: "节点类型",
    field: "type",
    type: "radio-group",
    colProps: {
        span: 24,
    },
    formInputProps: {
        placeholder: "请选择节点类型",
        type: "button",
        options: [
            { label: "页面", value: MenuType.Page },
            { label: "按钮", value: MenuType.Button },
        ],
    },
};
const RootAddTypeRadio: NaFormInputItem = CatalogAddTypeRadio;
// 父级节点
const pid: NaFormInputItem = {
    label: "父级节点",
    field: "pid",
    type: "tree-select",
    formInputProps: {
         
        placeholder: "请选择父级节点",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,

        treeProps: { showLine: true },
    },
};

const title: NaFormInputItem = {
    label: "节点名称",
    field: "title",
    type: "input",
    formInputProps: {
        placeholder: "请输入节点名称",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const component_name: NaFormInputItem = {
    label: "组件名称",
    field: "component_name",
    type: "input",
    formInputProps: {
        placeholder: "请输入组件名称",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
 
const description: NaFormInputItem = {
    label: "节点描述",
    field: "description",
    type: "textarea",
    formInputProps: {
        autoSize: true,
        placeholder: "请输入节点描述",
        clearable: true,
        showWordLimit: true,
        maxLength: 300,
    },
};

const permission: NaFormInputItem = {
    label: "权限值",
    field: "permission",
    type: "input",
    formInputProps: {
        placeholder: "请输入权限值",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};

const component_path: NaFormInputItem = {
    label: "组件路径",
    field: "component_path",
    type: "input",
    formInputProps: {
        placeholder: "请输入组件路径",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const path: NaFormInputItem = {
    label: "路由路径",
    field: "path",
    type: "input",
    formInputProps: {
        placeholder: "请输入路由路径",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const order: NaFormInputItem = {
    label: "排序",
    field: "order",
    type: "input-number",
    formInputProps: {
        placeholder: "请输入排序值",
        clearable: true,
    },
};

const icon: NaFormInputItem = {
    label: "菜单图标",
    field: "icon",
    type: IconSelector,
    formInputProps: {
        placeholder: "请输入菜单图标",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};

const status: NaFormInputItem = {
    label: "状态",
    field: "status",
    type: "switch",
    formInputProps: {
        placeholder: "请选择状态",
        // 自定义状态
        checkedValue: "ENABLE",
        checkedText: "启用",
        uncheckedText: "禁用",
        uncheckedValue: "DISABLE",
    } as NaFormInputProps,
};

const is_menu_visible: NaFormInputItem = {
    label: "隐藏菜单",
    field: "is_menu_visible",
    type: "switch",
    formInputProps: {
        placeholder: "请输入菜单名称",
    },
};
const layout: NaFormInputItem = {
    label: "布局",
    field: "layout",
    type: "input",
    formInputProps: {
        placeholder: "请选择布局",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const page_type: NaFormInputItem = {
    label: "页面类型",
    field: "page_type",
    type: "input",
    formInputProps: {
        placeholder: "请选择页面类型",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const is_resident: NaFormInputItem = {
    label: "是否常驻",
    field: "is_resident",
    type: "switch",
    formInputProps: {
        placeholder: "请选择常驻状态",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const is_cache: NaFormInputItem = {
    label: "是否缓存",
    field: "is_cache",
    type: "switch",
    formInputProps: {
        placeholder: "请选择缓存状态",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const show_children: NaFormInputItem = {
    label: "是否显示子节点",
    field: "show_children",
    type: "switch",
    formInputProps: {
        placeholder: "请选择显示子节点状态",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
const is_tab_visible: NaFormInputItem = {
    label: "是否在标签栏显示",
    field: "is_tab_visible",
    type: "switch",
    formInputProps: {
        placeholder: "请选择显示状态",
        clearable: true,
        showWordLimit: true,
        maxLength: 200,
    } as NaFormInputProps,
};
export const MenuFormInputItemsCatalogAdd: NaFormInputItem[] = [
    { ...CatalogAddTypeRadio },
    pid,
    title,
    description,
    permission,
    path,
    icon,
    order,
    status,
    is_menu_visible,
    show_children,
];
export const MenuFormInputItemsCatalogEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    description,
    permission,
    path,
    icon,
    order,
    status,
    is_menu_visible,
    show_children,
];
export const MenuFormInputItemsCatalogDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    description,
    permission,
    path,
    icon,
    order,
    status,
    is_menu_visible,
    show_children,
    created_at,
    updated_at,
];
export const MenuFormInputItemsPageAdd: NaFormInputItem[] = [
    { ...PageAddTypeRadio },
    { ...pid },
    title,
    description,
    permission,
    component_path,
    component_name,
    path,
    icon,
    order,
    layout,
    page_type,
    is_resident,
    is_cache,
    is_tab_visible,
    status,
    is_menu_visible,
];
export const MenuFormInputItemsPageEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    description,
    permission,
    component_path,
    component_name,

    path,
    icon,
    order,
    layout,
    page_type,
    is_resident,
    is_tab_visible,
    is_cache,
    status,
    is_menu_visible,
];
export const MenuFormInputItemsPageDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    description,
    permission,
    component_path,
    component_name,
    path,
    icon,
    order,
    layout,
    page_type,
    is_resident,
    is_cache,
    status,
    is_tab_visible,
    is_menu_visible,
    created_at,
    updated_at,
];
export const MenuFormInputItemsButtonAdd: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    description,
    permission,
    icon,
    order,
    status,
];
export const MenuFormInputItemsButtonEdit: NaFormInputItem[] = [
    type,
    { ...pid },
    title,
    description,
    permission,
    icon,
    order,
    status,
];
export const MenuFormInputItemsButtonDetail: NaFormInputItem[] = [
    type,
    id,
    { ...pid },
    title,
    description,
    permission,
    icon,
    order,
    status,
    created_at,
    updated_at,
];
export const MenuFormInputItemsRootAdd: NaFormInputItem[] = [
    { ...RootAddTypeRadio },
    title,
    description,
    permission,
    order,
    icon,
    status,
    is_menu_visible,
];
// 角色详情表单标签配置
export const menuDetailFormLabelProps = {
    showColon: true,

    labelColProps: {
        span: 6,
    },
    wrapperColProps: {
        span: 18,
    },
};
export const menuDetailFormColProps = {
    span: 12,
};
// 角色详情表单配置
export const menuDetailFormProps = {
    layout: "horizontal",
    labelAlign: "right",
    autoLabelWidth: true,
};
// 角色详情表单行配置
export const menuDetailFormRowProps = {
    gutter: 12,
};
// 角色详情表单按钮列配置
export const menuFormBtnColProps = {
    class: "tw-ml-auto",
    flex: "0",
    showActionButton: true,
};
