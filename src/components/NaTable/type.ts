export const a = 1;
import type { PaginationInstance, TableInstance } from "@arco-design/web-vue";

export type NaTableProps = {
    columns?: TableInstance["$props"]["columns"];
    data?: TableInstance["$props"]["data"];
    bordered?: TableInstance["$props"]["bordered"];
    hoverable?: TableInstance["$props"]["hoverable"];
    stripe?: TableInstance["$props"]["stripe"];
    size?: TableInstance["$props"]["size"];
    tableLayoutFixed?: TableInstance["$props"]["tableLayoutFixed"];
    loading?: TableInstance["$props"]["loading"];
    rowSelection?: TableInstance["$props"]["rowSelection"];
    expandable?: TableInstance["$props"]["expandable"];
    scroll?: TableInstance["$props"]["scroll"];
    pagination?: TableInstance["$props"]["pagination"];
    pagePosition?: TableInstance["$props"]["pagePosition"];
    indentSize?: TableInstance["$props"]["indentSize"];
    rowKey?: TableInstance["$props"]["rowKey"];
    showHeader?: TableInstance["$props"]["showHeader"];
    virtualListProps?: TableInstance["$props"]["virtualListProps"];
    spanMethod?: TableInstance["$props"]["spanMethod"];
    spanAll?: TableInstance["$props"]["spanAll"];
    loadMore?: TableInstance["$props"]["loadMore"];
    filterIconAlignLeft?: TableInstance["$props"]["filterIconAlignLeft"];
    hideExpandButtonOnEmpty?: TableInstance["$props"]["hideExpandButtonOnEmpty"];
    rowClass?: TableInstance["$props"]["rowClass"];
    draggable?: TableInstance["$props"]["draggable"];
    rowNumber?: TableInstance["$props"]["rowNumber"];
    columnResizable?: TableInstance["$props"]["columnResizable"];
    summary?: TableInstance["$props"]["summary"];
    summaryText?: TableInstance["$props"]["summaryText"];
    summarySpanMethod?: TableInstance["$props"]["summarySpanMethod"];
    selectedKeys?: TableInstance["$props"]["selectedKeys"];
    defaultSelectedKeys?: TableInstance["$props"]["defaultSelectedKeys"];
    expandedKeys?: TableInstance["$props"]["expandedKeys"];
    defaultExpandedKeys?: TableInstance["$props"]["defaultExpandedKeys"];
    defaultExpandAllRows?: TableInstance["$props"]["defaultExpandAllRows"];
    stickyHeader?: TableInstance["$props"]["stickyHeader"];
    scrollbar?: TableInstance["$props"]["scrollbar"];
    showEmptyTree?: TableInstance["$props"]["showEmptyTree"];
} & {
    title?: string;
    slots?: Record<string, any>;
    pinColumns?: string[]; // 禁止排序及拖拽的列
    requestTableDataFn?: (params: any) => Promise<any>; // 请求表格数据
    isShowFilter?: boolean; // 是否默认显示过滤表单
    isBordered?: boolean; // 是否默认显示边框
    isStripe?: boolean; // 是否默认显示斑马线
    pagination?: any; // 分页配置
    filterValue?: any; // 过滤表单的值
    isEnablePagination?: boolean; // 是否开启自动分页
    isEnableFilter?: boolean; // 是否开启自动筛选
} & {
    paginationProps?: PaginationInstance["$props"];
};
