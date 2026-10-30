import React, { useState, useCallback } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { Copy, Check } from 'lucide-react-native'

interface CopyButtonProps {
  textToCopy: string;
  size?: number;
  color?: string;
  showLabel?: boolean;
}

export function CopyButton ({
  textToCopy,
  size = 18,
  color = '#64748B',
  showLabel = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [textToCopy])

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={8}
    >
      {copied
        ? (
          <Check size={size} color='#10B981' />
          )
        : (
          <Copy size={size} color={color} />
          )}

      {showLabel && (
        <Text style={[styles.label, copied && styles.copiedLabel]}>
          {copied ? 'Copied!' : 'Copy JSON'}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  copiedLabel: {
    color: '#10B981',
  },
})
