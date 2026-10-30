import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

interface StringInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function StringInput ({ value, onChange, placeholder }: StringInputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value ?? ''}
      onChangeText={onChange}
      placeholder={placeholder ?? 'Enter value'}
      placeholderTextColor='#999'
      autoCapitalize='none'
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
})
