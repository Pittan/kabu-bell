/**
 * # Chart Design specification
 *
 * - Chart aspect-ratio ... 16:10
 * ┌──────────────────────────────────────────┐ ───
 * │                Island name               │  │ header ... 1/10 of height
 * │ ┌ - - - - - - - - - - - - - - - - - - -┐ │ ───
 * │ │       │     │     │     │     │      │ │  │
 * │ │       │     │     │     │     │      │ │  │ Chart area
 * │ │       │     │     │     │     │      │ │  │
 * │ │       │     │     │     │     │      │ │  │
 * │ │ 16    │     │     │     │     │      │ │  │
 * │ │-│     │     │     │     │     │      │ │  │
 * │ ■-□- - - - - - - - - - - - - - - - - - ┘ │ ───
 * │     Mon   Tue   Wed   Thu   Fri   Sat    │  │ footer 20px
 * └──────────────────────────────────────────┘ ───
 * │─│                                      │─│
 *  Padding: 8 (offsetX)                     Padding: 8 (offsetX)
 *
 *  ■ ... Chart Origin
 *  □ ... Chart internal Origin
 */

export const FONT_SIZE_12PX = '12px sans-serif'
export const FONT_SIZE_10PX = '10px sans-serif'
export const FONT_SIZE_8PX = '8px sans-serif'

/**
 * Color definition
 *
 */
export const GRAPH_FILL_COLOR = '#427B00'
export const GRAPH_STROKE_COLOR = '#427B00'

export const BG_1 = '#FFEFDD'
export const BG_2 = '#E8D4BD'
export const BG_WHITE = '#FFFFFF'

export const WEEKDAY_LABEL_COLOR = '#616161'
export const GRAPH_PLOT_COLOR = '#424242'

export const BASE_PRICE_COLOR = 'rgb(129,55,0)'
export const BASE_PRICE_COLOR_TRANSPARENT = 'rgba(129,55,0, .6)'

export const GUIDE_BACKGROUND_COLOR = 'rgba(255, 255, 255, .8)'

export const FOOTER_HEIGHT = 20
export const CHART_INTERNAL_PADDING_X = 16
export const CHART_EXTERNAL_PADDING_X = 8
