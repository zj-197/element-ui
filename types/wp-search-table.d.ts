import { ElementUIComponent } from './component'
import {FormItemProps, Pattern} from './wp-form-item';
import {TableColumnProps} from './wp-table-column';
import {ElWpTable, PaginationKey} from "./wp-table";
import {FormItemLabelPosition} from './form'
import { ElementUIHorizontalAlignment, ElementUIComponentSize } from './component'
import { ElWpForm } from "./wp-form";
import {VNode} from "vue";
import {TableColumn} from "./table-column";
export interface WpSearchTableSlots {
    /* default slot:  Custom bottom content */
    default: VNode[]

    /* image slot: Custom image */
    toolbarPrefix: VNode[]

    /* description slot: Custom description */
    toolbarSuffix: VNode[]
    [key: string]: VNode[]
}
type Columns = {
    tag?: string,
    tagProps?: object,
    label?: string,
    prop?: string,
    formItemProps?: FormItemProps,
    columnProps?: TableColumnProps,
    tagInitValue?: any,
    pattern?: Pattern,
    hiddenInForm?: boolean,
    hiddenInTable?: boolean,
    required?: boolean,
    align?: ElementUIHorizontalAlignment,
    width?: string | number
    minWidth?: string | number,
    formatter?: (row: object, column: TableColumn, cellValue:any, index:number) => any
}
/** WpSearchTable Component */
export declare class ElWpSearchTable extends ElementUIComponent {
    columns: Array<Columns>
    autoScrollTop: boolean
    loadData():Promise<any>
    colCount: string | number
    gutter: string | number
    size: ElementUIComponentSize
    pageSize: number
    maxSelect: number
    rowKey: string
    paginationKey: PaginationKey
    tableProps: object
    formProps: object
    labelPosition: FormItemLabelPosition
    labelWidth: string
    isInitCollapse: boolean
    getSelected():[]
    getTableInstance(): ElWpTable
    getFormInstance(): ElWpForm
    refresh: (isForce?: boolean) => Promise<any>
    static defineColumnsConfig: (columns: Array<Columns>) => Array<Columns>
    $slots: WpSearchTableSlots
}


