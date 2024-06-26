import { ElementUIComponent } from './component'
import { HorizontalAlignment, VertialAlignment } from './component'
/** Container Component */
export declare class ElContainer extends ElementUIComponent {
  /** Layout direction for child elements */
  direction: 'horizontal' | 'vertical'
  isAutoFlex: boolean
  justify: HorizontalAlignment
  align: VertialAlignment
  isWrap: boolean
  tag: string
}
