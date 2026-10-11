import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
// 1. Swap useActor for useSelector
import { useSelector } from '@xstate/react';
import type { AnyActorRef } from 'xstate';
import { getMonitorEvents } from './monitor-events';
import { RootActorContext } from '@/context';

export function MachineMonitorPanel({ actorRef }: { actorRef: AnyActorRef}) {
  // 2. Safely subscribe to the live snapshot using useSelector
  const state = useSelector(actorRef, (snapshot) => snapshot);

  const formatJSON = (data: any) => JSON.stringify(data, null, 2);

  // Guard clause in case the actor hasn't fully initialized its first snapshot
  if (!state) return null;
  const events = getMonitorEvents(state);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>🤖 XState Live Monitor</Text>

      {/* 1. CURRENT STATE VALUE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current State:</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{formatJSON(state.value)}</Text>
        </View>
      </View>

      {/* 2. CONTEXT (DATA) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Context (Data):</Text>
        <View style={styles.codeBlock}>
          <Text style={[styles.codeText, { color: '#ffb86c' }]}>
            {formatJSON(state.context)}
          </Text>
        </View>
      </View>

      {/* 3. NEXT AVAILABLE EVENTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events You Can Send:</Text>
        <View style={styles.buttonContainer}>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No active transitions available</Text>
          ) : (
            events.map((eventName: string) => (
              <TouchableOpacity
                key={eventName}
                style={styles.eventButton}
                onPress={() => {
                  if (eventName === 'RATE') actorRef.send({ type: 'RATE', value: 5 });
                  else if (eventName === 'TYPE') actorRef.send({ type: 'TYPE', text: 'Native rocks!' });
                  else actorRef.send({ type: eventName });
                }}
              >
                <Text style={styles.eventButtonText}>{eventName} →</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    maxHeight: 450,
    width: '100%',
    marginVertical: 12,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 6,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#00d2ff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  codeBlock: {
    backgroundColor: '#2d2d2d',
    padding: 10,
    borderRadius: 6,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: '#a9ffb4',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  eventButton: {
    backgroundColor: '#ff79c6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  eventButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noEventsText: {
    color: '#aaa',
    fontStyle: 'italic',
    fontSize: 12,
  },
});


export const MonitorButton = ({ actorRef }: { actorRef: AnyActorRef }) => {
const [isOpen, setIsOpen] = React.useState(false);

return (
  <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}>
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={{
        backgroundColor: '#ff79c6',
        padding: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isOpen ? 'Close Monitor' : 'Open Monitor'}</Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={{ marginTop: 10, width: 300, maxHeight: 400 }}>
        <MachineMonitorPanel actorRef={actorRef} />
      </View>
    )}
  </View>
);  

}

export function RootMonitor() { 
    const actorRef = RootActorContext.useActorRef();
    return <MonitorButton actorRef={actorRef} />
}




export default MonitorButton;