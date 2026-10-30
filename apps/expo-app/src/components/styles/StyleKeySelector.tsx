import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { STYLE_KEY_META } from '@/lib/styles/styleKeyMeta'
import { StyleKeyMeta } from '@/lib/styles'

interface StyleKeySelectorProps {
  /** Keys already applied on this element, so they can be excluded or flagged. */
  existingKeys: string[];
  onSelect: (key: string) => void;
}

export function StyleKeySelector ({ existingKeys, onSelect }: StyleKeySelectorProps) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = STYLE_KEY_META.filter((meta: StyleKeyMeta) => !existingKeys.includes(meta.key))
    if (!q) return all
    return all.filter((meta) => meta.key.toLowerCase().includes(q))
  }, [query, existingKeys])

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder='Search style properties…'
        placeholderTextColor='#999'
        autoCapitalize='none'
        autoCorrect={false}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.key}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onSelect(item.key)}>
            <Text style={styles.keyText}>{item.key}</Text>
            <Text style={styles.typeBadge}>{item.type}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No matching style properties</Text>}
        style={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  keyText: {
    fontSize: 15,
    color: '#222',
  },
  typeBadge: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#F0F0F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 24,
  },
})
