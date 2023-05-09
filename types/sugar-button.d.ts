
import {ElButton} from "./button";
import {PopoverPlacement} from "./popover";

/** SugarButton Component */
export declare class ElSugarButton extends ElButton {
    autoLoading: boolean
    tooltipPlacement: PopoverPlacement
    popconfirmTitle: string
    tooltip: string
    openLoading():void
    closeLoading():void
}
