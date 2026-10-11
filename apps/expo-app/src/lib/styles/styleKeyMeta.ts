import type { StyleKeyMeta } from './types'

/**
 * One entry per style prop this editor understands. `type` drives which
 * input control is rendered by <StyleValueInput />.
 *
 * Not every valid RN style prop is listed here on purpose — this mirrors
 * the prop list from the View / Text / Image style docs referenced in the
 * spec. Add more entries the same way to extend coverage.
 */
export const STYLE_KEY_META: StyleKeyMeta[] = [
  // ---- Color ----
  { key: 'backgroundColor', type: 'color' },
  { key: 'borderBottomColor', type: 'color' },
  { key: 'borderBlockColor', type: 'color' },
  { key: 'borderBlockEndColor', type: 'color' },
  { key: 'borderBlockStartColor', type: 'color' },
  { key: 'borderColor', type: 'color' },
  { key: 'borderEndColor', type: 'color' },
  { key: 'borderLeftColor', type: 'color' },
  { key: 'borderRightColor', type: 'color' },
  { key: 'borderStartColor', type: 'color' },
  { key: 'borderTopColor', type: 'color' },
  { key: 'outlineColor', type: 'color' },
  { key: 'textDecorationColoriOS', type: 'color' },
  { key: 'textShadowColor', type: 'color' },
  { key: 'color', type: 'color' },

  // ---- Dimension (numeric, some support % too) ----
  { key: 'borderBottomEndRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderBottomLeftRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderBottomRightRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderBottomStartRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderStartEndRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderStartStartRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderEndEndRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderEndStartRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderBottomWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'borderLeftWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'borderRightWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'borderTopWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'borderTopEndRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderTopLeftRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderTopRightRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderTopStartRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'borderWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'borderRadius', type: 'dimension', min: 0, max: 100, step: 1 },
  { key: 'outlineOffset', type: 'dimension', min: -20, max: 20, step: 1 },
  { key: 'outlineWidth', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'letterSpacing', type: 'dimension', min: -5, max: 20, step: 0.5 },
  { key: 'lineHeight', type: 'dimension', min: 0, max: 80, step: 1 },
  { key: 'fontSize', type: 'dimension', min: 8, max: 96, step: 1 },
  { key: 'textShadowRadius', type: 'dimension', min: 0, max: 20, step: 1 },
  { key: 'width', type: 'dimension', min: 0, max: 400, step: 1, allowPercent: true },
  { key: 'height', type: 'dimension', min: 0, max: 400, step: 1, allowPercent: true },
  { key: 'margin', type: 'dimension', min: 0, max: 100, step: 1, allowPercent: true },
  { key: 'padding', type: 'dimension', min: 0, max: 100, step: 1, allowPercent: true },

  // ---- Plain number (no unit) ----
  { key: 'opacity', type: 'number', min: 0, max: 1, step: 0.05 },
  { key: 'elevationAndroid', type: 'number', min: 0, max: 24, step: 1 },
  { key: 'zIndex', type: 'number', min: -10, max: 10, step: 1 },
  { key: 'flex', type: 'number', min: 0, max: 10, step: 1 },

  // ---- Enum ----
  { key: 'backfaceVisibility', type: 'enum', options: ['visible', 'hidden'] },
  { key: 'borderCurveiOS', type: 'enum', options: ['circular', 'continuous'] },
  { key: 'borderStyle', type: 'enum', options: ['solid', 'dotted', 'dashed'] },
  { key: 'cursoriOS', type: 'enum', options: ['auto', 'pointer'] },
  { key: 'outlineStyle', type: 'enum', options: ['solid', 'dotted', 'dashed'] },
  {
    key: 'pointerEvents',
    type: 'enum',
    options: ['auto', 'none', 'box-none', 'box-only'],
  },
  { key: 'mixBlendMode', type: 'enum', options: ['normal', 'multiply', 'screen', 'overlay'] },
  { key: 'userSelect', type: 'enum', options: ['auto', 'text', 'none', 'contain', 'all'] },
  { key: 'fontStyle', type: 'enum', options: ['normal', 'italic'] },
  {
    key: 'fontWeight',
    type: 'enum',
    options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    key: 'fontVariant',
    type: 'enum',
    options: ['small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums'],
  },
  {
    key: 'textAlign',
    type: 'enum',
    options: ['auto', 'left', 'right', 'center', 'justify'],
  },
  {
    key: 'textAlignVerticalAndroid',
    type: 'enum',
    options: ['auto', 'top', 'bottom', 'center'],
  },
  {
    key: 'textDecorationLine',
    type: 'enum',
    options: ['none', 'underline', 'line-through', 'underline line-through'],
  },
  { key: 'textDecorationStyleiOS', type: 'enum', options: ['solid', 'double', 'dotted', 'dashed'] },
  {
    key: 'textTransform',
    type: 'enum',
    options: ['none', 'uppercase', 'lowercase', 'capitalize'],
  },
  { key: 'verticalAlignAndroid', type: 'enum', options: ['auto', 'top', 'bottom', 'middle'] },
  { key: 'writingDirectioniOS', type: 'enum', options: ['auto', 'ltr', 'rtl'] },
  {
    key: 'flexDirection',
    type: 'enum',
    options: ['row', 'row-reverse', 'column', 'column-reverse'],
  },
  {
    key: 'alignItems',
    type: 'enum',
    options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
  },
  {
    key: 'justifyContent',
    type: 'enum',
    options: [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
    ],
  },
  { key: 'display', type: 'enum', options: ['flex', 'none'] },

  // ---- Boolean ----
  { key: 'includeFontPaddingAndroid', type: 'boolean' },

  // ---- Freeform string / not worth a dedicated control ----
  { key: 'backgroundImage', type: 'string' },
  { key: 'boxShadow', type: 'string' },
  { key: 'filter', type: 'string' },
  { key: 'experimental_backgroundPosition', type: 'string' },
  { key: 'experimental_backgroundRepeat', type: 'string' },
  { key: 'experimental_backgroundSize', type: 'string' },
  { key: 'fontFamily', type: 'string' },
  { key: 'textShadowOffset', type: 'string' },
]

export const STYLE_KEY_META_MAP: Record<string, StyleKeyMeta> = STYLE_KEY_META.reduce(
  (acc, meta) => {
    acc[meta.key] = meta
    return acc
  },
  {} as Record<string, StyleKeyMeta>
)

/** Fallback used if a key exists in data but has no known metadata. */
export const DEFAULT_STYLE_KEY_META = (key: string): StyleKeyMeta => ({
  key,
  type: 'string',
})

export function getStyleKeyMeta (key: string): StyleKeyMeta {
  return STYLE_KEY_META_MAP[key] ?? DEFAULT_STYLE_KEY_META(key)
}
