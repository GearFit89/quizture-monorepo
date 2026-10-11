import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, clientPersister } from '@/lib/persist-query'
import '../global.css'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StylesProvider, ContentProvider, RootActorProvider } from '@/providers'
import { FloatingStyleEditorButton } from '@/components/styles/floating-button'

export default function RootLayout () {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: clientPersister }}
        >
          <RootActorProvider>
            <StylesProvider>
              <ContentProvider>
                <Stack>
                  <Stack.Screen
                    name='(tabs)'
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name='setup' options={{ headerShown: false }} />
                </Stack>
                <FloatingStyleEditorButton />
              </ContentProvider>
            </StylesProvider>
          </RootActorProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
