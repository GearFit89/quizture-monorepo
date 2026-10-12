import React from 'react'
import type { StyleKeyMeta } from '@/lib/styles/types'
import { BooleanInput } from './BooleanInput'
import { ColorInput } from './ColorInput'
import { DimensionInput } from './DimensionInput'
import { EnumInput } from './EnumInput'
import { NumberInput } from './NumberInput'
import { StringInput } from './StringInput'

interface StyleValueInputProps {
  meta: StyleKeyMeta;
  value: unknown;
  onChange: (value: unknown) => void;
}

/**
 * Renders the correct control for a style key based on its metadata type.
 * This is the single place that maps StyleValueType -> concrete component.
 */
export function StyleValueInput ({ meta, value, onChange }: StyleValueInputProps) {
  switch (meta.type) {
    case 'color':
      return <ColorInput value={value as string} onChange={onChange} />

    case 'dimension':
      return (
        <DimensionInput
          value={value as number | string}
          onChange={onChange}
          min={meta.min}
          max={meta.max}
          step={meta.step}
          allowPercent={meta.allowPercent}
        />
      )

    case 'number':
      return (
        <NumberInput
          value={value as number}
          onChange={onChange}
          min={meta.min}
          max={meta.max}
          step={meta.step}
        />
      )

    case 'enum':
      return (
        <EnumInput value={value as string} onChange={onChange} options={meta.options ?? []} />
      )

    case 'boolean':
      return <BooleanInput value={value as boolean} onChange={onChange} />

    case 'string':
    default:
      return <StringInput value={value as string} onChange={onChange} />
  }
}
