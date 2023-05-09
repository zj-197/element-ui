
import {ElForm, ValidateCallback, ValidateFieldCallback} from "./form";
import { VertialAlignment } from "./row";
import {VNode} from "vue";

/** WpForm Component */
export declare class ElWpForm extends ElForm {
    isShowResetBtn: boolean
    searchBtnProps: object
    resetBtnProps: object
    isShowSearchBtn: boolean
    isShowCollapse: boolean
    isInitCollapse: boolean
    searchBtnText: string
    gutter: number | string
    colCount: number | string
    collapseText: string
    spreadText: string
    align: VertialAlignment
    openResetting():void
    closeResetting():void
    openSearching():void
    closeSearching:void
    validate (callback: ValidateCallback): void
    validate (): Promise<boolean>
    /**
     * Validate certain form items
     *
     * @param props The property of `model` or array of prop which is going to validate
     * @param callback A callback to tell the field validation result
     */
    validateField (props: string | string[], callback?: ValidateFieldCallback): void

    /** reset all the fields and remove validation result */
    resetFields (): void

    /** clear validation message for certain fields */
    clearValidate (props?: string | string[]): void
    getFormInstance():VNode
}
