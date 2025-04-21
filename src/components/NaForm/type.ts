import type * as Arco from "@arco-design/web-vue";
import { Component, VNode } from "vue";
// Arco表单项控件的props属性
export type NaFormInputProps =
    | Arco.InputInstance["$props"]
    | Arco.InputNumberInstance["$props"]
    | Arco.InputTagInstance["$props"]
    | Arco.TextareaInstance["$props"]
    | Arco.SelectInstance["$props"]
    | Arco.SwitchInstance["$props"]
    | Arco.DatePickerInstance["$props"]
    | Arco.CascaderInstance["$props"]
    | Arco.RadioGroupInstance["$props"]
    | Arco.RadioInstance["$props"]
    | Arco.TreeSelectInstance["$props"]
    | Arco.AutoCompleteInstance["$props"]
    | Arco.CheckboxGroupInstance["$props"]
    | Arco.RateInstance["$props"]
    | Arco.ColorPickerInstance["$props"]
    | Arco.MentionInstance["$props"]
    | Arco.SliderInstance["$props"]
    | Arco.TimePickerInstance["$props"]
    | Arco.VerificationCodeInstance["$props"]
    | Arco.CheckboxInstance["$props"];
// 表单项控件的类型
export interface NaFormInputItem {
    label: string | Component; // 表单项的标签
    field: string; // 表单项的名称
    type:
        | "slot"
        | "input"
        | "input-number"
        | "input-tag"
        | "mention"
        | "tree-select"
        | "cascader"
        | "radio-group"
        | "radio"
        | "select"
        | "switch"
        | "textarea"
        | "date"
        | "auto-complete"
        | "checkbox-group"
        | "checkbox"
        | "rate"
        | "color-picker"
        | "slider"
        | "time-picker"
        | "date-picker"
        | "verification-code"|any; // 表单项的类型
    colProps?: Arco.GridColInstance["$props"]; // 表单项的列属性
    formLabelProps?: Arco.FormItemInstance["$props"]; // 表单项的标签项属性
    formLabelSlots?: NaFormLabelSlots; // 表单项的标签项插槽
    formInputProps?: NaFormInputProps; // 表单项控件props属性
    formInputSlots?: NaFormInputSlot; // 表单项控件的插槽
    formActionButtonColProps?: NaFormActionButtonColProps; // 表单项操作按钮列属性
}

export interface NaFormLabelSlots {
    [key: string]: Component | string;
}
export interface NaFormData {
    [filed: string]: any;
}
export type NaFormActionButtonColProps = Arco.GridColInstance["$props"] & {
    showActionButton: boolean; // 是否显示操作按钮
};

type AutoCompleteSlots = {
    option: (e: {
        data: (string | number | Arco.SelectOptionData | Arco.SelectOptionGroup)[];
    }) => VNode;
    footer: () => string;
};

type CascaderSlots = {
    "label": (e: { data: Arco.CascaderOption }) => VNode;
    "prefix": () => VNode;
    "arrow-icon": () => VNode;
    "loading-icon": () => VNode;
    "search-icon": () => VNode;
    "empty": () => VNode;
    "option": (e: { data: Arco.CascaderOption }) => VNode;
};

type CheckboxGroupSlots = {
    checkbox: (e: { checked: boolean; disabled: string }) => VNode;
    label: (e: { data: Arco.CheckboxOption }) => VNode;
};

type RadioGroupSlots = {
    radio: (e: { checked: boolean; disabled: string }) => VNode;
    label: (e: { data: any }) => VNode;
};

type DatePickerSlots = {
    "prefix": () => VNode;
    "suffix-icon": () => VNode;
    "icon-next-double": () => VNode;
    "icon-prev-double": () => VNode;
    "icon-next": () => VNode;
    "icon-prev": () => VNode;
    "cell": (e: { data: Date }) => VNode;
    "extra": () => VNode;
};

type InputSlots = {
    append: () => VNode;
    prepend: () => VNode;
    suffix: () => VNode;
    prefix: () => VNode;
};

type InputNumberSlots = {
    minus: () => VNode;
    plus: () => VNode;
    append: () => VNode;
    prepend: () => VNode;
    suffix: () => VNode;
};

type InputTagSlots = {
    tag: (e: { data: Arco.TagData }) => VNode;
    prefix: () => VNode;
    suffix: () => VNode;
};

type RateSlots = {
    character: (e: { index: number }) => VNode;
};

type SelectSlots = {
    "trigger": () => VNode;
    "prefix": () => VNode;
    "search-icon": () => VNode;
    "loading-icon": () => VNode;
    "arrow-icon": () => VNode;
    "footer": () => VNode;
    "header": () => VNode;
    "label": (e: { data: Arco.SelectOptionData }) => VNode;
    "option": (e: { data: Arco.SelectOptionData }) => VNode;
    "empty": () => VNode;
};

type SwitchSlots = {
    "checked-icon": () => VNode;
    "unchecked-icon": () => VNode;
    "checked": () => VNode;
    "unchecked": () => VNode;
};

type TreeSelectSlots = {
    "trigger": () => VNode;
    "prefix": () => VNode;
    "label": (e: { data: any }) => VNode;
    "header": () => VNode;
    "loader": () => VNode;
    "empty": () => VNode;
    "footer": () => VNode;
    "tree-slot-extra": () => VNode;
    "tree-slot-title": (e: { title: string }) => VNode;
    "tree-slot-icon": (e: { node: Arco.TreeNodeData }) => VNode;
    "tree-slot-switcher-icon": () => VNode;
};

type MentionSlots = {
    option: (e: { data: any }) => VNode;
};

export type ComponentSlots = AutoCompleteSlots &
    CascaderSlots &
    CheckboxGroupSlots &
    RadioGroupSlots &
    DatePickerSlots &
    InputSlots &
    InputNumberSlots &
    InputTagSlots &
    RateSlots &
    SelectSlots &
    SwitchSlots &
    TreeSelectSlots &
    MentionSlots;

export interface ColumnItemSlots extends Omit<ComponentSlots, "label" | "option"> {
    label?: (e: {
        data: Arco.CheckboxOption | Arco.SelectOptionData | Arco.CascaderOption;
    }) => VNode;
    option?: (e: {
        data:
            | (string | number | Arco.SelectOptionData | Arco.SelectOptionGroup)[]
            | Arco.CascaderOption
            | Arco.SelectOptionData;
    }) => VNode;
}

export type NaFormInputSlot = Partial<ColumnItemSlots>;
