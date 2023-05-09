import { ElementUIComponent, ElementUIFormComponentTriggerMethod, ElementUIFormComponentOptionData } from './component'

export type RadioGroupSize = 'large' | 'small'

/** Radio Group Component */
export declare class ElRadioGroup extends ElementUIComponent {
  /** The size of radio buttons */
  size: RadioGroupSize
  optionData: ElementUIFormComponentOptionData
  labelKey: string
  triggerMethod: ElementUIFormComponentTriggerMethod
  valueKey: string
  disabledKey: string

  /** Border and background color when button is active */
  fill: string

  /** Whether the nesting radios are disabled */
  disabled: boolean

  /** Font color when button is active */
  textColor: string
}
