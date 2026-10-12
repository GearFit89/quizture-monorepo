import Slider from '@react-native-community/slider'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Unit = 'px' | '%'

interface DimensionInputProps {
  /** Raw stored value: either a number (px) or a string like "50%". */
  value: number | string | undefined;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  step?: number;
  allowPercent?: boolean;
}

function parseValue (value: number | string | undefined): { amount: number; unit: Unit } {
  if (typeof value === 'string' && value.endsWith('%')) {
    const amount = parseFloat(value)
    return { amount: Number.isNaN(amount) ? 0 : amount, unit: '%' }
  }
  if (typeof value === 'number') {
    return { amount: value, unit: 'px' }
  }
  return { amount: 0, unit: 'px' }
}

export function DimensionInput ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  allowPercent = false,
}: DimensionInputProps) {
  const parsed = parseValue(value)
  const [unit, setUnit] = useState<Unit>(parsed.unit)
  const amount = parsed.amount

  function emit (nextAmount: number, nextUnit: Unit) {
    onChange(nextUnit === '%' ? `${nextAmount}%` : nextAmount)
  }

  return (
    <View>
      {allowPercent && (
        <View style={styles.unitToggle}>
          {(['px', '%'] as Unit[]).map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.unitOption, unit === u && styles.unitOptionActive]}
              onPress={() => {
                setUnit(u)
                emit(amount, u)
              }}
            >
              <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.row}>
        <TextInput
          style={styles.numericInput}
          value={String(amount)}
          keyboardType='numeric'
          onChangeText={(t) => {
            const parsedNum = parseFloat(t)
            if (!Number.isNaN(parsedNum)) emit(parsedNum, unit)
          }}
        />
        <Text style={styles.unitSuffix}>{unit}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={unit === '%' ? 0 : min}
        maximumValue={unit === '%' ? 100 : max}
        step={step}
        value={amount}
        onValueChange={(v) => emit(v, unit)}
        minimumTrackTintColor='#2196F3'
        maximumTrackTintColor='#DDD'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  unitToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F3',
    borderRadius: 8,
    padding: 2,
    marginBottom: 10,
  },
  unitOption: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unitOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  unitText: {
    fontSize: 13,
    color: '#888',
  },
  unitTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  numericInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  unitSuffix: {
    marginLeft: 8,
    fontSize: 14,
    color: '#888',
    width: 24,
  },
  slider: {
    width: '100%',
    height: 36,
  },
})
