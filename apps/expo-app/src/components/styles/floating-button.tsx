import React, { useRef, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text } from 'react-native'
import { StyleEditorSheet, StyleEditorSheetRef } from './StyleEditorSheet'
import type { StyleContent } from '@/lib/styles/types'

interface FloatingStyleEditorButtonProps {

  onStylesChange?: (next: StyleContent) => void;
  /** Corner to dock in. Defaults to bottom-right. */
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * A floating, always-on-top toggle (like a devtools inspector button)
 * that opens the Modal-based StyleEditorSheet. Render this once,
 * anywhere in your tree above/alongside the screens you want to edit --
 * it doesn't need to be inside anything special (no GestureHandlerRootView
 * required, since the Modal version has no gesture-handler dependency).
 */
export function FloatingStyleEditorButton ({

  onStylesChange,
  position = 'bottom-right',
}: FloatingStyleEditorButtonProps) {
  const sheetRef = useRef<StyleEditorSheetRef>(null)
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    if (isOpen) {
      sheetRef.current?.close()
    } else {
      sheetRef.current?.open()
    }
    // Don't flip `isOpen` here -- wait for onOpenChange below, which
    // fires for this tap AND for backdrop-tap/back-button dismissal,
    // so the icon never gets out of sync with what's on screen.
  }

  return (
    <>
      <Pressable
        onPress={toggle}
        style={[
          styles.fab,
          position === 'bottom-right' ? styles.bottomRight : styles.bottomLeft,
        ]}
        hitSlop={8}
      >
        <Text style={styles.fabIcon}>{isOpen ? '✕' : '🎨'}</Text>
      </Pressable>

      <StyleEditorSheet
        ref={sheetRef}

        onStylesChange={onStylesChange}
        onOpenChange={setIsOpen}
      />
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    // Android needs elevation to establish stacking; zIndex alone
    // does nothing on Android without it.
    elevation: 6,
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  bottomRight: { right: 20 },
  bottomLeft: { left: 20 },
  fabIcon: { fontSize: 22 },
})
