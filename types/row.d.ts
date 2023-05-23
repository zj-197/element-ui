import { ElementUIComponent, HorizontalAlignment, VertialAlignment } from './component'



/** Row Layout Component */
export declare class ElRow extends ElementUIComponent {
  /** Grid spacing */
  gutter: number
  isWrap: boolean

  /** Layout mode. You can use flex. Works in modern browsers */
  type: string

  /** Horizontal alignment of flex layout */
  justify: HorizontalAlignment

  /** Vertical alignment of flex layout */
  align: VertialAlignment

  /** Custom element tag */
  tag: string
}
