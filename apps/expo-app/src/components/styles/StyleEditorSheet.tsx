import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleKeySelector } from './StyleKeySelector'
import { StyleValueInput } from '@/components/styles/inputs/StyleValueInput'
import { getStyleKeyMeta } from '@/lib/styles/styleKeyMeta'
import type { EditorLevel, StyleContent } from '@/lib/styles/types'
import { useStyles } from '@/hooks'
import { CopyButton } from '../cpoy-button'
import { Button } from '../ui/button'

export interface StyleEditorSheetRef {
  open: () => void;
  close: () => void;
}

interface StyleEditorSheetProps {

  /** Called whenever any style value changes, with the full updated tree. */
  onStylesChange?: (next: StyleContent) => void;
  /**
   * Fires whenever the sheet's actual visibility changes, for ANY
   * reason -- backdrop tap / Android back button as well as
   * open()/close() calls. Use this to keep an external toggle
   * button's icon in sync.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * A modal sheet that lets a user drill down:
 *   targets (screens) -> elements (sub-parts) -> properties (style keys)
 * and edit each style value with a type-appropriate control.
 *
 * Built on core React Native (Modal + FlatList) -- no
 * react-native-gesture-handler / reanimated / @gorhom/bottom-sheet
 * dependency, so it behaves the same on Expo Go, web, and native.
 * You lose drag-to-resize and swipe-to-dismiss; everything else
 * (navigation, state, inputs) is unchanged from the bottom-sheet version.
 */
export const StyleEditorSheet = forwardRef<StyleEditorSheetRef, StyleEditorSheetProps>(
  ({ onStylesChange, onOpenChange }, ref) => {
    const [visible, setVisible] = useState(false)
    const { stylesContent, setStyleProperty, removeStyleProperty, exportJSON, resetStyles } =
      useStyles()

    const [level, setLevel] = useState<EditorLevel>('targets')
    const [activeTarget, setActiveTarget] = useState<string | null>(null)
    const [activeElement, setActiveElement] = useState<string | null>(null)

    const setOpen = useCallback(
      (next: boolean) => {
        setVisible(next)
        onOpenChange?.(next)
      },
      [onOpenChange]
    )

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }))

    const emitChange = useCallback(
      (target: string, element: string, key: string, value: unknown) => {
        setStyleProperty(target, element, key, value as never)
      },
      [setStyleProperty]
    )

    // Notify the parent with the post-update tree, not a stale pre-update
    // snapshot (state updates are async/batched).
    useEffect(() => {
      onStylesChange?.(stylesContent)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stylesContent])

    // ---- Navigation helpers ----
    function goToTargets () {
      setLevel('targets')
      setActiveTarget(null)
      setActiveElement(null)
    }
    function goToElements (target: string) {
      setActiveTarget(target)
      setActiveElement(null)
      setLevel('elements')
    }
    function goToProperties (element: string) {
      setActiveElement(element)
      setLevel('properties')
    }
    function goBack () {
      if (level === 'addProperty') setLevel('properties')
      else if (level === 'properties') setLevel('elements')
      else if (level === 'elements') goToTargets()
    }

    const targetNames = useMemo(() => Object.keys(stylesContent), [stylesContent])
    const elementNames = useMemo(
      () => (activeTarget ? Object.keys(stylesContent[activeTarget] ?? {}) : []),
      [stylesContent, activeTarget]
    )
    const activeStyleObject =
      activeTarget && activeElement ? stylesContent[activeTarget]?.[activeElement] ?? {} : {}
    const propertyEntries = useMemo(
      () => Object.entries(activeStyleObject),
      [activeStyleObject]
    )

    const headerTitle =
      level === 'targets'
        ? 'Screens'
        : level === 'elements'
          ? activeTarget ?? ''
          : level === 'properties'
            ? `${activeTarget} · ${activeElement}`
            : 'Add Style Property'

    return (
      <Modal
        visible={visible}
        transparent
        animationType='slide'
        onRequestClose={() => setOpen(false)} // Android hardware back button
      >
        {/* Tapping the dimmed backdrop closes the sheet, same as
            swipe-to-dismiss did before. */}
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* Stop backdrop's onPress from firing when tapping inside
              the sheet itself. */}
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <SafeAreaView style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                {level !== 'targets'
                  ? (
                    <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                      <Text style={styles.backText}>‹ Back</Text>
                    </TouchableOpacity>
                    )
                  : (
                    <View style={styles.backBtn} />
                    )}
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {headerTitle}
                </Text>
                <TouchableOpacity onPress={() => setOpen(false)} style={styles.backBtn}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>

              <CopyButton textToCopy={exportJSON()} />
              <Button onPress={resetStyles}><Text>Reset Styles</Text></Button>

              {/* Level 1: Targets */}
              {level === 'targets' && (
                <FlatList
                  data={targetNames}
                  keyExtractor={(item) => item}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => goToElements(item)}>
                      <Text style={styles.cardTitle}>{item}</Text>
                      <Text style={styles.cardSubtitle}>
                        {Object.keys(stylesContent[item] ?? {}).length} elements
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              {/* Level 2: Elements */}
              {level === 'elements' && activeTarget && (
                <FlatList
                  data={elementNames}
                  keyExtractor={(item) => item}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => goToProperties(item)}>
                      <Text style={styles.cardTitle}>{item}</Text>
                      <Text style={styles.cardSubtitle}>
                        {Object.keys(stylesContent[activeTarget]?.[item] ?? {}).length} properties
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}

              {/* Level 3: Properties */}
              {level === 'properties' && activeTarget && activeElement && (
                <View style={styles.propertiesContainer}>
                  <TouchableOpacity
                    style={styles.addPropertyBtn}
                    onPress={() => setLevel('addProperty')}
                  >
                    <Text style={styles.addPropertyText}>+ Add Style Property</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={propertyEntries}
                    keyExtractor={([key]) => key}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: [key, value] }) => {
                      const meta = getStyleKeyMeta(key)
                      return (
                        <View style={styles.propertyRow}>
                          <View style={styles.propertyHeader}>
                            <Text style={styles.propertyKey}>{key}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                removeStyleProperty(activeTarget, activeElement, key)}
                            >
                              <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                          </View>
                          <StyleValueInput
                            meta={meta}
                            value={value}
                            onChange={(next) =>
                              emitChange(activeTarget, activeElement, key, next)}
                          />
                        </View>
                      )
                    }}
                    ListEmptyComponent={
                      <Text style={styles.emptyText}>
                        No style properties yet — add one above.
                      </Text>
                    }
                  />
                </View>
              )}

              {/* Add-property search flow */}
              {level === 'addProperty' && activeTarget && activeElement && (
                <StyleKeySelector
                  existingKeys={Object.keys(activeStyleObject)}
                  onSelect={(key) => {
                    const meta = getStyleKeyMeta(key)
                    const defaultValue =
                      meta.type === 'boolean'
                        ? false
                        : meta.type === 'number' || meta.type === 'dimension'
                          ? meta.min ?? 0
                          : meta.type === 'enum'
                            ? meta.options?.[0] ?? ''
                            : meta.type === 'color'
                              ? '#000000'
                              : ''
                    emitChange(activeTarget, activeElement, key, defaultValue)
                    setLevel('properties')
                  }}
                />
              )}
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    )
  }
)

StyleEditorSheet.displayName = 'StyleEditorSheet'

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    // Fixed height stand-in for what snap points used to give you.
    // Bump this or make it a prop if 75% doesn't suit your content.
    height: '40%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    marginBottom: 8,
  },
  backBtn: {
    width: 64,
  },
  backText: {
    fontSize: 15,
    color: '#2196F3',
  },
  closeText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'right',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  listContent: {
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    backgroundColor: '#F7F7FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  propertiesContainer: {
    flex: 1,
  },
  addPropertyBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  addPropertyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  propertyRow: {
    backgroundColor: '#F7F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  propertyKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  removeText: {
    fontSize: 12,
    color: '#F44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 24,
  },
})
