import { ElementUIComponent } from './component'

/** Menu Item Component */
export declare class ElMenuItem extends ElementUIComponent {
  /** Unique identification */
  index: string
  disabled: boolean
  itemStyle: object
  activeStyle: object
  hoverStyle: object
  hoverBgIsActiveBg: boolean

  /** Vue Router object */
  route: object

}
