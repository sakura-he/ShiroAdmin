<template>
    <div
        class="w-full"
        :class="{ 'full-screen': isFullscreenRef }"
    >
        <!-- 表格标题 -->
        <template v-if="title">
            <div class="tw-text-title-1 tw-flex-0 tw-font-bold tw-pr-4 tw-pb-4">
                {{ title }}
            </div>
        </template>

        <!-- 表格筛选表单 -->
        <template v-if="slots.filterForm">
            <div
                class="w-full"
                v-show="isShowFilterRef"
            >
                <slot name="filterForm" />
            </div>
        </template>

        <!-- 表格标题工具栏 -->
        <div
            class="na-table-toolkit tw-flex-none tw-flex tw-flex-wrap tw-justify-between tw-items-center tw-mb-4"
        >
            <!-- 左侧工具栏 -->
            <div class="na-table-toolkit__left tw-flex-1">
                <a-space
                    size="mini"
                    wrap
                >
                    <slot name="leftToolBar" />
                </a-space>
            </div>

            <!-- 右侧表格工具栏 -->
            <div class="tw-flex-0 tw-ml-auto">
                <a-space>
                    <!-- 斑马纹 -->
                    <a-tooltip
                        :content="isStripeRef ? '斑马纹:开启' : '斑马纹:关闭'"
                        position="top"
                        mini
                    >
                        <a-switch
                            size="small"
                            type="round"
                            v-model="isStripeRef"
                        />
                    </a-tooltip>

                    <a-button-group
                        shape="circle"
                        type="text"
                    >
                        <!-- 筛选显示/隐藏 -->
                        <a-tooltip
                            :content="isShowFilterRef ? '筛选:显示' : '筛选:隐藏'"
                            position="top"
                            mini
                        >
                            <a-button @click="isShowFilterRef = !isShowFilterRef">
                                <template v-slot:icon>
                                    <icon-search
                                        class="tw-text-[16px]"
                                        :class="{ 'tw-text-[#aaaaaa]': !isShowFilterRef }"
                                    />
                                </template>
                            </a-button>
                        </a-tooltip>

                        <!-- 边框 -->
                        <a-tooltip
                            :content="isBorderedRef ? '边框:开启' : '边框:关闭'"
                            position="top"
                            mini
                        >
                            <a-button @click="isBorderedRef = !isBorderedRef">
                                <template v-slot:icon>
                                    <icon-interaction
                                        class="tw-text-[16px]"
                                        :class="{ 'tw-text-[#aaaaaa]': !isBorderedRef }"
                                    />
                                </template>
                            </a-button>
                        </a-tooltip>

                        <!-- 表格大小 -->
                        <a-tooltip
                            content=" 表格大小"
                            position="top"
                            mini
                        >
                            <a-dropdown @select="onTableSizeSelect">
                                <a-button>
                                    <template v-slot:icon>
                                        <icon-zoom-in class="tw-text-[16px]" />
                                    </template>
                                </a-button>

                                <template #content>
                                    <a-doption
                                        v-for="option in tableSizeOptions"
                                        :key="option.value"
                                        :value="{ value: option.value }"
                                    >
                                        {{ option.label }}
                                    </a-doption>
                                </template>
                            </a-dropdown>
                        </a-tooltip>

                        <!-- 列排序 -->
                        <a-tooltip
                            content="列设置"
                            mini
                            update-at-scroll
                        >
                            <a-popover
                                trigger="click"
                                :content-style="{ minWidth: '120px', padding: '6px 8px 10px' }"
                                update-at-scroll
                                :popup-container="mainLayout"
                                position="bottom"
                            >
                                <a-button>
                                    <template v-slot:icon>
                                        <icon-list class="tw-text-[16px]" />
                                    </template>
                                </a-button>
                                <template #content>
                                    <a-tree
                                        v-model:checked-keys="selectedColumns"
                                        :data="sortColumns"
                                        :block-node="true"
                                        checkable
                                        draggable
                                        @drop="onDrop"
                                    ></a-tree>
                                </template>
                            </a-popover>
                        </a-tooltip>

                        <!-- 刷新 -->
                        <a-tooltip
                            content="刷新"
                            position="top"
                            mini
                        >
                            <a-button @click="emit('refresh')">
                                <template v-slot:icon>
                                    <icon-refresh class="tw-text-[16px]" />
                                </template>
                            </a-button>
                        </a-tooltip>

                        <!-- 表格全屏 -->
                        <a-tooltip
                            content="全屏"
                            position="top"
                            mini
                        >
                            <a-button @click="isFullscreenRef = !isFullscreenRef">
                                <template v-slot:icon>
                                    <icon-expand
                                        class="tw-text-[16px]"
                                        v-if="!isFullscreenRef"
                                    />
                                    <icon-shrink
                                        class="tw-text-[16px]"
                                        v-else
                                    />
                                </template>
                            </a-button>
                        </a-tooltip>
                    </a-button-group>
                </a-space>
            </div>
        </div>

        <!-- 表格 -->
        <div class="w-full">
            <a-table
                v-bind="props"
                :data="tableDataRef"
                :columns="_columns"
                :stripe="isStripeRef"
                :size="size"
                :bordered="{ cell: isBorderedRef }"
                :loading="isLoadingRef"
                :pagination="{
                    current: paginationRef.current,
                    pageSize: paginationRef.pageSize,
                    total: paginationRef.total,
                    showTotal: true,
                    showPageSize: true,
                    showJumper: true,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    size: size,
                }"
                @page-change="onPageChange"
                @page-size-change="onPageSizeChange"
            >
                <template
                    v-for="slotName in slots ? Object.keys(naslots) : []"
                    :key="slotName"
                    #[slotName]="scoped"
                >
                    <component
                        :is="naslots[slotName]"
                        v-bind="scoped"
                    ></component>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup lang="ts">
    // 导入外部模块
    import {
        PaginationProps,
        TableColumnData,
        TableData,
        TableInstance,
        TreeNodeData,
    } from "@arco-design/web-vue";
    import { computed, inject, onMounted, ref, Ref, useSlots } from "vue";
    import { NaTableProps } from "./type";
    import { NaTableEmits, useGetNaTableData } from "./useGetNaTableData";

    // 类型定义
    type T = TableData;

    // Props & Slots 定义
    const props = defineProps<NaTableProps>();

    const slots = useSlots();
    const emit = defineEmits<NaTableEmits>();
    // 注入依赖
    const mainLayout = inject<Ref<HTMLElement>>("MainLayout");
    // 内置 ref
    let tableRef = ref<HTMLElement>() as Ref<HTMLElement>;
    let isFullscreenRef = ref(false);
    let isStripeRef = ref(props.stripe ?? true);
    let size = ref<TableInstance["$props"]["size"]>(props.size ?? "medium");
    let isBorderedRef = ref(props.isBordered ?? true);
    let isShowFilterRef = ref(props.isShowFilter ?? true);
    let isLoadingRef = ref(false);
    let isEnablePaginationRef = ref<boolean>(props.isEnablePagination ?? true); // 是否开启自动显示分页
    let isEnableFilterRef = ref<boolean>(true); // 是否开启自动显示筛选
    let tableDataRef = ref<any>(props.data ?? []);
    // 使用 props 属性的 ref
    const { filterValue, title } = toRefs(props);
    // 分页属性
    const paginationRef = ref<PaginationProps>({
        ...(props.paginationProps ? props.paginationProps : {}),
        current: 1,
        pageSize: 10,
        total: undefined,
    });
    // 监听 props.data 的变化
    watch(
        () => props.data,
        (newVal) => {
           
            tableDataRef.value = newVal;
        },
    );
    
    // 表格列相关
    const selectedColumns = ref<string[]>(props.columns.map((column: any) => column.dataIndex));
    const sortColumns = ref(
        props.columns.map((column: any, index: any) => ({
            title: column.title,
            key: column.dataIndex,
            disabled: props.pinColumns ? props.pinColumns.includes(column.dataIndex) : false,
        })),
    );

    // 计算属性
    const naslots: Record<string, any> = computed(() => {
        let s = { ...slots };
        delete s.filterForm;
        return s;
    });

    const _columns = computed(() => {
        let _columns2: any[] = [];
        sortColumns.value.forEach((column: any) => {
            if (selectedColumns.value.includes(column.key)) {
                _columns2.push(props.columns.find((c: any) => c.dataIndex === column.key));
            }
        });
        return _columns2;
    });

    // 常量定义
    const tableSizeOptions = [
        { label: "迷你", value: "mini" },
        { label: "小", value: "small" },
        { label: "中", value: "medium" },
        { label: "大", value: "large" },
    ] as const;

    // 事件处理
    const onTableSizeSelect = (value: any) => {
        size.value = value.value as TableInstance["$props"]["size"];
    };
    const onPageChange = (current: number) => {
        paginationRef.value.current = current;
        emit("pageChange", current);
    };
    const onPageSizeChange = (pageSize: number) => {
        paginationRef.value.pageSize = pageSize;
        emit("pageSizeChange", pageSize);
    };
    // 重置自动筛选表单
    const resetFilterForm = async () => {
        emit("resetFilterForm");
        await nextTick(() => {
            filterFormSubmit();
        });
    };
    // 更新筛选表单
    const filterFormSubmit = async () => {
        emit("filterFormSubmit");
        await nextTick(() => {
            if (paginationRef.value.current == 1) {
                getTableData();
            }
            paginationRef.value.current = 1;
        });
    };
    const onDrop = (data: {
        e: DragEvent;
        dragNode: TreeNodeData;
        dropNode: TreeNodeData;
        dropPosition: number;
    }) => {
        let _treeData2 = sortColumns.value;
        const { dragNode, dropNode, dropPosition } = data;

        if (dropPosition === 0 || dragNode.disabled) {
            return;
        }

        _treeData2 = _treeData2.filter((node: any) => node.key !== dragNode.key);
        const dropNodeIndex = _treeData2.findIndex((node: any) => node.key === dropNode.key);

        if (dropPosition === 1) {
            _treeData2.splice(dropNodeIndex + 1, 0, dragNode);
        } else {
            _treeData2.splice(dropNodeIndex, 0, dragNode);
        }

        sortColumns.value = _treeData2;
    };

    // 导出的内部状态
    const NaTableState = ref({
        tableRef,
        isFullscreenRef,
        isStripeRef,
        size,
        isBorderedRef,
        isShowFilterRef,
        isLoadingRef,
        filterFormValueRef: filterValue,
        isEnablePaginationRef,
        isEnableFilterRef,
        tableDataRef,
        paginationRef,
    });
    // Hooks
    const { getTableData } = useGetNaTableData({
        props,
        tableRef,
        emit,
        slots,
        isLoadingRef,
        paginationRef,
        isEnablePaginationRef,
        tableDataRef,
        isEnableFilterRef,
        NaTableState,
        filterFormValueRef: filterValue,
    });
    // 导出的内部方法
    const NaTableMethods = {
        getTableData,
        filterFormSubmit,
        resetFilterForm,
    };
    const NaTableContext = {
        props,
        tableRef,
        emit,
        slots,
        NaTableState,
        NaTableMethods,
    };
    defineExpose({
        NaTableContext,
    });

    // Slots 类型定义
    defineSlots<{
        "th": (props: { column: TableColumnData }) => void;
        "thead": () => void;
        "empty": (props: { column: TableColumnData }) => void;
        "summary-cell": (props: { column: TableColumnData; record: T; rowIndex: number }) => void;
        "pagination-right": () => void;
        "pagination-left": () => void;
        "td": (props: { column: TableColumnData; record: T; rowIndex: number }) => void;
        "tr": (props: { record: T; rowIndex: number }) => void;
        "tbody": () => void;
        "drag-handle-icon": () => void;
        "footer": () => void;
        "expand-row": (props: { record: T }) => void;
        "expand-icon": (props: { record: T; expanded?: boolean }) => void;
        "columns": () => void;
        "custom-title": () => void;
        "custom-extra": () => void;
        "filterForm": () => void;
        [propsName: string]: (props: any) => any;
    }>();

    // 生命周期钩子
    onMounted(async () => {
        let res = await getTableData();
        tableDataRef.value = res.data.records;
    });
</script>

<style scoped lang="scss">
    .w-full {
        width: 100%;
    }

    .full-screen {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 100000001;
    }
</style>
