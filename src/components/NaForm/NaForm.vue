<template>
    <div class="w-full tw-py-2">
        <a-form
            class="w-full"
            v-bind="formProps"
            :model="form"
            ref="formRef"
        >
            <a-row
                v-bind="defaultFormRowProps"
                class="w-full"
            >
                <a-col
                    v-for="(inputItem, inputItemIndex) in formInputItems"
                    :key="inputItemIndex"
                    v-bind="computedColProps(inputItem)"
                >
                    <a-form-item
                        v-bind="computedFormLabelProps(inputItem)"
                        :field="inputItem.field"
                    >
                        <template v-slot:label>
                            <span v-if="typeof inputItem.label === 'string'">
                                {{ inputItem.label }}
                            </span>
                            <!-- 自定义label插槽-->
                            <component
                                v-else
                                :is="inputItem.label"
                            ></component>
                        </template>
                        <template v-slot:default>
                            <!-- 设置插槽用来接收父组件的表单控件 -->
                            <slot :name="inputItem.field">
                                <!-- 如果没有传入插槽,默认通过 inputItem.type 名匹配 Arco表单控件 -->
                                <component
                                    :is="
                                        typeof inputItem.type === 'string'
                                            ? `a-${inputItem.type}`
                                            : inputItem.type
                                    "
                                    v-bind="computedFormItemProps(inputItem)"
                                    :model-value="props.modelValue[inputItem.field]"
                                    @update:model-value="onFormItemUpdate($event, inputItem.field)"
                                >
                                    <!-- 根据 inputItem.inputSlots 渲染 arco input 插槽模版 -->
                                    <template
                                        v-for="(
                                            inputSlotComponent, slotName
                                        ) in inputItem.formInputSlots"
                                        :key="slotName"
                                        v-slot:[slotName]="inputSlotProps"
                                    >
                                        <template v-if="typeof inputSlotComponent === 'string'">
                                            {{ inputSlotComponent }}
                                        </template>
                                        <!-- 动态生成组件,传给表单控件插槽 -->
                                        <component
                                            v-else-if="inputSlotComponent"
                                            :is="inputSlotComponent(inputSlotProps)"
                                        ></component>
                                    </template>
                                </component>
                            </slot>
                        </template>
                    </a-form-item>
                </a-col>

                <!-- 操作按钮 -->
                <a-col
                    v-bind="defaultFormActionButtonColProps"
                    v-if="
                        defaultFormActionButtonColProps
                            ? defaultFormActionButtonColProps.showActionButton
                            : true
                    "
                >
                    <slot name="actionButton">
                        <a-space warp>
                            <a-button @click="emit('actionReset')">重置</a-button>
                            <a-button
                                type="primary"
                                @click="emit('actionSubmit')"
                            >
                                提交
                            </a-button>
                        </a-space>
                    </slot>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script setup lang="ts">
    import type * as Arco from "@arco-design/web-vue";
    import { FormInstance } from "@arco-design/web-vue";

    import {
        NaFormData,
        NaFormInputProps,
        NaFormInputItem,
        NaFormLabelSlots,
        NaFormInputSlot,
        ComponentSlots,
        NaFormActionButtonColProps,
    } from "./type";

    const props = defineProps<{
        form?: Arco.FormInstance["model"];
        modelValue: NaFormData; // 表单数据
        formProps?: FormInstance; // form 组件配置
        defaultFormRowProps?: Arco.GridRowInstance["$props"]; // 表单项统一的row 配置
        defaultFormColProps?: Arco.GridColInstance["$props"]; // 表单项统一的col 配置
        defaultFormInputProps?: NaFormInputProps; // 表单项的默认配置
        defaultFormLabelProps?: Arco.FormItemInstance["$props"]; // 统一的label 配置
        defaultFormActionButtonColProps?: NaFormActionButtonColProps; // 按钮col 配置
        formInputItems: NaFormInputItem[]; // form表单控件项
    }>();
    // 组件的默认props配置
    const getInputPropsPreset = (item: NaFormInputItem) => {
        const inputType = item.type;
        // 组件默认配置映射表
        const defaultInputProps = new Map<
            NaFormInputItem["type"],
            Partial<NaFormInputItem["formInputProps"] & { placeholder: string }>
        >([
            ["input", { allowClear: true, placeholder: `请输入${item.label}`, maxLength: 20 }],
            ["input-number", { placeholder: `请输入${item.label}` }],
            ["textarea", { allowClear: false, placeholder: `请填写${item.label}`, maxLength: 200 }],
            ["input-tag", { allowClear: true, placeholder: `请输入${item.label}` }],
            ["select", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["cascader", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["radio-group", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["switch", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["date", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["tree-select", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["mention", { allowClear: true, placeholder: `请输入${item.label}` }],
            ["auto-complete", { allowClear: true, placeholder: `请输入${item.label}` }],
            ["checkbox-group", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["checkbox", { placeholder: `请选择${item.label}` }],
            ["rate", { placeholder: `请选择${item.label}` }],
            ["color-picker", { placeholder: `请选择${item.label}` }],
            ["slider", { placeholder: `请选择${item.label}` }],
            ["time-picker", { allowClear: true, placeholder: `请选择${item.label}` }],
            ["verification-code", { placeholder: `请输入${item.label}` }],
            ["radio", { placeholder: `请选择${item.label}` }],
            ["switch", { placeholder: `请选择${item.label}` }],
        ]);
        return defaultInputProps.get(inputType) || {};
    };
    const computedColProps = (item: NaFormInputItem) => {
        return {
            ...props.defaultFormColProps,
            ...item.colProps,
        };
    };
    const computedFormLabelProps = (item: NaFormInputItem) => {
        const inputType = item.type;

        return {
            ...props.defaultFormLabelProps,
            ...item.formLabelProps,
        };
    };
    const computedFormItemProps = (item: NaFormInputItem) => {
        return {
            ...getInputPropsPreset(item),
            ...props.defaultFormInputProps,
            ...item.formInputProps,
        };
    };
    const emit = defineEmits<{
        "update:modelValue": [value: NaFormData];
        "actionReset": [];
        "actionSubmit": [];
    }>();
    let onFormItemUpdate = (value: any, filed: string) => {
        emit("update:modelValue", Object.assign(props.modelValue, { [filed]: value }));
    };
    const formRef = ref<FormInstance>();

    // 表单验证
    const validate = async () => {
        if (!formRef.value) return false;
        try {
            await formRef.value.validate();
            return true;
        } catch (error) {
            return false;
        }
    };

    // 重置表单
    const resetFields = () => {
        formRef.value?.resetFields();
    };

    // 暴露方法给父组件
    defineExpose({
        validate,
        resetFields,
        formRef,
    });
</script>

<style scoped lang="scss">
    .w-full {
        width: 100%;
    }
</style>
