import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { RadioGroup } from '@/components/ui/radio-group'
import { QuestionFilterOption, FilterOptionType, FilterOptionVariant } from './question-filter-option'

export interface FilterOptionDef {
  label: string;
  value: string;
  disabled?: boolean;
}

interface BaseProps {
  title: string;
  name: string;
  options: FilterOptionDef[] | string[];
  type: FilterOptionType;
  isWrapLayout?: boolean
  className?: string;
  variant?: FilterOptionVariant;
}

interface SingleProps extends BaseProps {
  type: 'single';
  value: string;
  onChange: (value: string) => void;
}

interface MultiProps extends BaseProps {
  type: 'multi';
  value: string[];
  onChange: (value: string[]) => void;
}

export type QuestionFilterSectionProps = SingleProps | MultiProps

/**
 * Titled group of QuestionFilterOptions.
 *
 * - type="single": wraps the options in a real RN Reusables <RadioGroup>
 *   (backed by @rn-primitives/radio-group), so exclusivity, a11y roles,
 *   and press handling all come from the primitive itself.
 * - type="multi": renders standalone Checkbox-backed options, each
 *   toggling independently in an array.
 *
 * Usage:
 *   <QuestionFilterSection
 *     title="Verse Selection"
 *     type="single"
 *     name="verseSelection"
 *     options={[
 *       { label: 'Random', value: 'random' },
 *       { label: 'By Reference', value: 'byReference' },
 *       { label: 'Alphabetically', value: 'alphabet' },
 *     ]}
 *     value={verseSelection}
 *     onChange={setVerseSelection}
 *   />
 */
export function QuestionFilterSection (props: QuestionFilterSectionProps) {
  const { title, name, options, className } = props

  if (props.type === 'single') {
    return (
      <View className={className ?? 'mb-6'}>
        {title ? <Text className='mb-2 text-lg font-semibold'>{title}</Text> : null}
        <RadioGroup value={props.value} onValueChange={props.onChange} className='gap-1'>
          <View className={props.isWrapLayout ? 'flex-row flex-wrap gap-2' : 'gap 1'}>
            {options.map((opt) => (
              <QuestionFilterOption
                key={`${name}-${opt}`}
                type='single'
                name={name}
                value={typeof opt === 'string' ? opt : opt.value}
                label={typeof opt === 'string' ? opt : opt.label}
                checked={props.value.includes(typeof opt === 'string' ? opt : opt.value)}
                variant={props.variant}

              // Use the onChange from the parent QuestionFilterSection
                onChange={(_n, v) => props.onChange(v)}
                disabled={typeof opt === 'string' ? false : opt.disabled}
              />
            ))}
          </View>
        </RadioGroup>
      </View>
    )
  }

  const handleMultiChange = (_name: string, optionValue: string, checked: boolean) => {
    if (props.value.length === 1 && props.value.includes(_name)) {
      // Makes completely empty states impossible
      props.onChange(props.value)
      return
    }
    // Either rm or add a item if checked
    const next = checked
      ? [...props.value, optionValue]
      : props.value.filter((v) => v !== optionValue)
    props.onChange(next)
  }

  return (
    <View className={className ?? 'mb-6'}>
      {title ? <Text className='mb-2 text-lg font-semibold'>{title}</Text> : null}
      <View className={props.isWrapLayout ? 'flex-row flex-wrap gap-2' : 'gap 1'}>
        {options.map((opt) => (
          <QuestionFilterOption
            key={`${name}-${typeof opt === 'string' ? opt : opt.value}`}
            type='multi'
            variant={props.variant}
            name={name}
            value={typeof opt === 'string' ? opt : opt.value}
            label={typeof opt === 'string' ? opt : opt.label}
            checked={props.value.includes(typeof opt === 'string' ? opt : opt.value)}
            onChange={handleMultiChange}
            disabled={typeof opt === 'string' ? false : opt.disabled}
          />
        ))}
      </View>
    </View>
  )
}
