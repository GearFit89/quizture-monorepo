import type { ViewStyle, TextStyle, ImageStyle } from 'react-native'

export type AnyStyle = ViewStyle | TextStyle | ImageStyle

/**
 * Level 2 / Level 3 container: maps a sub-element name (e.g. "header")
 * to its style object (e.g. { backgroundColor: "#fff", opacity: 0.9 }).
 */
export interface StyleClass {
  [elementName: string]: AnyStyle;
}

/**
 * Level 1 container: maps a top-level target/screen name (e.g. "home")
 * to the StyleClass map of its sub-elements.
 */
export interface StyleContent {
  [targetName: string]: StyleClass;
}

/** How a given style key's value should be edited in the UI. */
export type StyleValueType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'enum'
  | 'boolean'
  | 'string'

export interface StyleKeyMeta {
  key: string;
  type: StyleValueType;
  /** For "enum" type: the fixed set of valid values. */
  options?: string[];
  /** For "number" / "dimension": slider bounds. */
  min?: number;
  max?: number;
  step?: number;
  /** For "dimension": whether a % unit is a valid alternative to a raw number. */
  allowPercent?: boolean;
}

/** Path identifying exactly one style property being edited. */
export interface StylePropertyPath {
  target: string;
  element: string;
  styleKey: string;
}

/** Navigation levels for the bottom sheet drill-down flow. */
export type EditorLevel = 'targets' | 'elements' | 'properties' | 'addProperty'
