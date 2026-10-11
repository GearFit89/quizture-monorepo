import Slider from '@react-native-community/slider'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
}: NumberInputProps) {
  const current = value ?? min

  function nudge (delta: number) {
    const next = Math.min(max, Math.max(min, roundToStep(current + delta, step)))
    onChange(next)
  }

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.stepperBtn} onPress={() => nudge(-step)}>
          <Text style={styles.stepperText}>–</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.numericInput}
          value={String(current)}
          keyboardType='numeric'
          onChangeText={(t) => {
            const parsed = parseFloat(t)
            if (!Number.isNaN(parsed)) onChange(parsed)
          }}
        />
        <TouchableOpacity style={styles.stepperBtn} onPress={() => nudge(step)}>
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={current}
        onValueChange={onChange}
        minimumTrackTintColor='#2196F3'
        maximumTrackTintColor='#DDD'
      />
      <View style={styles.boundsRow}>
        <Text style={styles.boundsText}>{min}</Text>
        <Text style={styles.boundsText}>{max}</Text>
      </View>
    </View>
  )
}

function roundToStep (value: number, step: number): number {
  return Math.round(value / step) * step
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 20,
    color: '#333',
  },
  numericInput: {
    width: 90,
    textAlign: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 6,
    fontSize: 15,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  boundsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boundsText: {
    fontSize: 11,
    color: '#999',
  },
})
