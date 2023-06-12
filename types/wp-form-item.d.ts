import { ElFormItem } from "./form-item";
import { PopoverPlacement } from './popover'
import {ElementUIComponentSize} from "./component";

export type WpFormItemPattern = 'number' | 'mobile' | 'email' | 'strongPasswd' | 'middlePasswd'
    | 'weakPasswd' | 'number10' | 'landline' | 'code' | 'code4' | 'chinese' | 'letter' | 'money' | 'card' | 'enOrNum' | 'url' | RegExp

export type WpFormItemValueType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | string

export type FormItemProps = {
    prop?: string

    /** Label */
    label?: string

    /** Width of label, e.g. '50px' */
    labelWidth?: string

    /** Whether the field is required or not, will be determined by validation rules if omitted */
    required?: boolean

    /** Validation rules of form */
    rules?: object

    /** Field error message, set its value and the field will validate error and show this message immediately */
    error?: string

    /** Whether to show the error message */
    showMessage?: boolean

    /** Whether to display the error message inline with the form item */
    inlineMessage?: boolean

    /** Controls the size of components in this form */
    size?: ElementUIComponentSize,
    tooltip?: string
    valueType?: WpFormItemValueType
    pattern?: WpFormItemPattern
    patternMsg?: string
    validator?: (rule: object, value: any, callback:() => void) => void
    tooltipPlacement?: PopoverPlacement
}
export declare class ElWpFormItem extends ElFormItem {
    tooltip: string
    valueType: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | string
    pattern: WpFormItemPattern
    patternMsg: string
    validator: (rule: object, value: any, callback:() => void) => void
    tooltipPlacement: PopoverPlacement
}
