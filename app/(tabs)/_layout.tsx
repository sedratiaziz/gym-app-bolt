import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1, backgroundColor: '#12221C' }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={pathname === '/(tabs)' || pathname === '/(tabs)/index' ? styles.navItemActive : styles.navItem}
          onPress={() => router.push('/(tabs)')}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.navIcon} />
          <Text style={pathname === '/(tabs)' || pathname === '/(tabs)/index' ? styles.navLabelActive : styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pathname.startsWith('/(tabs)/workouts') ? styles.navItemActive : styles.navItem}
          onPress={() => router.push('/(tabs)/workouts')}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.navIcon} />
          <Text style={pathname.startsWith('/(tabs)/workouts') ? styles.navLabelActive : styles.navLabel}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pathname.startsWith('/(tabs)/progress') ? styles.navItemActive : styles.navItem}
          onPress={() => router.push('/(tabs)/progress')}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.navIcon} />
          <Text style={pathname.startsWith('/(tabs)/progress') ? styles.navLabelActive : styles.navLabel}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pathname.startsWith('/(tabs)/profile') ? styles.navItemActive : styles.navItem}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Image source={require('../../assets/images/icon.png')} style={styles.navIcon} />
          <Text style={pathname.startsWith('/(tabs)/profile') ? styles.navLabelActive : styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#12221C',
    borderTopWidth: 1,
    borderTopColor: '#22332B',
    height: 70,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    width: 28,
    height: 28,
    marginBottom: 2,
    tintColor: '#6FCF97',
  },
  navLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  navLabelActive: {
    color: '#6FCF97',
    fontSize: 13,
    fontWeight: '700',
  },
});