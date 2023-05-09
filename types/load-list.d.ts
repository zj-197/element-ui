import { ElementUIComponent } from './component'

/** LoadList Component */
export declare class ElLoadList extends ElementUIComponent {
    loadData: () => Promise<object>
    pageSize: number
    paginationKey: object
    paginationProps: object
    emptyText: string
    emptyBtnText: string
    emptyImage: string
    errorText: string
    errorBtnText: string
    errorImage: string
    loadingText: string
    autoScrollTop: boolean
    refresh: (isForce?: boolean) => Promise<any>
}
