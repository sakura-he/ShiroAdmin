<template>
    <div>
        
        <!-- 表单 -->
        <a-form
            :model="formData"
            :layout="'vertical'"
            :disabled="status === MenuStatusEnum.detail"
        >
            <div>
                <a-form-item label="菜单类型">
                    <a-radio-group
                        type="button"
                        v-model="formData.meta.type"
                        :disabled="status !== MenuStatusEnum.add"
                    >
                        <a-radio
                            :value="item.value"
                            v-for="item in menuType"
                        >
                            {{ item.name }}
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
            </div>
            <!-- 共有选项 -->
            <div class="container tw-grid tw-grid-flow-row tw-auto-cols-max tw-gap-4">
                <a-form-item
                    label="name"
                    required
                    help="请填入对应 .vue 页面的文件名,如果设置了组件的 name 属性,则填入设置的值;请保证全局唯一"
                >
                    <a-input v-model="formData.name"></a-input>
                </a-form-item>

                <a-form-item
                    label="url 地址片段"
                    required
                    help="传入一个路径片段,会自动拼出完成的访问地址,没有 / "
                >
                    <a-input v-model="formData.path"></a-input>
                </a-form-item>
                <a-form-item label="标题">
                    <a-input v-model="formData.meta.title"></a-input>
                </a-form-item>
            </div>
            <!-- 页面选项 -->
            <div
                class="container tw-grid tw-grid-flow-row tw-auto-cols-max tw-gap-4"
                v-if="formData.meta.type === MenuEnum['Page']"
            >
                <a-form-item
                    label="组件路径"
                    required
                    help="以 views 为 root 目录的路径"
                >
                    <a-input v-model="formData.component"></a-input>
                </a-form-item>

                <a-form-item label="图标">
                    <a-input-group class="tw-w-full">
                        <IconSelectorVue @picked="onIconPicked">
                            <a-button class="!tw-rounded-none">
                                <template #icon>
                                    <DynamicIcon
                                        :icon="formData.meta.icon"
                                        backupIcon="IconFaceSmileFill"
                                    />
                                </template>
                            </a-button>
                        </IconSelectorVue>
                        <a-input v-model="formData.meta.icon"></a-input>
                    </a-input-group>
                </a-form-item>
                <a-form-item label="排序">
                    <a-input-number />
                </a-form-item>
                <a-form-item label="菜单权限">
                    <a-select
                        placeholder="请选择访问权限"
                        multiple
                    >
                        <a-option>超级管理员</a-option>
                        <a-option :tag-props="{ color: 'red' }">管理员</a-option>
                        <a-option>VIP用户</a-option>
                        <a-option disabled>注册用户</a-option>
                        <a-option>非注册用户</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="是否在菜单中隐藏">
                    <a-radio-group>
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="允许在标签栏显示">
                    <a-radio-group>
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="打开方式">
                    <a-radio-group>
                        <a-radio :value="true">新窗口打开</a-radio>
                        <a-radio :value="false">当前页面打开</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="需要权限验证">
                    <a-radio-group>
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="新标签页默认为固定状态">
                    <a-radio-group v-model="formData.meta.residentTab">
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="不允许解除固定">
                    <a-radio-group v-model="formData.meta.noCancelResident">
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
            </div>
            <a-form-item>
                <a-button
                    :type="'primary'"
                    @click="emits('commit')"
                >
                    保存
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
    import DynamicIcon from "@/components/DynamicIcon.vue";
import IconSelectorVue from "@/components/IconSelector.vue";
import { MenuEnum } from "@/router/type";
import { reactive } from "vue";
import { RouteMeta } from "vue-router";
import { MenuDataType, MenuStatusEnum } from "../types/types";
    // 定义事件, 子传父值
    let emits = defineEmits<{
        (e: "commit"): void;
    }>();
    // 暴露出组件update方法, 让父组件控制子组件的状态
    defineExpose({
        update,
    });
    let status = ref<MenuStatusEnum>(1);
    let menuType = [
        { name: "菜单", value: MenuEnum["Catalog"] },
        { name: "页面", value: MenuEnum["Page"] },
        { name: "按钮", value: 3 },
    ];
    let initData: any = {
        name: "",
        component: "",
        path: "",
        meta: {},
    };
    // 表单数据,作为表单和提交对象(内部维护的)
    let formData: MenuDataType = reactive({
        name: "",
        component: "",
        path: "",
        meta: {} as RouteMeta,
    });
    function onIconPicked(e: string) {
        formData.meta.icon = e;
    }

    // 更新表单状态, 状态类形取 ../types.ts的类型
    function update(type: MenuStatusEnum, data?: Record<string, any>) {
        status.value = type;
        // 重置表单
        Object.keys(initData).forEach((key) => {
            formData[key as keyof MenuDataType] = initData[key];
        });
        // 编辑菜单
        if (status.value === MenuStatusEnum.edit || status.value === MenuStatusEnum.detail) {
            if (typeof data !== "object") return;
            // 将表单数据设置为后台返回菜单表单的初始数据
            Object.keys(data).forEach((key) => {
                formData[key as keyof MenuDataType] = data[key];
            });
        }
        // 新增菜单
        if (status.value === MenuStatusEnum.add) {
        }
    }
</script>
<style lang="scss" scoped>
    .container {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        justify-content: stretch;
    }
</style>
