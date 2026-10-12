// components/navigation/custom-bottom-nav.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from "@/components/icon"
import { useStyleTarget } from '@/hooks';
import { AnyStyle } from '@/lib/styles';
import { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';

export function BottomNav(props: BottomTabBarProps ) {
  const router = useRouter()
  const pathname = usePathname();
  const insets = useSafeAreaInsets();


  const navItems = [
    { name: 'Home', path: '/(tabs)/', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Search', path: '/(tabs)/search', icon: 'search-outline', activeIcon: 'search' },
    { name: 'Profile', path: '/(tabs)/profile', icon: 'person-outline', activeIcon: 'person' },
    {name: "Practice", path: '/(tabs)/practice', icon: "book-outline", activeIcon: "book"}
  ];
  const { styles } = useStyleTarget("bottomNav")

  return (
    <View style={[styles.navContainer , { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path === '/(tabs)/' && pathname === '/');

        return (
          <TouchableOpacity
            key={item.path}
            style={styles.navItem }
            activeOpacity={0.7}
            onPress={() => router.replace(item.path as any)}
          >
            <Icon
              name={(isActive ? item.activeIcon : item.icon) as any}
              size={24}
              color={isActive ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[styles.navLabel, { color: isActive ? '#007AFF' : '#8E8E93' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

