import Vue from 'vue'

/** ElementUI component common definition */
export declare class ElementUIComponent extends Vue {
  /** Install component into Vue */
  static install (vue: typeof Vue): void
}

/** Component size definition for button, input, etc */
export type ElementUIComponentSize = 'large' | 'medium' | 'small' | 'mini'

/** Horizontal alignment */
export type ElementUIHorizontalAlignment = 'left' | 'center' | 'right'
/** OptionData */
type OptionData = object

export type ElementUIFormComponentOptionData<T = OptionData> = (() => Promise<any>) | Array<T>
/** triggerMethod */
export type ElementUIFormComponentTriggerMethod = 'immediate' | 'focus'

/** Horizontal alignment of flex layout */
export type HorizontalAlignment = 'start' | 'end' | 'center' | 'space-around' | 'space-between'

/** vertical alignment of flex layout */
export type VertialAlignment = 'top' | 'middle' | 'bottom'
