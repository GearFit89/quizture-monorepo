import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import ColorPicker, { Panel1, HueSlider, OpacitySlider } from 'reanimated-color-picker'
import { theme } from '@/lib/theme'

// Visual fallback mapping for React Native Native (iOS/Android) standard StyleSheet rendering
const THEME_FALLBACKS: Record<keyof typeof theme.colors, string> = {
  'primary-blue': theme.colors['primary-blue'],
  primary: '#6366F1',
  "primary-foreground": '#FFFFFF',
  secondary: '#EC4899',
  "secondary-foreground": '#FFFFFF',
  accent: '#8B5CF6',
  accentForeground: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#0F172A',
  card: '#FFFFFF',
  cardForeground: '#0F172A',
  muted: '#F1F5F9',
  mutedForeground: '#64748B',
  border: '#E2E8F0',
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',
  success: '#10B981',
  successForeground: '#FFFFFF',
}

interface CustomColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

/**
 * Helper to ensure `reanimated-color-picker` receives a valid parseable color
 * even when passed a CSS variable like `rgb(var(--primary) / <alpha-value>)`
 */
function resolvePickerSafeColor (colorStr: string): string {
  if (!colorStr) return '#6366F1'

  // If it's a theme token key (e.g. "primary")
  if (colorStr in THEME_FALLBACKS) {
    return THEME_FALLBACKS[colorStr as keyof typeof theme.colors]
  }

  // If it contains a CSS variable string
  if (colorStr.includes('var(')) {
    const matchedEntry = Object.entries(theme.colors).find(([_, val]) => val === colorStr)
    if (matchedEntry) {
      return THEME_FALLBACKS[matchedEntry[0] as keyof typeof theme.colors] ?? '#6366F1'
    }
    return '#6366F1' // Default safe color
  }

  return colorStr
}

export function ColorInput ({ value = '#6366F1', onChange, label }: CustomColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(value)

  useEffect(() => {
    if (value && value !== selectedColor) {
      setSelectedColor(value)
    }
  }, [value])

  const handleColorChange = (nextColor: string) => {
    setSelectedColor(nextColor)
    onChange?.(nextColor)
  }

  // Find if current selected color matches a theme key
  const matchedThemeKey = Object.keys(theme.colors).find(
    (key) => theme.colors[key as keyof typeof theme.colors] === selectedColor
  )

  // Resolution for the custom <View style={{ backgroundColor }}> block
  const displayColor = matchedThemeKey
    ? THEME_FALLBACKS[matchedThemeKey as keyof typeof theme.colors]
    : selectedColor

  const pickerSafeValue = resolvePickerSafeColor(selectedColor)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* --- CUSTOM PREVIEW BLOCK --- */}
      <View style={styles.previewContainer}>
        <View style={styles.previewRow}>
          {/* Main View with dynamic backgroundColor style supporting CSS vars */}
          <View style={[styles.customPreviewSwatch, { backgroundColor: displayColor }]}>
            {matchedThemeKey && (
              <View style={styles.varBadge}>
                <Text style={styles.varBadgeText}>var</Text>
              </View>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={selectedColor}
              onChangeText={handleColorChange}
              placeholder='#RRGGBB or var(...)'
              placeholderTextColor='#94A3B8'
              autoCapitalize='none'
              autoCorrect={false}
            />
            {matchedThemeKey && (
              <Text style={styles.tokenSubtext}>Theme Token: {matchedThemeKey}</Text>
            )}
          </View>
        </View>
      </View>

      {/* --- QUICK THEME TOKENS SELECTOR --- */}
      <Text style={styles.sectionHeader}>Theme Variables</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tokenScroll}>
        <View style={styles.tokenRow}>
          {(Object.keys(theme.colors) as Array<keyof typeof theme.colors>).map((key) => {
            const tokenVal = theme.colors[key]
            const isSelected = selectedColor === tokenVal
            const fallbackHex = THEME_FALLBACKS[key]

            return (
              <TouchableOpacity
                key={key}
                style={[styles.tokenChip, isSelected && styles.tokenChipSelected]}
                onPress={() => handleColorChange(tokenVal)}
              >
                <View style={[styles.tokenDot, { backgroundColor: fallbackHex }]} />
                <Text style={styles.tokenText}>{key}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>

      {/* --- REANIMATED COLOR PICKER --- */}
      <Text style={styles.sectionHeader}>Custom Spectrum Wheel</Text>
      <ColorPicker
        style={styles.pickerContainer}
        value={pickerSafeValue}
        onComplete={({ hex }) => handleColorChange(hex)}
      >
        {/* Color Wheel / Selection Panel */}
        <Panel1 style={styles.panel} />

        {/* Hue Slider */}
        <HueSlider style={styles.slider} />

        {/* Opacity Slider */}
        <OpacitySlider style={styles.slider} />
      </ColorPicker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 10,
  },
  previewContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customPreviewSwatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  varBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderTopRightRadius: 4,
  },
  varBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  tokenSubtext: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 4,
  },
  tokenScroll: {
    marginBottom: 16,
  },
  tokenRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tokenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  tokenChipSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  tokenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tokenText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  pickerContainer: {
    width: '100%',
  },
  panel: {
    borderRadius: 12,
    height: 160,
    marginBottom: 12,
  },
  slider: {
    borderRadius: 10,
    height: 20,
    marginBottom: 12,
  },
})
