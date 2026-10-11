import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'

interface BooleanInputProps {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}

export function BooleanInput ({ value, onChange }: BooleanInputProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{value ? 'true' : 'false'}</Text>
      <Switch
        value={!!value}
        onValueChange={onChange}
        trackColor={{ false: '#DDD', true: '#93C9FF' }}
        thumbColor={value ? '#2196F3' : '#f4f3f4'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
})
