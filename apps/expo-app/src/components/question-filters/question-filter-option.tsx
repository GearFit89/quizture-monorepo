import * as React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStyleTarget } from "@/hooks";
import { AnyStyle } from "@/lib/styles";

export type FilterOptionType = "single" | "multi";
export type FilterOptionVariant = "checkbox" | "circle" | "block";

export interface QuestionFilterOptionProps {
  /**
   * 'multi'  -> renders an rn-primitives Checkbox (fully standalone).
   * 'single' -> renders an rn-primitives RadioGroupItem. This MUST be
   *             rendered inside a <RadioGroup> (see QuestionFilterSection),
   *             since RadioGroupItem relies on RadioGroup's context for
   *             exclusivity — that's how @rn-primitives/radio-group works.
   *
   *             NOTE: this only applies when variant === 'checkbox'. For
   *             'circle' and 'block' there is no native indicator to drive,
   *             so selection is controlled purely via the `checked` prop —
   *             don't wrap those in <RadioGroup>, just pass the right
   *             `checked` value per option from the parent.
   */
  type: FilterOptionType;
  /** visual style of the option. Defaults to 'checkbox' (original behavior). */
  variant?: FilterOptionVariant;
  /** field name this option belongs to, e.g. "verseSelection" or "month" */
  name: string;
  /** underlying value, e.g. "random" or "october" */
  value: string;
  /** label text shown next to (or inside) the control */
  label: string;
  /** whether this option is currently checked/selected. Ignored for
   *  type='single' + variant='checkbox' (RadioGroup derives it there),
   *  but used directly for every other combination. */
  checked: boolean;
  /** fired when the user taps an option. For 'single' + 'checkbox' this is
   *  bypassed in favor of the parent RadioGroup's onValueChange. */
  onChange: (name: string, value: string, checked: boolean) => void;
  disabled?: boolean;
}

const COLORS = {
  border: "#cbd5e1", // slate-300, matches .chapter-circle / .book-accordion-item border
  borderHover: "#94a3b8", // slate-400
  text: "#334155", // slate-700
  selectedBg: "#2563eb", // blue-600
  selectedBorder: "#2563eb",
  selectedText: "#ffffff",
};

const shadowStyle = StyleSheet.create({
  selected: {
    shadowColor: COLORS.selectedBg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3, // Android
  },
});

/**
 * Atomic filter option, built on the real RN Reusables primitives
 * (@rn-primitives/checkbox and @rn-primitives/radio-group under the hood)
 * for the 'checkbox' variant, or a plain Pressable "chip" for 'circle'/'block'.
 *
 * Usage (multi/checkbox — fully standalone):
 *   <QuestionFilterOption
 *     type="multi"
 *     name="month"
 *     value="january"
 *     label="January"
 *     checked={months.includes('january')}
 *     onChange={(name, value, checked) => toggleMonth(value, checked)}
 *   />
 *
 * Usage (single/radio — must sit inside a <RadioGroup>, which
 * QuestionFilterSection sets up for you automatically):
 *   <RadioGroup value={verseSelection} onValueChange={setVerseSelection}>
 *     <QuestionFilterOption type="single" name="verseSelection" value="random" label="Random" checked={false} onChange={() => {}} />
 *   </RadioGroup>
 *
 * Usage (circle — e.g. numbered chapter picker, no RadioGroup needed):
 *   <QuestionFilterOption
 *     type="single"
 *     variant="circle"
 *     name="chapter"
 *     value="23"
 *     label="23"
 *     checked={selectedChapter === "23"}
 *     onChange={(name, value) => setSelectedChapter(value)}
 *   />
 *
 * Usage (block — plain white/blue selectable rectangle):
 *   <QuestionFilterOption
 *     type="multi"
 *     variant="block"
 *     name="month"
 *     value="january"
 *     label="January"
 *     checked={months.includes('january')}
 *     onChange={(name, value, checked) => toggleMonth(value, checked)}
 *   />
 */
export function QuestionFilterOption({
  type,
  variant = "checkbox",
  name,
  value,
  label,
  checked,
  onChange,
  disabled,
}: QuestionFilterOptionProps) {
  const labelId = `label-for-${name}-${value}`;

  const { styles } = useStyleTarget("questionFilter")

  
  if (variant === "circle" || variant === "block") {
    const handlePress = () => {
      if (disabled) return;
      onChange(name, value, type === "single" ? true : !checked);
    };

    const isCircle = variant === "circle";

    return (
     <Pressable
  onPress={handlePress}
  disabled={disabled}
  accessibilityRole={type === "single" ? "radio" : "checkbox"}
  accessibilityState={{ checked, disabled }}
  nativeID={labelId}
  style={[
    isCircle ? styles.circleBase  : styles.blockBase ,
    {
      backgroundColor: checked ? COLORS.selectedBg : "#ffffff",
      borderColor: checked ? COLORS.selectedBorder : COLORS.border,
    },
    checked && shadowStyle.selected,
    disabled && styles.disabled,
  ]}
>
  <View pointerEvents="none">
    <Label
      className="native:text-sm font-semibold text-center"
      style={{ color: checked ? COLORS.selectedText : COLORS.text }}
    >
      {label}
    </Label>
  </View>
</Pressable>
    );
  }

  // --- 'checkbox' variant (original behavior, unchanged) ---
  if (type === "multi") {
    const handlePress = () => {
      if (!disabled) onChange(name, value, !checked);
    };
    return (
      <View className="flex-row items-center gap-3 py-2">
        <Checkbox
          checked={checked}
          onCheckedChange={handlePress}
          disabled={disabled}
        />
        <Label
          nativeID={labelId}
          onPress={handlePress}
          className="native:text-base flex-1"
        >
          {label}
        </Label>
      </View>
    );
  }

  // type === 'single' — relies on an ancestor RadioGroup for state/exclusivity
  return (
    <View className="flex-row items-center gap-3 py-2">
      <RadioGroupItem
        aria-labelledby={labelId}
        value={value}
        disabled={disabled}
      />
      <Label
        nativeID={labelId}
        className="native:text-base flex-1"
        onPress={() => {
          if (disabled) return;
          onChange(name, value, true);
        }}
      >
        {label}
      </Label>
    </View>
  );
}

