import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface EnumInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: string[];
}

export function EnumInput ({ value, onChange, options }: EnumInputProps) {
  // Segmented control for short option sets, scrollable chips for longer ones.
  if (options.length <= 4) {
    return (
      <View style={styles.segmented}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.segment, value === opt && styles.segmentActive]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.segmentText, value === opt && styles.segmentTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.chipActive]}
            onPress={() => onChange(opt)}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F3',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: {
    fontSize: 13,
    color: '#888',
  },
  segmentTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F3',
  },
  chipActive: {
    backgroundColor: '#2196F3',
  },
  chipText: {
    fontSize: 13,
    color: '#555',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
