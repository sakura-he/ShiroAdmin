import { PaginationProps } from "@arco-design/web-vue";
import { EmitFn, Ref, SetupContext } from "vue";
import { NaTableProps } from "./type";
export interface NaTableEmits {
    refresh: [];
    test: [];
    filterFormSubmit: [];
    resetFilterForm: [];
    pageChange: [number];
    pageSizeChange: [number];
}
export interface Pagination {
    page: number;
    limit: number;
}
export interface NaTableContext {
    tableRef: Ref<HTMLElement>;
    props: NaTableProps;
    emit: EmitFn<NaTableEmits>;
    slots: SetupContext["slots"];
    isLoadingRef: Ref<boolean>;
    paginationRef: Ref<PaginationProps>;
    filterFormValueRef?: Ref<any>;
    isEnablePaginationRef: Ref<boolean>;
    tableDataRef: Ref<any[]>;
    isEnableFilterRef: Ref<boolean>;
    NaTableState: Ref<any>;
}
export function useGetNaTableData(NaTableContext: NaTableContext) {
    const {
        props,
        isLoadingRef,
        paginationRef,
        isEnablePaginationRef,
        tableDataRef,
        isEnableFilterRef,
        filterFormValueRef,
    } = NaTableContext;
    watch(
        () => paginationRef.value.current,
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                getTableData();
            }
        }
    );
    watch(
        () => paginationRef.value.pageSize,
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                getTableData();
            }
        }
    );

    // 获取表格数据
    const getTableData = async () => {
        if (props.requestTableDataFn && typeof props.requestTableDataFn === "function") {
            isLoadingRef.value = true;
            let params = {};
            let pageParams = {
                ...(isEnablePaginationRef.value && typeof paginationRef.value === "object"
                    ? { page: paginationRef.value.current, page_size: paginationRef.value.pageSize }
                    : {}),
            };
            let filterParams: Record<string, any> = {};
            if (
                isEnableFilterRef.value &&
                filterFormValueRef &&
                typeof filterFormValueRef.value === "object"
            ) {
                Object.keys(filterFormValueRef.value).forEach((key) => {
                    if (
                        filterFormValueRef.value[key] !== "" &&
                        filterFormValueRef.value[key] != null &&
                        filterFormValueRef.value[key] !== undefined &&
                        filterFormValueRef.value[key].length > 0 &&
                        Object.keys(filterFormValueRef.value[key]).length > 0
                    ) {
                        filterParams[key] = filterFormValueRef.value[key];
                        // 如果值是数组，则将数组中的每个值转换为时间戳
                        if (Array.isArray(filterParams[key])) {
                            filterParams[key] = filterParams[key].join(",");
                        }
                    }
                });
            }
            // 合并请求参数
            params = {
                ...params,
                ...pageParams,
                ...filterParams,
            };
            // 更新表格数据
            const res = await props.requestTableDataFn(params);
            isLoadingRef.value = false;
            tableDataRef.value = res.data.records;
            paginationRef.value.total = res.data.pagination.total;
            paginationRef.value.current = res.data.pagination.page;
            paginationRef.value.pageSize = res.data.pagination.pageSize;
            return res;
        }
        isLoadingRef.value = false;
        return [];
    };
    return { getTableData };
}
