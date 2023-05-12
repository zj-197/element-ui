import {
    ElTableColumn,
    RenderHeaderData,
    SortOrders,
    TableColumn, TableColumnFilter,
    TableColumnFixedType,
    TableColumnType
} from "./table-column";
import {CreateElement, VNode} from "vue";
import {ElementUIHorizontalAlignment} from "./component";
import {PopoverPlacement} from "./popover";

export type TableColumnProps = {
    hidden?: boolean
    isAddToolBar?: boolean
    type?: TableColumnType

    /** Column label */
    label?: string

    /** Column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered */
    columnKey?: string

    /** Field name. You can also use its alias: property */
    prop?: string

    /** Column width */
    width?: string

    /** Column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion */
    minWidth?: string

    /** Whether column is fixed at left/right. Will be fixed at left if `true` */
    fixed?: boolean | TableColumnFixedType

    /** Render function for table header of this column */
    renderHeader?: (h: CreateElement, data: RenderHeaderData) => VNode | string

    /** Whether column can be sorted */
    sortable?: boolean | 'custom'

    /** Sorting method. Works when `sortable` is `true` */
    sortMethod?: (a: any, b: any) => number

    /** The order of the sorting strategies used when sorting the data. Works when `sortable` is `true`. */
    sortOrders?: SortOrders[]

    /** Whether column width can be resized. Works when border of `el-table` is `true` */
    resizable?: boolean

    /** Function that formats content */
    formatter?: (row: object, column: TableColumn, cellValue: any, $index: number, h) => any

    /** Whether to hide extra content and show them in a tooltip when hovering on the cell */
    showOverflowTooltip?: boolean

    /** Alignment */
    align?: ElementUIHorizontalAlignment

    /** Alignment of the table header. If omitted, the value of the `align` attribute will be applied */
    headerAlign?: ElementUIHorizontalAlignment

    /** Class name of cells in the column */
    className?: string

    /** Class name of the label of this column */
    labelClassName?: string

    /** Function that determines if a certain row can be selected, works when `type` is `'selection'` */
    selectable?: (row: object, index: number) => boolean

    /** Whether to reserve selection after data refreshing, works when `type` is `'selection'` */
    reserveSelection?: boolean

    /** An array of data filtering options */
    filters?: TableColumnFilter[]

    /** Placement for the filter dropdown */
    filterPlacement?: PopoverPlacement

    /** Whether data filtering supports multiple options */
    filterMultiple?: Boolean

    /** Data filtering method. If `filter-multiple` is on, this method will be called multiple times for each row, and a row will display if one of the calls returns `true` */
    filterMethod?: (value: any, row: object) => boolean

    /** Filter value for selected data, might be useful when table header is rendered with `render-header` */
    filteredValue?: TableColumnFilter[]
}
export declare class ElWpTableColumn extends ElTableColumn {
    hidden: boolean
    isAddToolBar: boolean
}
