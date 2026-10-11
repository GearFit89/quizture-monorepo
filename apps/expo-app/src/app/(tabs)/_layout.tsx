import { Tabs } from 'expo-router'
import { BottomNav } from '@/components/navigation/bottom-nav-bav'

export default function TabsLayout () {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name='index' options={{ title: 'Home' }} />
      <Tabs.Screen name='practice' options={{ title: 'Practice Quizzing' }} />
      <Tabs.Screen name='settings' options={{ title: 'Settings' }} />
    </Tabs>
  )
}
