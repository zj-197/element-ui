import { ElementUIComponent } from './component'
import { cellCallbackParams, DefaultSortOptions, ElTable, rowCallbackParams, SummaryMethodParams } from "./table";
import { TooltipEffect } from "./tooltip";
import {VNode} from "vue";
export type PaginationKey = {
    page?: string,
    pageSize?: string,
    total?: string
    tableList?: string
}

export interface WpTableSlots {
    /* default slot:  Custom bottom content */
    default: VNode[]

    /* image slot: Custom image */
    toolbarPrefix: VNode[]

    /* description slot: Custom description */
    toolbarSuffix: VNode[]
    append: VNode[]
    empty: VNode[]
    [key: string]: VNode[]
}
export type LoadData = (() => Promise<any>) | Array<object>
/** WpTable Component */
export declare class ElWpTable extends ElementUIComponent {
    emptyBtnText: string
    loadingText: string
    emptyImage: string
    errorImage: string
    onEmptyBtnClick():void
    maxSelect: number
    reserveSelection: boolean
    isShowRefreshTool: boolean
    isShowSettingTool: boolean
    isShowSizeTool: boolean
    toolAlign: 'left' | 'right'
    paginationKey: PaginationKey
    pageSize: number
    loadData: LoadData
    width: string
    getTableVm():ElTable
    /** Table's height. By default it has an auto height. If its value is a number, the height is measured in pixels; if its value is a string, the height is affected by external styles */
    height: string | number

    /** Table's max-height. The height of the table starts from auto until it reaches the maxHeight limit. The maxHeight is measured in pixels, same as height */
    maxHeight: string | number

    /** Whether table is striped */
    stripe: boolean

    /** Whether table has vertical border */
    border: boolean

    /** Whether width of column automatically fits its container */
    fit: boolean

    /** Whether table header is visible */
    showHeader: boolean

    /** Whether current row is highlighted */
    highlightCurrentRow: boolean

    /** Key of current row, a set only prop */
    currentRowKey: string | number

    /** Whether to lazy load tree structure data, used with load attribute */
    lazy: boolean

    /** Horizontal indentation of nodes in adjacent levels in pixels */
    indent: number

    /** Function that returns custom class names for a row, or a string assigning class names for every row */
    rowClassName: string | ((param: rowCallbackParams) => string)

    /** Function that returns custom style for a row, or an object assigning custom style for every row */
    rowStyle: object | ((param: rowCallbackParams) => object)

    /** Function that returns custom class names for a cell, or a string assigning class names for every cell */
    cellClassName: string | ((param: cellCallbackParams) => string)

    /** Function that returns custom style for a cell, or an object assigning custom style for every cell */
    cellStyle: object | ((param: cellCallbackParams) => object)

    /** Function that returns custom class names for a row in table header, or a string assigning class names for every row in table header */
    headerRowClassName: string | ((param: rowCallbackParams) => string)

    /** Function that returns custom style for a row in table header, or an object assigning custom style for every row in table header */
    headerRowStyle: object | ((param: rowCallbackParams) => object)

    /** Function that returns custom class names for a cell in table header, or a string assigning class names for every cell in table header */
    headerCellClassName: string | ((param: cellCallbackParams) => string)

    /** Function that returns custom style for a cell in table header, or an object assigning custom style for every cell in table header */
    headerCellStyle: object | ((param: cellCallbackParams) => object)

    /** Key of row data, used for optimizing rendering. Required if reserve-selection is on */
    rowKey: string

    /** Displayed text when data is empty. You can customize this area with `slot="empty"` */
    emptyText: String

    /** Whether expand all rows by default. Only works when the table has a column `type="expand"` */
    defaultExpandAll: Boolean

    /** Set expanded rows by this prop. Prop's value is the keys of expand rows, you should set row-key before using this prop */
    expandRowKeys: any[]

    /** Set the default sort column and order */
    defaultSort: DefaultSortOptions

    /** Tooltip effect property */
    tooltipEffect: TooltipEffect

    /** Whether to display a summary row */
    showSummary: boolean

    /** Displayed text for the first column of summary row */
    sumText: string

    /** Custom summary method */
    summaryMethod: (param: SummaryMethodParams) => any[]

    /** Controls the behavior of master checkbox in multi-select tables when only some rows are selected */
    selectOnIndeterminate: boolean
    getSelected():[]
    setSelected():void
    refresh: (isForce?: boolean) => Promise<any>
    $slots: WpTableSlots
}
